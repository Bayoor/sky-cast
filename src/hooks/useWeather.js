import { useState, useEffect, useCallback } from 'react';
import { weatherAPI } from '../services/weatherAPI';
import { localStorageService } from '../services/localStorage';
import { ERROR_MESSAGES } from '../utils/constants';

export const useWeather = (initialLocation = null) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherAPI.getCompleteWeatherByCoords(lat, lon);
      
      setWeatherData(data.current);
      setForecastData(data.forecast);
      setLocation(data.location);
      setLastUpdated(new Date());
      
      // Save to local storage
      localStorageService.setLastLocation(data.location);
      localStorageService.addRecentSearch(data.location);
      
      return data;
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.GENERIC_ERROR;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCity = useCallback(async (cityName) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherAPI.getCompleteWeatherByCity(cityName);
      
      setWeatherData(data.current);
      setForecastData(data.forecast);
      setLocation(data.location);
      setLastUpdated(new Date());
      
      // Save to local storage
      localStorageService.setLastLocation(data.location);
      localStorageService.addRecentSearch(data.location);
      
      return data;
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.GENERIC_ERROR;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshWeather = useCallback(async () => {
    if (!location) return;
    
    try {
      if (location.lat && location.lon) {
        await fetchWeatherByCoords(location.lat, location.lon);
      } else if (location.name) {
        await fetchWeatherByCity(location.name);
      }
    } catch (err) {
      // Error is already handled in fetch functions
    }
  }, [location, fetchWeatherByCoords, fetchWeatherByCity]);

  const searchLocations = useCallback(async (query) => {
    if (!query || query.length < 3) return [];
    
    try {
      const suggestions = await weatherAPI.searchCities(query, 5);
      return suggestions || [];
    } catch (err) {
      console.warn('Location search failed:', err.message);
      return [];
    }
  }, []);

  // Load last known location on mount
  useEffect(() => {
    const loadLastLocation = async () => {
      if (initialLocation) {
        // Use provided initial location
        if (initialLocation.lat && initialLocation.lon) {
          await fetchWeatherByCoords(initialLocation.lat, initialLocation.lon);
        } else if (initialLocation.name) {
          await fetchWeatherByCity(initialLocation.name);
        }
        return;
      }

      // Try to load from local storage
      const lastLocation = localStorageService.getLastLocation();
      
      if (lastLocation && localStorageService.isLastLocationFresh()) {
        setLocation(lastLocation);
        // Fetch fresh data
        if (lastLocation.lat && lastLocation.lon) {
          await fetchWeatherByCoords(lastLocation.lat, lastLocation.lon);
        }
      }
    };

    loadLastLocation();
  }, [initialLocation, fetchWeatherByCoords, fetchWeatherByCity]);

  return {
    weatherData,
    forecastData,
    location,
    loading,
    error,
    lastUpdated,
    fetchWeatherByCoords,
    fetchWeatherByCity,
    refreshWeather,
    searchLocations,
    clearError,
    setLocation,
    setWeatherData,
    setForecastData
  };
};