// src/components/discover/StoreCard.tsx
import React from 'react';
import type { Store } from '../../types';

interface StoreCardProps {
  store: Store;
  dealCount: number;
  onViewDeals: () => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, dealCount, onViewDeals }) => {
  return (
    <div className="store-card">
      <h3>{store.name}</h3>
      <p>{store.address}</p>
      <p>{dealCount} Deals Available</p>
      <button onClick={onViewDeals}>View Deals</button>
    </div>
  );
};
