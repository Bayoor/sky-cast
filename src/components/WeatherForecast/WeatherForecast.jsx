import styles from './WeatherForecast.module.css';
import { WEATHER_CONDITIONS } from '../../utils/constants';
import { 
  formatTemperature, 
  getDayName, 
  capitalizeWords 
} from '../../utils/formatters';

const ForecastCard = ({ day, temperatureUnit, isToday = false }) => {
  const { summary } = day;
  const date = new Date(day.timestamp * 1000);
  
  const weatherCondition = WEATHER_CONDITIONS[summary.weather.id] || {
    icon: '🌍',
    description: capitalizeWords(summary.weather.description)
  };

  const dayName = isToday ? 'Today' : getDayName(date, true);

  return (
    <div className={`${styles.card} ${isToday ? styles.today : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.day}>{dayName}</div>
        <div className={styles.date}>
          {date.getMonth() + 1}/{date.getDate()}
        </div>
      </div>

      <div 
        className={styles.cardIcon}
        style={{ '--animation-delay': `${Math.random() * 2}s` }}
      >
        {weatherCondition.icon}
      </div>

      <div className={styles.cardWeather}>
        <div className={styles.description}>
          {capitalizeWords(summary.weather.main)}
        </div>
        <div className={styles.temperatures}>
          <span className={styles.tempHigh}>
            {formatTemperature(summary.temp_max, temperatureUnit)}
          </span>
          <span className={styles.tempLow}>
            {formatTemperature(summary.temp_min, temperatureUnit)}
          </span>
        </div>
      </div>

      <div className={styles.cardDetails}>
        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>💧</span>
          <span className={styles.detailText}>{summary.humidity}%</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>💨</span>
          <span className={styles.detailText}>
            {Math.round(summary.wind_speed)} m/s
          </span>
        </div>
      </div>
    </div>
  );
};

const WeatherForecast = ({ 
  forecastData, 
  temperatureUnit = 'celsius',
  showDays = 5 
}) => {
  if (!forecastData || forecastData.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>5-Day Forecast</h2>
        </div>
        <div className={styles.noData}>
          <p>No forecast data available</p>
        </div>
      </div>
    );
  }

  const displayDays = forecastData.slice(0, showDays);
  const today = new Date();
  const todayDateString = today.toDateString();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>5-Day Forecast</h2>
      </div>

      <div className={styles.forecastGrid}>
        {displayDays.map((day, index) => {
          const dayDate = new Date(day.timestamp * 1000);
          const dayDateString = dayDate.toDateString();
          const isToday = dayDateString === todayDateString;
          
          return (
            <ForecastCard
              key={day.timestamp || index}
              day={day}
              temperatureUnit={temperatureUnit}
              isToday={isToday}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;