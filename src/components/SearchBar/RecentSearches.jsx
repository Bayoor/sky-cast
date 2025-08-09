import {  useRef, useEffect } from 'react';
import styles from './RecentSearches.module.css';
import { useRecentSearches } from '../../hooks/useLocalStorage';

const RecentSearches = ({ onLocationSelect, show, onClose }) => {
  const { searches, clearSearches } = useRecentSearches();
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [show, onClose]);

  if (!show || searches.length === 0) {
    return null;
  }

  const handleSearchClick = (search) => {
    onLocationSelect(search);
    onClose?.();
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Recent Searches</span>
        <button
          className={styles.clearButton}
          onMouseDown={clearSearches}
          type="button"
        >
          Clear
        </button>
      </div>
      
      <div className={styles.searchList}>
        {searches.map((search, index) => (
          <button
            key={`${search.lat}-${search.lon}-${index}`}
            className={styles.searchItem}
            onMouseDown={() => handleSearchClick(search)}
            type="button"
          >
            <div className={styles.searchInfo}>
              <span className={styles.searchName}>{search.name}</span>
              {search.country && (
                <span className={styles.searchCountry}>{search.country}</span>
              )}
            </div>
            <div className={styles.searchIcon}>
              🕒
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;