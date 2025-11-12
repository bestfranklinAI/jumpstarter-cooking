// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

function getValue<T>(key: string, initialValue: T | (() => T)) {
  const savedValue = localStorage.getItem(key);
  if (savedValue) {
    try {
      return JSON.parse(savedValue);
    } catch (error) {
      console.error(`Error parsing localStorage key “${key}”:`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  }

  return initialValue instanceof Function ? initialValue() : initialValue;
}

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => getValue(key, initialValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
