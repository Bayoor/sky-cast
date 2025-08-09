import styles from './ErrorDisplay.module.css';

const ErrorDisplay = ({ 
  message = 'Something went wrong', 
  onRetry, 
  showRetry = true 
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠️</div>
      <h3 className={styles.title}>Oops!</h3>
      <p className={styles.message}>{message}</p>
      {showRetry && onRetry && (
        <button className={styles.retryButton} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;