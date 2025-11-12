// src/components/discover/ListView.tsx
import type { Deal } from '../../types';
import { DealCard } from './DealCard';

interface ListViewProps {
  deals: Deal[];
  highlightedDealId?: string | null;
  onHoverDeal?: (dealId: string | null) => void;
}

export const ListView: React.FC<ListViewProps> = ({ deals, highlightedDealId, onHoverDeal }) => {
  if (!deals.length) {
    return (
      <div className="list-view empty-state">
        <h2>No matches yet</h2>
        <p>Try expanding your filters or explore the map to discover nearby offers.</p>
      </div>
    );
  }

  const averageDiscount = Math.round(
    deals.reduce((acc, deal) => {
      const discount = ((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100;
      return acc + discount;
    }, 0) / deals.length
  );
  const storeCount = new Set(deals.map(deal => deal.store?.brand ?? deal.store?.name)).size;

  return (
    <div className="list-view">
      <header className="list-view__header">
        <div>
          <p className="eyebrow">Tonight’s cooking picks</p>
          <h2>{deals.length} fresh finds</h2>
        </div>
        <div className="list-view__meta">
          <span>{storeCount} partner stores</span>
          <span>Avg. {averageDiscount}% off</span>
        </div>
      </header>
      <div className="list-view__grid">
        {deals.map(deal => (
          <DealCard
            key={deal.dealId}
            deal={deal}
            isHighlighted={highlightedDealId === deal.dealId}
            onHighlightChange={onHoverDeal}
          />
        ))}
      </div>
    </div>
  );
};
