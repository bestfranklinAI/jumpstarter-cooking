// src/hooks/useFilters.ts
import { useState } from 'react';
import type { Filters } from '../types';

export const initialFilters: Filters = {
  sortBy: 'distance',
  categories: [],
  stores: [],
  dietary: [],
  priceMax: 200,
};

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => setFilters(initialFilters);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
};
