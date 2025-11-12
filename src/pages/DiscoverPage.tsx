// src/pages/DiscoverPage.tsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getDeals } from '../services/api';
import type { Deal, Filters } from '../types';
import { MapView } from '../components/discover/MapView';
import { ListView } from '../components/discover/ListView';
import { FiltersPanel } from '../components/discover/FiltersPanel';
import { useFilters, initialFilters } from '../hooks/useFilters';
import { useLocalStorage } from '../hooks/useLocalStorage';

const BASE_LOCATION = { lat: 22.28552, lng: 114.15769 };

const sortComparators: Record<string, (a: Deal, b: Deal) => number> = {
  distance: (a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY),
  'discount-desc': (a, b) => {
    const discountA = (a.originalPrice - a.discountedPrice) / a.originalPrice;
    const discountB = (b.originalPrice - b.discountedPrice) / b.originalPrice;
    return discountB - discountA;
  },
  'price-asc': (a, b) => a.discountedPrice - b.discountedPrice,
  expiry: (a, b) => new Date(a.expiryTimestamp).getTime() - new Date(b.expiryTimestamp).getTime(),
};

const distanceBetween = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371; // km
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

interface DiscoverPageProps {
  defaultView?: 'map' | 'list';
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ defaultView = 'list' }) => {
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setStoredView] = useLocalStorage<'map' | 'list'>('discover:view', defaultView);
  const [highlightedDealId, setHighlightedDealId] = useState<string | null>(null);
  const { filters, updateFilters, resetFilters } = useFilters();

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const dealsData = await getDeals(BASE_LOCATION.lat, BASE_LOCATION.lng, {});
        const augmented = dealsData.map((deal) => {
          if (!deal.store?.location) {
            return deal;
          }
          const { lat, lng } = deal.store.location;
          const computedDistance = distanceBetween(BASE_LOCATION.lat, BASE_LOCATION.lng, lat, lng);
          return {
            ...deal,
            distanceKm: Number((deal.distanceKm ?? computedDistance).toFixed(2)),
            store: {
              ...deal.store,
              distanceKm: Number((deal.store?.distanceKm ?? computedDistance).toFixed(2)),
            },
          } satisfies Deal;
        });
        setAllDeals(augmented);
      } catch (err) {
        setError('Failed to fetch deals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const priceBounds = useMemo(() => {
    if (!allDeals.length) {
      return { min: 0, max: initialFilters.priceMax };
    }
    const prices = allDeals.map((deal) => deal.discountedPrice);
    return {
      min: Math.floor(Math.min(...prices) / 5) * 5,
      max: Math.ceil(Math.max(...prices) / 5) * 5,
    };
  }, [allDeals]);

  const defaultFilters = useMemo(() => ({
    ...initialFilters,
    priceMax: priceBounds.max || initialFilters.priceMax,
  }), [priceBounds.max]);

  useEffect(() => {
    if (!allDeals.length) {
      return;
    }
    if (filters.priceMax === initialFilters.priceMax && defaultFilters.priceMax !== filters.priceMax) {
      updateFilters({ priceMax: defaultFilters.priceMax });
    }
  }, [allDeals.length, defaultFilters.priceMax, filters.priceMax, updateFilters]);

  const filteredDeals = useMemo(() => {
    if (!allDeals.length) {
      return [] as Deal[];
    }

    let next = allDeals.filter((deal) => {
      if (filters.categories.length && deal.category && !filters.categories.includes(deal.category)) {
        return false;
      }

      if (filters.stores.length && deal.store?.brand && !filters.stores.includes(deal.store.brand)) {
        return false;
      }

      if (
        filters.dietary.length &&
        (!deal.dietaryTags || !deal.dietaryTags.some((tag) => filters.dietary.includes(tag)))
      ) {
        return false;
      }

      if (filters.priceMax && deal.discountedPrice > filters.priceMax) {
        return false;
      }

      return true;
    });

    const comparator = sortComparators[filters.sortBy] ?? sortComparators.distance;
    next = [...next].sort(comparator);
    return next;
  }, [allDeals, filters]);

  const filterOptions = useMemo(() => {
    const categorySet = new Set<string>();
    const storeSet = new Set<string>();
    const dietarySet = new Set<string>();

    allDeals.forEach((deal) => {
      if (deal.category) {
        categorySet.add(deal.category);
      }
      if (deal.store?.brand) {
        storeSet.add(deal.store.brand);
      }
      deal.dietaryTags?.forEach((tag) => dietarySet.add(tag));
    });

    return {
      categories: Array.from(categorySet).sort(),
      stores: Array.from(storeSet).sort(),
      dietary: Array.from(dietarySet).sort(),
      price: priceBounds,
    };
  }, [allDeals, priceBounds]);

  useEffect(() => {
    const body = document.body;
    if (!body) {
      return undefined;
    }
    if (showFilters) {
      body.classList.add('modal-open');
    } else {
      body.classList.remove('modal-open');
    }
    return () => body.classList.remove('modal-open');
  }, [showFilters]);

  const handleApplyFilters = (nextFilters: Filters) => {
    updateFilters(nextFilters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    resetFilters();
    updateFilters({ priceMax: defaultFilters.priceMax });
    setShowFilters(false);
  };

  const handleViewChange = useCallback((nextView: 'map' | 'list') => {
    setStoredView(nextView);
    setHighlightedDealId(null);
  }, [setStoredView]);

  const activeFiltersCount = useMemo(() => {
    const { categories, stores, dietary, priceMax, sortBy } = filters;
    let count = 0;
    if (categories.length) count += 1;
    if (stores.length) count += 1;
    if (dietary.length) count += 1;
    if (priceMax !== defaultFilters.priceMax) count += 1;
    if (sortBy !== defaultFilters.sortBy) count += 1;
    return count;
  }, [filters, defaultFilters]);

  const viewMode = view ?? 'list';

  const discoverStats = useMemo(() => {
    if (!filteredDeals.length) {
      return null;
    }
    const averageDiscount = Math.round(
      filteredDeals.reduce((acc, deal) => {
        const discount = ((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100;
        return acc + discount;
      }, 0) / filteredDeals.length
    );
    const storeCount = new Set(filteredDeals.map(deal => deal.store?.brand ?? deal.store?.name)).size;
    return { averageDiscount, storeCount, total: filteredDeals.length };
  }, [filteredDeals]);

  if (loading) {
    return <div className="page-loading">Fetching tonight’s finds…</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  if (!allDeals.length) {
    return (
      <div className="discover-page">
        <section className="discover-hero">
          <div>
            <p className="subtitle">Welcome to cooking</p>
            <h1>Discover tonight’s smartest savings</h1>
            <p className="hero-copy">We’re sourcing fresh deals. Check back in a moment.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="discover-page">
      <section className="discover-hero">
        <div>
          <p className="subtitle">Welcome to cooking</p>
          <h1>Discover tonight’s smartest grocery saves</h1>
          <p className="hero-copy">Curated markdowns from trusted supermarkets, updated hourly so you can rescue premium ingredients before they’re gone.</p>
        </div>
        <button className="cta" onClick={() => setShowFilters(true)}>Personalize my deals</button>
      </section>

      <section className="discover-toolbar" aria-label="Discover controls">
        <div className="view-toggle" role="tablist" aria-label="Choose view">
          <button
            type="button"
            className={`toggle ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => handleViewChange('list')}
            aria-pressed={viewMode === 'list'}
          >
            List view
          </button>
          <button
            type="button"
            className={`toggle ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => handleViewChange('map')}
            aria-pressed={viewMode === 'map'}
          >
            Map view
          </button>
        </div>

        {discoverStats ? (
          <div className="discover-toolbar__meta" aria-label="Current results overview">
            <span>{discoverStats.total} nearby finds</span>
            <span>{discoverStats.storeCount} partner stores</span>
            <span>Avg. {discoverStats.averageDiscount}% off</span>
          </div>
        ) : (
          <div className="discover-toolbar__meta" aria-label="No results overview">
            <span>No matches yet</span>
          </div>
        )}

        <button className="filters-trigger" onClick={() => setShowFilters(true)}>
          Filters {activeFiltersCount ? <span className="badge">{activeFiltersCount}</span> : null}
        </button>
      </section>

      {showFilters && (
        <FiltersPanel
          filters={filters}
          defaultFilters={defaultFilters}
          options={filterOptions}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      <div className={`discover-stage ${viewMode}`}>
        {viewMode === 'map' ? (
          <MapView
            deals={filteredDeals}
            highlightedDealId={highlightedDealId}
            onHoverDeal={setHighlightedDealId}
            onShowFilters={() => setShowFilters(true)}
            activeFiltersCount={activeFiltersCount}
            stats={discoverStats}
          />
        ) : (
          <ListView
            deals={filteredDeals}
            highlightedDealId={highlightedDealId}
            onHoverDeal={setHighlightedDealId}
          />
        )}
      </div>
    </div>
  );
};
