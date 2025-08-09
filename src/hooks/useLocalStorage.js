import { useState, useCallback, useEffect } from 'react';
import { localStorageService } from '../services/localStorage';

export const useLocalStorage = (key, initialValue = null) => {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = localStorageService.getItem(key);
      return storedValue !== null ? storedValue : initialValue;
    } catch (error) {
      console.warn(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setStoredValue = useCallback((newValue) => {
    try {
      // Allow function updaters like regular setState
      const valueToStore = typeof newValue === 'function' ? newValue(value) : newValue;
      
      setValue(valueToStore);
      
      if (valueToStore === null || valueToStore === undefined) {
        localStorageService.removeItem(key);
      } else {
        localStorageService.setItem(key, valueToStore);
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  const removeStoredValue = useCallback(() => {
    try {
      setValue(initialValue);
      localStorageService.removeItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [value, setStoredValue, removeStoredValue];
};

// Specialized hooks for weather app data
export const useRecentSearches = () => {
  const [searches, setSearches] = useState(() => 
    localStorageService.getRecentSearches()
  );

  const addSearch = useCallback((location) => {
    localStorageService.addRecentSearch(location);
    setSearches(localStorageService.getRecentSearches());
  }, []);

  const clearSearches = useCallback(() => {
    localStorageService.clearRecentSearches();
    setSearches([]);
  }, []);

  return {
    searches,
    addSearch,
    clearSearches
  };
};

export const usePreferredUnit = () => {
  const [unit, setUnit] = useState(() => 
    localStorageService.getPreferredUnit()
  );

  const setPreferredUnit = useCallback((newUnit) => {
    localStorageService.setPreferredUnit(newUnit);
    setUnit(newUnit);
  }, []);

  return [unit, setPreferredUnit];
};

export const useTheme = () => {
  const [theme, setTheme] = useState(() => 
    localStorageService.getTheme()
  );

  const setStoredTheme = useCallback((newTheme) => {
    localStorageService.setTheme(newTheme);
    setTheme(newTheme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setStoredTheme(newTheme);
  }, [theme, setStoredTheme]);

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return {
    theme,
    setTheme: setStoredTheme,
    toggleTheme
  };
};

export const useLastLocation = () => {
  const [location, setLocation] = useState(() => 
    localStorageService.getLastLocation()
  );

  const setLastLocation = useCallback((newLocation) => {
    localStorageService.setLastLocation(newLocation);
    setLocation(localStorageService.getLastLocation());
  }, []);

  const clearLastLocation = useCallback(() => {
    localStorageService.removeItem('skycast_last_location');
    setLocation(null);
  }, []);

  const isLocationFresh = useCallback(() => {
    return localStorageService.isLastLocationFresh();
  }, []);

  return {
    location,
    setLastLocation,
    clearLastLocation,
    isLocationFresh
  };
};