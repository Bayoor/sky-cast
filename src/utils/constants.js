// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  GEO_URL: 'https://api.openweathermap.org/geo/1.0',
  API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
  UNITS: 'metric', // metric, imperial, kelvin
  LANGUAGE: 'en'
};

// Weather condition codes mapping
export const WEATHER_CONDITIONS = {
  // Thunderstorm
  200: { icon: '⛈️', description: 'Thunderstorm with light rain' },
  201: { icon: '⛈️', description: 'Thunderstorm with rain' },
  202: { icon: '⛈️', description: 'Thunderstorm with heavy rain' },
  210: { icon: '🌩️', description: 'Light thunderstorm' },
  211: { icon: '⛈️', description: 'Thunderstorm' },
  212: { icon: '⛈️', description: 'Heavy thunderstorm' },
  221: { icon: '⛈️', description: 'Ragged thunderstorm' },
  230: { icon: '⛈️', description: 'Thunderstorm with light drizzle' },
  231: { icon: '⛈️', description: 'Thunderstorm with drizzle' },
  232: { icon: '⛈️', description: 'Thunderstorm with heavy drizzle' },

  // Drizzle
  300: { icon: '🌦️', description: 'Light intensity drizzle' },
  301: { icon: '🌦️', description: 'Drizzle' },
  302: { icon: '🌦️', description: 'Heavy intensity drizzle' },
  310: { icon: '🌦️', description: 'Light intensity drizzle rain' },
  311: { icon: '🌦️', description: 'Drizzle rain' },
  312: { icon: '🌦️', description: 'Heavy intensity drizzle rain' },
  313: { icon: '🌦️', description: 'Shower rain and drizzle' },
  314: { icon: '🌦️', description: 'Heavy shower rain and drizzle' },
  321: { icon: '🌦️', description: 'Shower drizzle' },

  // Rain
  500: { icon: '🌧️', description: 'Light rain' },
  501: { icon: '🌧️', description: 'Moderate rain' },
  502: { icon: '🌧️', description: 'Heavy intensity rain' },
  503: { icon: '🌧️', description: 'Very heavy rain' },
  504: { icon: '🌧️', description: 'Extreme rain' },
  511: { icon: '🌧️', description: 'Freezing rain' },
  520: { icon: '🌦️', description: 'Light intensity shower rain' },
  521: { icon: '🌦️', description: 'Shower rain' },
  522: { icon: '🌦️', description: 'Heavy intensity shower rain' },
  531: { icon: '🌦️', description: 'Ragged shower rain' },

  // Snow
  600: { icon: '🌨️', description: 'Light snow' },
  601: { icon: '❄️', description: 'Snow' },
  602: { icon: '❄️', description: 'Heavy snow' },
  611: { icon: '🌨️', description: 'Sleet' },
  612: { icon: '🌨️', description: 'Light shower sleet' },
  613: { icon: '🌨️', description: 'Shower sleet' },
  615: { icon: '🌨️', description: 'Light rain and snow' },
  616: { icon: '🌨️', description: 'Rain and snow' },
  620: { icon: '🌨️', description: 'Light shower snow' },
  621: { icon: '❄️', description: 'Shower snow' },
  622: { icon: '❄️', description: 'Heavy shower snow' },

  // Clear
  800: { icon: '☀️', description: 'Clear sky' },

  // Clouds
  801: { icon: '🌤️', description: 'Few clouds' },
  802: { icon: '⛅', description: 'Scattered clouds' },
  803: { icon: '☁️', description: 'Broken clouds' },
  804: { icon: '☁️', description: 'Overcast clouds' },

  // Atmosphere
  701: { icon: '🌫️', description: 'Mist' },
  711: { icon: '💨', description: 'Smoke' },
  721: { icon: '🌫️', description: 'Haze' },
  731: { icon: '💨', description: 'Sand/dust whirls' },
  741: { icon: '🌫️', description: 'Fog' },
  751: { icon: '💨', description: 'Sand' },
  761: { icon: '💨', description: 'Dust' },
  762: { icon: '🌋', description: 'Volcanic ash' },
  771: { icon: '💨', description: 'Squalls' },
  781: { icon: '🌪️', description: 'Tornado' }
};

// Temperature units
export const TEMPERATURE_UNITS = {
  CELSIUS: 'celsius',
  FAHRENHEIT: 'fahrenheit'
};

// Local storage keys
export const STORAGE_KEYS = {
  RECENT_SEARCHES: 'skycast_recent_searches',
  PREFERRED_UNIT: 'skycast_preferred_unit',
  THEME: 'skycast_theme',
  LAST_LOCATION: 'skycast_last_location'
};

// App settings
export const APP_SETTINGS = {
  MAX_RECENT_SEARCHES: 5,
  DEFAULT_LOCATION: 'London',
  REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes
  GEOLOCATION_TIMEOUT: 10000, // 10 seconds
  API_TIMEOUT: 8000 // 8 seconds
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to weather service. Please check your internet connection.',
  API_KEY_MISSING: 'Weather API key is not configured. Please add VITE_OPENWEATHER_API_KEY to your environment variables.',
  LOCATION_NOT_FOUND: 'Location not found. Please try a different search term.',
  GEOLOCATION_DENIED: 'Location access denied. Please enter a location manually.',
  GEOLOCATION_UNAVAILABLE: 'Geolocation is not available in your browser.',
  GEOLOCATION_TIMEOUT: 'Location request timed out. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again later.'
};