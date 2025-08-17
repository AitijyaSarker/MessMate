
import React, { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
        // Use the functional update form of useState's setter to avoid stale state issues.
        // This ensures that when we derive the new state, it's always from the most recent previous state.
        setStoredValue(currentStoredValue => {
            const valueToStore = value instanceof Function ? value(currentStoredValue) : value;
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
            return valueToStore;
        });
    } catch (error)      {
      console.error(error);
    }
  };
  
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch(e) {
      console.error(e)
    }
  
  }, []);

  return [storedValue, setValue];
}