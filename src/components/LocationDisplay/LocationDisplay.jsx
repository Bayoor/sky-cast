import styles from './LocationDisplay.module.css';
import { formatDateTime, getRelativeTime } from '../../utils/formatters';
import Button from '../UI/Button';

const LocationDisplay = ({ 
  location, 
  lastUpdated, 
  onRefresh, 
  onUnitToggle,
  temperatureUnit = 'celsius',
  loading = false 
}) => {
  if (!location) {
    return null;
  }

  const { name, country, lat, lon } = location;
  
  const displayName = name === 'Current Location' 
    ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
          >
            <path 
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
              fill="currentColor"
            />
          </svg>
          {name}
        </span>
      )
    : `${name}${country ? `, ${country}` : ''}`;

  const coordinates = `${lat?.toFixed(2)}°, ${lon?.toFixed(2)}°`;
  const updatedTime = lastUpdated ? getRelativeTime(new Date(lastUpdated)) : null;

  const handleUnitToggle = () => {
    const newUnit = temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    onUnitToggle?.(newUnit);
  };

  return (
    <div className={styles.container}>
      <div className={styles.locationInfo}>
        <div className={styles.primaryInfo}>
          <h1 className={styles.locationName}>
            {displayName}
          </h1>
          <div className={styles.coordinates}>
            {coordinates}
          </div>
        </div>

        <div className={styles.metadata}>
          {updatedTime && (
            <div className={styles.lastUpdated}>
              Updated {updatedTime}
            </div>
          )}
        </div>
      </div>

      <div className={styles.controls}>
        <Button
          variant="ghost"
          size="small"
          onClick={handleUnitToggle}
          className={styles.unitToggle}
        >
          °{temperatureUnit === 'celsius' ? 'C' : 'F'}
        </Button>

        <Button
          variant="ghost"
          size="small"
          onClick={onRefresh}
          disabled={loading}
          className={styles.refreshButton}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={loading ? styles.spinning : ''}
          >
            <path
              d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
              fill="currentColor"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default LocationDisplay;