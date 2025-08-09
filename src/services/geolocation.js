import { APP_SETTINGS, ERROR_MESSAGES } from '../utils/constants.js';

class GeolocationService {
  /**
   * Check if geolocation is supported
   */
  isSupported() {
    return 'geolocation' in navigator;
  }

  /**
   * Get current position using browser geolocation API
   */
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error(ERROR_MESSAGES.GEOLOCATION_UNAVAILABLE));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: APP_SETTINGS.GEOLOCATION_TIMEOUT || 10000,
        maximumAge: 5 * 60 * 1000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        (error) => {
          let errorMessage;
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = ERROR_MESSAGES.GEOLOCATION_DENIED;
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = ERROR_MESSAGES.GEOLOCATION_UNAVAILABLE;
              break;
            case error.TIMEOUT:
              errorMessage = ERROR_MESSAGES.GEOLOCATION_TIMEOUT;
              break;
            default:
              errorMessage = ERROR_MESSAGES.GENERIC_ERROR;
          }
          
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  /**
   * Watch position changes (for future use)
   */
  watchPosition(onSuccess, onError) {
    if (!this.isSupported()) {
      onError(new Error(ERROR_MESSAGES.GEOLOCATION_UNAVAILABLE));
      return null;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: APP_SETTINGS.GEOLOCATION_TIMEOUT || 10000,
      maximumAge: 1 * 60 * 1000 // 1 minute
    };

    return navigator.geolocation.watchPosition(
      (position) => {
        onSuccess({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      (error) => {
        let errorMessage;
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = ERROR_MESSAGES.GEOLOCATION_DENIED;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = ERROR_MESSAGES.GEOLOCATION_UNAVAILABLE;
            break;
          case error.TIMEOUT:
            errorMessage = ERROR_MESSAGES.GEOLOCATION_TIMEOUT;
            break;
          default:
            errorMessage = ERROR_MESSAGES.GENERIC_ERROR;
        }
        
        onError(new Error(errorMessage));
      },
      options
    );
  }

  /**
   * Clear position watcher
   */
  clearWatch(watchId) {
    if (watchId && this.isSupported()) {
      navigator.geolocation.clearWatch(watchId);
    }
  }

  /**
   * Request permission for geolocation (for browsers that support it)
   */
  async requestPermission() {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return permission.state; // 'granted', 'denied', or 'prompt'
      } catch (error) {
        // Fallback for browsers that don't support permissions API
        return 'prompt';
      }
    }
    return 'prompt';
  }
}

// Create and export singleton instance
export const geolocationService = new GeolocationService();
export default geolocationService;