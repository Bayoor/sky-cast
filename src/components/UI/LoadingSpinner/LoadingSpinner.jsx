import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', inline = false }) => {
  if (inline) {
    return <div className={`${styles.spinner} ${styles[size]}`}></div>;
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`}></div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;