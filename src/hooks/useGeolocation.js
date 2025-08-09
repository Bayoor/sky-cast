import { useState, useCallback, useRef } from 'react';
import { geolocationService } from '../services/geolocation';

export const useGeolocation = () => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permission, setPermission] = useState('prompt');
  const watchIdRef = useRef(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getCurrentPosition = useCallback(async () => {
    if (!geolocationService.isSupported()) {
      setError('Geolocation is not supported by this browser');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const pos = await geolocationService.getCurrentPosition();
      setPosition(pos);
      setPermission('granted');
      return pos;
    } catch (err) {
      setError(err.message);
      setPermission('denied');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const watchPosition = useCallback((onPositionUpdate, onError) => {
    if (!geolocationService.isSupported()) {
      const error = new Error('Geolocation is not supported by this browser');
      onError?.(error);
      return null;
    }

    // Clear existing watch if any
    if (watchIdRef.current) {
      geolocationService.clearWatch(watchIdRef.current);
    }

    const watchId = geolocationService.watchPosition(
      (pos) => {
        setPosition(pos);
        setPermission('granted');
        onPositionUpdate?.(pos);
      },
      (err) => {
        setError(err.message);
        setPermission('denied');
        onError?.(err);
      }
    );

    watchIdRef.current = watchId;
    return watchId;
  }, []);

  const clearWatch = useCallback(() => {
    if (watchIdRef.current) {
      geolocationService.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const checkPermission = useCallback(async () => {
    try {
      const permissionState = await geolocationService.requestPermission();
      setPermission(permissionState);
      return permissionState;
    } catch (err) {
      console.warn('Permission check failed:', err);
      return 'prompt';
    }
  }, []);

  // Cleanup watch on unmount
  const cleanup = useCallback(() => {
    clearWatch();
  }, [clearWatch]);

  return {
    position,
    loading,
    error,
    permission,
    isSupported: geolocationService.isSupported(),
    getCurrentPosition,
    watchPosition,
    clearWatch,
    checkPermission,
    clearError,
    cleanup
  };
};