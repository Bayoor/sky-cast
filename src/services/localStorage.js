import { STORAGE_KEYS, APP_SETTINGS } from '../utils/constants.js';

class LocalStorageService {
  /**
   * Check if localStorage is available
   */
  isAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get item from localStorage with error handling
   */
  getItem(key) {
    if (!this.isAvailable()) return null;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Error reading from localStorage for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage with error handling
   */
  setItem(key, value) {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key) {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from localStorage for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all localStorage data
   */
  clear() {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
      return false;
    }
  }

  // Specific methods for weather app data

  /**
   * Get recent searches
   */
  getRecentSearches() {
    return this.getItem(STORAGE_KEYS.RECENT_SEARCHES) || [];
  }

  /**
   * Add a search to recent searches
   */
  addRecentSearch(location) {
    const searches = this.getRecentSearches();
    
    // Remove if already exists (to avoid duplicates)
    const filtered = searches.filter(search => 
      search.name !== location.name || search.country !== location.country
    );
    
    // Add to beginning of array
    filtered.unshift(location);
    
    // Keep only the maximum number of searches
    const limited = filtered.slice(0, APP_SETTINGS.MAX_RECENT_SEARCHES);
    
    this.setItem(STORAGE_KEYS.RECENT_SEARCHES, limited);
  }

  /**
   * Clear recent searches
   */
  clearRecentSearches() {
    return this.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
  }

  /**
   * Get preferred temperature unit
   */
  getPreferredUnit() {
    return this.getItem(STORAGE_KEYS.PREFERRED_UNIT) || 'celsius';
  }

  /**
   * Set preferred temperature unit
   */
  setPreferredUnit(unit) {
    return this.setItem(STORAGE_KEYS.PREFERRED_UNIT, unit);
  }

  /**
   * Get theme preference
   */
  getTheme() {
    return this.getItem(STORAGE_KEYS.THEME) || 'light';
  }

  /**
   * Set theme preference
   */
  setTheme(theme) {
    return this.setItem(STORAGE_KEYS.THEME, theme);
  }

  /**
   * Get last known location
   */
  getLastLocation() {
    return this.getItem(STORAGE_KEYS.LAST_LOCATION);
  }

  /**
   * Set last known location
   */
  setLastLocation(location) {
    const locationData = {
      ...location,
      timestamp: Date.now()
    };
    return this.setItem(STORAGE_KEYS.LAST_LOCATION, locationData);
  }

  /**
   * Check if last location is still fresh (within 1 hour)
   */
  isLastLocationFresh() {
    const lastLocation = this.getLastLocation();
    if (!lastLocation || !lastLocation.timestamp) return false;
    
    const oneHour = 60 * 60 * 1000;
    return (Date.now() - lastLocation.timestamp) < oneHour;
  }
}

// Create and export singleton instance
export const localStorageService = new LocalStorageService();
export default localStorageService;