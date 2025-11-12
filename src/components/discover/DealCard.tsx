// src/components/discover/DealCard.tsx
import type { Deal } from '../../types';
import { useCart } from '../../state/CartContext';
import { useNavigate } from 'react-router-dom';

interface DealCardProps {
  deal: Deal;
  isHighlighted?: boolean;
  onHighlightChange?: (dealId: string | null) => void;
}

const currency = new Intl.NumberFormat('en-HK', {
  style: 'currency',
  currency: 'HKD',
  maximumFractionDigits: 0,
});

const defaultCardImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="320"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e0e7ff"/><stop offset="100%" stop-color="#f5f3ff"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6366f1" font-family="system-ui, -apple-system, Segoe UI, Roboto" font-size="20">Cooking</text></svg>'
  );

export const DealCard: React.FC<DealCardProps> = ({ deal, isHighlighted = false, onHighlightChange }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const discountPercentage = Math.round(((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100);
  const remaining = Math.max(deal.quantity, 0);
  const scarcityLevel = Math.max(8, Math.min(92, 100 - remaining * 4));
  const claimedLabel = `${Math.max(0, 100 - Math.round(scarcityLevel))}% claimed`;
  const expiryTime = deal.expiryTimestamp
    ? new Date(deal.expiryTimestamp).toLocaleTimeString('en-HK', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'soon';
  const distanceLabel = deal.distanceKm ? `${deal.distanceKm.toFixed(1)} km away` : 'Nearby';
  const badges = [...(deal.badges ?? []), ...(deal.dietaryTags ?? [])];

  return (
    <article
      className={`deal-card ${isHighlighted ? 'highlighted' : ''}`}
      tabIndex={0}
      aria-label={`${deal.item?.name ?? 'Limited deal'} from ${deal.store?.name ?? 'partner store'}`}
      onMouseEnter={() => onHighlightChange?.(deal.dealId)}
      onMouseLeave={() => onHighlightChange?.(null)}
      onFocus={() => onHighlightChange?.(deal.dealId)}
      onBlur={() => onHighlightChange?.(null)}
    >
      <div className="deal-card__media">
        <img
          src={deal.item?.images?.[0] ?? defaultCardImage}
          alt={deal.item?.name ?? 'Deal'}
          loading="lazy"
        />
  <span className="deal-card__discount">{discountPercentage}% OFF</span>
      </div>

      <div className="deal-card__body">
        <div className="deal-card__top">
          <h3>{deal.item?.name ?? 'Chef’s surprise bundle'}</h3>
          <p className="deal-card__store">
            {deal.store?.brand ?? 'cooking partner'} · {deal.store?.name ?? 'Neighbourhood pickup'}
          </p>
        </div>
        {deal.item?.description && (
          <p className="deal-card__description">{deal.item.description}</p>
        )}

        <div className="deal-card__pricing">
          <span className="deal-card__price">{currency.format(deal.discountedPrice)}</span>
          <span className="deal-card__original">{currency.format(deal.originalPrice)}</span>
        </div>

        <div className="deal-card__meta">
          <span className={`deal-card__quantity ${remaining <= 3 ? 'low' : ''}`}>
            {remaining <= 3 ? `Only ${remaining} left` : `${remaining} available`}
          </span>
          <span className="deal-card__expiry">Pickup by {expiryTime}</span>
          <span className="deal-card__distance">{distanceLabel}</span>
        </div>

        <div className="deal-card__availability" aria-hidden="true">
          <div className="progress-bar">
            <span style={{ width: `${scarcityLevel}%` }} />
          </div>
          <span className="progress-label">{claimedLabel}</span>
        </div>

        {badges.length > 0 && (
          <div className="deal-card__tags" aria-label="Highlights">
            {badges.map(tag => (
              <span key={tag} className="deal-card__tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="deal-card__actions">
          <button
            onClick={() => addToCart(deal.dealId, 1)}
            className="primary"
            type="button"
          >
            Add to cart
          </button>
          <button className="ghost" type="button" onClick={() => navigate(`/deal/${deal.dealId}`)}>
            View details
          </button>
        </div>
      </div>
    </article>
  );
};
