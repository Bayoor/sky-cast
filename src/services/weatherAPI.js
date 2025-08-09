import { API_CONFIG, ERROR_MESSAGES } from '../utils/constants.js';

class WeatherAPIService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.geoURL = API_CONFIG.GEO_URL;
    this.apiKey = API_CONFIG.API_KEY;
    
    if (!this.apiKey) {
      console.warn('OpenWeatherMap API key is not configured');
    }
  }

  /**
   * Make API request with error handling
   */
  async makeRequest(url) {
    if (!this.apiKey) {
      throw new Error(ERROR_MESSAGES.API_KEY_MISSING);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.API_TIMEOUT || 8000);
      
      const response = await fetch(url, { 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(ERROR_MESSAGES.LOCATION_NOT_FOUND);
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.message.includes('fetch')) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }
      throw error;
    }
  }

  /**
   * Get current weather by coordinates
   */
  async getCurrentWeatherByCoords(lat, lon) {
    const url = `${this.baseURL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${API_CONFIG.UNITS}&lang=${API_CONFIG.LANGUAGE}`;
    return this.makeRequest(url);
  }

  /**
   * Get current weather by city name
   */
  async getCurrentWeatherByCity(cityName) {
    const url = `${this.baseURL}/weather?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=${API_CONFIG.UNITS}&lang=${API_CONFIG.LANGUAGE}`;
    return this.makeRequest(url);
  }

  /**
   * Get 5-day weather forecast by coordinates
   */
  async getForecastByCoords(lat, lon) {
    const url = `${this.baseURL}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${API_CONFIG.UNITS}&lang=${API_CONFIG.LANGUAGE}`;
    return this.makeRequest(url);
  }

  /**
   * Get 5-day weather forecast by city name
   */
  async getForecastByCity(cityName) {
    const url = `${this.baseURL}/forecast?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=${API_CONFIG.UNITS}&lang=${API_CONFIG.LANGUAGE}`;
    return this.makeRequest(url);
  }

  /**
   * Search for cities by name (geocoding)
   */
  async searchCities(query, limit = 5) {
    const url = `${this.geoURL}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${this.apiKey}`;
    return this.makeRequest(url);
  }

  /**
   * Get city name by coordinates (reverse geocoding)
   */
  async getCityByCoords(lat, lon) {
    const url = `${this.geoURL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`;
    const results = await this.makeRequest(url);
    return results[0] || null;
  }

  /**
   * Get complete weather data (current + forecast) by coordinates
   */
  async getCompleteWeatherByCoords(lat, lon) {
    try {
      const [current, forecast] = await Promise.all([
        this.getCurrentWeatherByCoords(lat, lon),
        this.getForecastByCoords(lat, lon)
      ]);

      return {
        current,
        forecast: this.processForecastData(forecast),
        location: {
          lat,
          lon,
          name: current.name,
          country: current.sys.country
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get complete weather data (current + forecast) by city name
   */
  async getCompleteWeatherByCity(cityName) {
    try {
      const [current, forecast] = await Promise.all([
        this.getCurrentWeatherByCity(cityName),
        this.getForecastByCity(cityName)
      ]);

      return {
        current,
        forecast: this.processForecastData(forecast),
        location: {
          lat: current.coord.lat,
          lon: current.coord.lon,
          name: current.name,
          country: current.sys.country
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Process forecast data to group by days
   */
  processForecastData(forecastData) {
    const dailyForecasts = new Map();
    
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyForecasts.has(dateKey)) {
        dailyForecasts.set(dateKey, {
          date: dateKey,
          timestamp: item.dt,
          items: []
        });
      }
      
      dailyForecasts.get(dateKey).items.push(item);
    });

    // Convert to array and add daily summaries
    const processedDays = Array.from(dailyForecasts.values()).map(day => {
      const temps = day.items.map(item => item.main.temp);
      const conditions = day.items.map(item => item.weather[0]);
      
      // Find most common weather condition
      const conditionCounts = conditions.reduce((acc, condition) => {
        acc[condition.id] = (acc[condition.id] || 0) + 1;
        return acc;
      }, {});
      
      const mostCommonConditionId = Object.keys(conditionCounts).reduce((a, b) => 
        conditionCounts[a] > conditionCounts[b] ? a : b
      );
      
      const mostCommonCondition = conditions.find(c => c.id.toString() === mostCommonConditionId);

      return {
        ...day,
        summary: {
          temp_min: Math.min(...temps),
          temp_max: Math.max(...temps),
          weather: mostCommonCondition,
          humidity: Math.round(day.items.reduce((sum, item) => sum + item.main.humidity, 0) / day.items.length),
          wind_speed: day.items.reduce((sum, item) => sum + item.wind.speed, 0) / day.items.length
        }
      };
    });

    // Sort by timestamp to ensure correct chronological order
    processedDays.sort((a, b) => a.timestamp - b.timestamp);
    
    return processedDays.slice(0, 5); // Return max 5 days
  }
}

// Create and export singleton instance
export const weatherAPI = new WeatherAPIService();
export default weatherAPI;