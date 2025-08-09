import { TEMPERATURE_UNITS } from './constants.js';

/**
 * Format temperature with unit symbol and conversion
 */
export const formatTemperature = (temp, unit = TEMPERATURE_UNITS.CELSIUS) => {
  if (temp === null || temp === undefined) return '--';
  
  let convertedTemp = temp;
  
  // Convert if needed (API returns Celsius by default)
  if (unit === TEMPERATURE_UNITS.FAHRENHEIT) {
    convertedTemp = celsiusToFahrenheit(temp);
  }
  
  const rounded = Math.round(convertedTemp);
  const symbol = unit === TEMPERATURE_UNITS.FAHRENHEIT ? '°F' : '°C';
  
  return `${rounded}${symbol}`;
};

/**
 * Convert Celsius to Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9/5) + 32;
};

/**
 * Convert Fahrenheit to Celsius
 */
export const fahrenheitToCelsius = (fahrenheit) => {
  return (fahrenheit - 32) * 5/9;
};

/**
 * Format date for display
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
};

/**
 * Format time for display
 */
export const formatTime = (date, options = {}) => {
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
};

/**
 * Format date and time for display
 */
export const formatDateTime = (date) => {
  return `${formatDate(date, { weekday: 'short', month: 'short', day: 'numeric' })} ${formatTime(date)}`;
};

/**
 * Get day name from date
 */
export const getDayName = (date, short = false) => {
  const options = { weekday: short ? 'short' : 'long' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Format wind speed
 */
export const formatWindSpeed = (speed, unit = 'metric') => {
  if (speed === null || speed === undefined) return '--';
  
  const rounded = Math.round(speed);
  const unitLabel = unit === 'imperial' ? 'mph' : 'm/s';
  
  return `${rounded} ${unitLabel}`;
};

/**
 * Format wind direction from degrees
 */
export const formatWindDirection = (degrees) => {
  if (degrees === null || degrees === undefined) return '--';
  
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  
  return directions[index];
};

/**
 * Format humidity percentage
 */
export const formatHumidity = (humidity) => {
  if (humidity === null || humidity === undefined) return '--';
  
  return `${Math.round(humidity)}%`;
};

/**
 * Format pressure
 */
export const formatPressure = (pressure, unit = 'metric') => {
  if (pressure === null || pressure === undefined) return '--';
  
  const unitLabel = unit === 'imperial' ? 'inHg' : 'hPa';
  let value = pressure;
  
  if (unit === 'imperial') {
    value = pressure * 0.02953; // Convert hPa to inHg
  }
  
  return `${Math.round(value)} ${unitLabel}`;
};

/**
 * Format visibility distance
 */
export const formatVisibility = (visibility, unit = 'metric') => {
  if (visibility === null || visibility === undefined) return '--';
  
  const unitLabel = unit === 'imperial' ? 'mi' : 'km';
  let value = visibility;
  
  if (unit === 'imperial') {
    value = visibility * 0.621371; // Convert km to miles
  }
  
  return `${Math.round(value)} ${unitLabel}`;
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  
  return formatDate(date, { month: 'short', day: 'numeric' });
};