import {  useCallback } from 'react';
import './App.css';

import SearchBar from './components/SearchBar';
import LocationDisplay from './components/LocationDisplay';
import CurrentWeather from './components/CurrentWeather';
import WeatherForecast from './components/WeatherForecast';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorDisplay from './components/UI/ErrorDisplay';

import { useWeather } from './hooks/useWeather';
import { useGeolocation } from './hooks/useGeolocation';
import { usePreferredUnit, useTheme } from './hooks/useLocalStorage';

function App() {
  
  const {
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
    clearError
  } = useWeather();

  const {
    getCurrentPosition,
    loading: geoLoading
  } = useGeolocation();

  const [temperatureUnit, setTemperatureUnit] = usePreferredUnit();
  const { theme, toggleTheme } = useTheme();


  const handleLocationSelect = useCallback(async (selectedLocation) => {
    clearError();

    try {
      if (selectedLocation.name === 'Current Location' || (selectedLocation.lat && selectedLocation.lon)) {
        if (selectedLocation.name === 'Current Location') {
          const position = await getCurrentPosition();
          if (position) {
            await fetchWeatherByCoords(position.latitude, position.longitude);
          }
        } else {
          await fetchWeatherByCoords(selectedLocation.lat, selectedLocation.lon);
        }
      } else if (selectedLocation.name) {
        await fetchWeatherByCity(selectedLocation.name);
      }
    } catch (_err) {
    }
  }, [fetchWeatherByCoords, fetchWeatherByCity, getCurrentPosition, clearError]);

  const handleRefresh = useCallback(async () => {
    clearError();
    await refreshWeather();
  }, [refreshWeather, clearError]);

  const handleUnitToggle = useCallback((unit) => {
    setTemperatureUnit(unit);
  }, [setTemperatureUnit]);

  const isInitialLoading = loading && !weatherData;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <h1>☁️ Sky Cast</h1>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        
        <div className="search-section">
          <SearchBar
            onLocationSelect={handleLocationSelect}
            searchFunction={searchLocations}
            placeholder="Search for a city or use current location..."
          />
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-section">
            <ErrorDisplay
              message={error}
              onRetry={handleRefresh}
              showRetry={!!location}
            />
          </div>
        )}

        {isInitialLoading && (
          <div className="loading-section">
            <LoadingSpinner 
              size="large" 
              message="Loading weather data..." 
            />
          </div>
        )}

        {!error && !isInitialLoading && location && (
          <>
            <div className="location-section">
              <LocationDisplay
                location={location}
                lastUpdated={lastUpdated}
                onRefresh={handleRefresh}
                onUnitToggle={handleUnitToggle}
                temperatureUnit={temperatureUnit}
                loading={loading}
              />
            </div>

            {weatherData && (
              <div className="weather-section">
                <CurrentWeather
                  weatherData={weatherData}
                  location={location}
                  temperatureUnit={temperatureUnit}
                />
              </div>
            )}

            {forecastData && (
              <div className="forecast-section">
                <WeatherForecast
                  forecastData={forecastData}
                  temperatureUnit={temperatureUnit}
                />
              </div>
            )}
          </>
        )}

        {!error && !isInitialLoading && !location && (
          <div className="welcome-section">
            <div className="welcome-content">
              <h2>Welcome to Sky Cast</h2>
              <p>Search for a location above or use your current location to get started.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;