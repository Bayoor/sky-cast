import { useState, useEffect } from 'react';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for debounced search functionality
 * @param {function} searchFunction - Function to call for search
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 * @returns {object} - Search state and methods
 */
export const useDebouncedSearch = (searchFunction, delay = 500) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const debouncedQuery = useDebounce(query, delay);

  // Effect to trigger search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery || debouncedQuery.trim() === '') {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchResults = await searchFunction(debouncedQuery.trim());
        setResults(searchResults || []);
      } catch (err) {
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, searchFunction]);

  // Clear search results and query
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setLoading(false);
  };

  // Set query without triggering immediate search
  const updateQuery = (newQuery) => {
    setQuery(newQuery);
    if (newQuery && newQuery.trim() !== '') {
      setLoading(true);
    }
  };

  return {
    query,
    results,
    loading,
    error,
    updateQuery,
    clearSearch,
    isSearching: loading && debouncedQuery.trim() !== ''
  };
};

export default useDebounce;