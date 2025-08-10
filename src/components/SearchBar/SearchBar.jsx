import { useState, useRef, useEffect } from 'react';
import styles from './SearchBar.module.css';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import RecentSearches from './RecentSearches';
import { useDebouncedSearch } from '../../hooks/useDebounce';

const SearchBar = ({ 
  onLocationSelect, 
  searchFunction,
  placeholder = "Search for a city..." 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const {
    query,
    results: suggestions,
    loading,
    updateQuery,
    clearSearch,
    isSearching
  } = useDebouncedSearch(searchFunction, 2000);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Create a manual location object for search
      const manualLocation = {
        name: query.trim(),
        country: '',
        lat: null,
        lon: null
      };
      onLocationSelect(manualLocation);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    updateQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim() !== '') {
      setShowSuggestions(true);
      setShowRecent(false);
    } else {
      setShowSuggestions(false);
      setShowRecent(true);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    setShowSuggestions(false);
    setShowRecent(true);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    const locationName = `${suggestion.name}, ${suggestion.country}`;
    updateQuery(locationName);
    setShowSuggestions(false);
    setShowRecent(false);
    setSelectedIndex(-1);
    onLocationSelect(suggestion);
  };

  const handleInputFocus = () => {
    if (query.trim() === '') {
      setShowRecent(true);
      setShowSuggestions(false);
    } else if (suggestions.length > 0) {
      setShowSuggestions(true);
      setShowRecent(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setShowRecent(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const handleCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationSelect({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: 'Current Location',
            country: ''
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          !inputRef.current?.contains(event.target)) {
        setShowSuggestions(false);
        setShowRecent(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputContainer}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className={styles.input}
          />
          <div className={styles.buttonGroup}>
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={handleClearSearch}
                className={styles.clearButton}
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" 
                    fill="currentColor"
                  />
                </svg>
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="small"
              onClick={handleCurrentLocation}
              className={styles.locationButton}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                  fill="currentColor"
                />
              </svg>
            </Button>
            <Button 
              type="submit" 
              disabled={!query.trim()}
              size="small"
              className={styles.searchButton}
            >
              {isSearching ? (
                <>
                  <LoadingSpinner size="small" inline={true} />
                  <span>Search</span>
                </>
              ) : 'Search'}
            </Button>
          </div>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div ref={suggestionsRef} className={styles.suggestions}>
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.lat}-${suggestion.lon}`}
                type="button"
                className={`${styles.suggestion} ${
                  index === selectedIndex ? styles.selected : ''
                }`}
                onMouseDown={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className={styles.suggestionMain}>
                  <span className={styles.suggestionName}>
                    {suggestion.name}
                  </span>
                  <span className={styles.suggestionCountry}>
                    {suggestion.country}
                  </span>
                </div>
                {suggestion.state && (
                  <span className={styles.suggestionState}>
                    {suggestion.state}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        <RecentSearches
          show={showRecent}
          onLocationSelect={handleSuggestionClick}
          onClose={() => setShowRecent(false)}
        />
      </form>
    </div>
  );
};

export default SearchBar;