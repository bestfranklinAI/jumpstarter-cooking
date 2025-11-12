// src/components/discover/FiltersPanel.tsx
import { useEffect, useMemo, useState } from 'react';
import type { Filters } from '../../types';

interface FilterOptions {
  categories: string[];
  stores: string[];
  dietary: string[];
  price: { min: number; max: number };
}

interface FiltersPanelProps {
  filters: Filters;
  defaultFilters: Filters;
  options: FilterOptions;
  onApply: (nextFilters: Filters) => void;
  onReset: () => void;
  onClose: () => void;
}

type MultiSelectKey = 'categories' | 'stores' | 'dietary';

const sortOptions = [
  { label: 'Closest first', value: 'distance' },
  { label: 'Biggest discount', value: 'discount-desc' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Expiring soon', value: 'expiry' },
];

const fallbackCategories = [
  'Bakery',
  'Dairy & Eggs',
  'Ready-to-Eat',
  'Meat & Poultry',
  'Seafood',
  'Produce',
  'Deli & Cheese',
  'Frozen Foods',
  'Pantry Goods',
  'Drinks & Juices',
  'Plant-Based',
  'Desserts',
];

const fallbackDietary = [
  'Vegan',
  'Vegetarian',
  'High Protein',
  'Organic',
  'Ready to Eat',
  'Omega-3',
  'In Season',
  'Plant-powered',
  'Sweet Treat',
];

const fallbackStores = ['Wellcome', 'ParknShop', 'CitySuper', 'YATA', 'Market Place'];

export const FiltersPanel = ({ filters, defaultFilters, options, onApply, onReset, onClose }: FiltersPanelProps) => {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const priceRange = useMemo(() => {
    const fallbackMin = Math.min(defaultFilters.priceMax, 10);
    return {
      min: options.price.min || fallbackMin,
      max: options.price.max || defaultFilters.priceMax,
    };
  }, [options.price.min, options.price.max, defaultFilters.priceMax]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, priceMax: Math.min(prev.priceMax, priceRange.max) }));
  }, [priceRange.max]);

  const toggleMultiselect = (key: MultiSelectKey, value: string) => {
    setLocalFilters(prev => {
      const values = new Set(prev[key]);
      if (values.has(value)) {
        values.delete(value);
      } else {
        values.add(value);
      }
      return { ...prev, [key]: Array.from(values) };
    });
  };

  return (
    <div className="filters-panel" role="dialog" aria-modal="true">
      <div className="filters-content">
        <div className="filters-header">
          <div>
            <p className="filters-subtitle">Tailor what you see</p>
            <h2>Discovery filters</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close filters">
            ×
          </button>
        </div>

        <div className="filter-section">
          <h3>Sort by</h3>
          <div className="chips">
            {sortOptions.map(option => (
              <button
                key={option.value}
                type="button"
                className={`chip ${localFilters.sortBy === option.value ? 'selected' : ''}`}
                onClick={() => setLocalFilters(prev => ({ ...prev, sortBy: option.value }))}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Categories</h3>
          <div className="chips">
            {(options.categories.length ? options.categories : fallbackCategories).map(option => (
              <button
                key={option}
                type="button"
                className={`chip ${localFilters.categories.includes(option) ? 'selected' : ''}`}
                onClick={() => toggleMultiselect('categories', option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Dietary</h3>
          <div className="chips">
            {(options.dietary.length ? options.dietary : fallbackDietary).map(option => (
              <button
                key={option}
                type="button"
                className={`chip ${localFilters.dietary.includes(option) ? 'selected' : ''}`}
                onClick={() => toggleMultiselect('dietary', option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Stores</h3>
          <div className="chips">
            {(options.stores.length ? options.stores : fallbackStores).map(option => (
              <button
                key={option}
                type="button"
                className={`chip ${localFilters.stores.includes(option) ? 'selected' : ''}`}
                onClick={() => toggleMultiselect('stores', option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Price range</h3>
          <div className="slider-row">
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step={5}
              value={localFilters.priceMax}
              onChange={event =>
                setLocalFilters(prev => ({ ...prev, priceMax: Number(event.target.value) }))
              }
            />
            <span className="slider-value">Up to HK${localFilters.priceMax}</span>
          </div>
        </div>

        <div className="filters-actions">
          <button
            className="secondary"
            onClick={() => {
              setLocalFilters(defaultFilters);
              onReset();
            }}
            type="button"
          >
            Reset
          </button>
          <button className="primary" onClick={() => onApply(localFilters)} type="button">
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
};
