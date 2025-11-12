import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Deal } from '../types';
import { useCart } from '../state/CartContext';
import { TrustPanel } from '../components/common/TrustPanel';

const currency = new Intl.NumberFormat('en-HK', {
  style: 'currency',
  currency: 'HKD',
  maximumFractionDigits: 0,
});

export const DealDetailPage: React.FC = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/deals/${dealId}`);
        if (!res.ok) {
          throw new Error('Not found');
        }
        const json = (await res.json()) as Deal;
        if (active) setDeal(json);
      } catch (e) {
        if (active) setError('Deal not found');
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [dealId]);

  const discountPct = useMemo(() => {
    if (!deal) return 0;
    return Math.round(((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100);
  }, [deal]);

  if (loading) return <div className="page-loading">Loading deal…</div>;
  if (error || !deal) return <div className="error-state">{error ?? 'Deal not found'}</div>;

  return (
    <div className="deal-detail">
      <header className="page-header">
        <div>
          <p className="eyebrow">Deal details</p>
          <h2>{deal.item?.name}</h2>
          <p className="meta">{deal.store?.brand} · {deal.store?.name}</p>
        </div>
        <button className="secondary" onClick={() => navigate(-1)}>Back</button>
      </header>

      <div className="deal-detail__layout">
        <div className="deal-detail__media">
          <img src={deal.item?.images?.[0]} alt={deal.item?.name ?? 'Deal image'} />
          <span className="deal-card__discount">{discountPct}% OFF</span>
        </div>
        <div className="deal-detail__info">
          <p className="deal-card__description">{deal.item?.description}</p>
          <div className="deal-card__pricing">
            <span className="deal-card__price">{currency.format(deal.discountedPrice)}</span>
            <span className="deal-card__original">{currency.format(deal.originalPrice)}</span>
          </div>
          <div className="deal-card__meta">
            <span>{deal.quantity} available</span>
            {deal.distanceKm ? <span>{deal.distanceKm.toFixed(1)} km away</span> : null}
          </div>
          <div className="deal-card__actions">
            <button className="primary" onClick={() => addToCart(deal.dealId, 1)}>Add to cart</button>
            <button className="ghost" onClick={() => navigate('/cart')}>Go to cart</button>
          </div>

          <TrustPanel dealId={deal.dealId} name={deal.item?.name ?? 'Deal'} />
        </div>
      </div>
    </div>
  );
};
