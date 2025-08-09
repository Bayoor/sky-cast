import styles from './CurrentWeather.module.css';
import { WEATHER_CONDITIONS } from '../../utils/constants';
import { 
  formatTemperature, 
  formatWindSpeed, 
  formatWindDirection, 
  formatHumidity, 
  formatPressure,
  formatVisibility,
  capitalizeWords 
} from '../../utils/formatters';

const CurrentWeather = ({ 
  weatherData, 
  location, 
  temperatureUnit = 'celsius' 
}) => {
  if (!weatherData) {
    return null;
  }

  const {
    main: { temp, feels_like, humidity, pressure },
    weather: [currentWeather],
    wind = {},
    visibility,
    sys: { sunrise, sunset }
  } = weatherData;

  const weatherCondition = WEATHER_CONDITIONS[currentWeather.id] || {
    icon: '🌍',
    description: capitalizeWords(currentWeather.description)
  };

  const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const sunsetTime = new Date(sunset * 1000).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.weatherIcon}>
          {weatherCondition.icon}
        </div>
        <div className={styles.mainInfo}>
          <div className={styles.temperature}>
            {formatTemperature(temp, temperatureUnit)}
          </div>
          <div className={styles.description}>
            {weatherCondition.description}
          </div>
          <div className={styles.feelsLike}>
            Feels like {formatTemperature(feels_like, temperatureUnit)}
          </div>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>💨</div>
            <div className={styles.detailContent}>
              <div className={styles.detailLabel}>Wind</div>
              <div className={styles.detailValue}>
                {formatWindSpeed(wind.speed)} {formatWindDirection(wind.deg)}
              </div>
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>💧</div>
            <div className={styles.detailContent}>
              <div className={styles.detailLabel}>Humidity</div>
              <div className={styles.detailValue}>
                {formatHumidity(humidity)}
              </div>
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>🌡️</div>
            <div className={styles.detailContent}>
              <div className={styles.detailLabel}>Pressure</div>
              <div className={styles.detailValue}>
                {formatPressure(pressure)}
              </div>
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>👁️</div>
            <div className={styles.detailContent}>
              <div className={styles.detailLabel}>Visibility</div>
              <div className={styles.detailValue}>
                {formatVisibility(visibility / 1000)}
              </div>
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>🌅</div>
            <div className={styles.detailContent}>
              <div className={styles.detailLabel}>Sunrise</div>
              <div className={styles.detailValue}>
                {sunriseTime}
              </div>
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>🌇</div>
            <div className={styles.detailContent}>
              <div className={styles.detailLabel}>Sunset</div>
              <div className={styles.detailValue}>
                {sunsetTime}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;