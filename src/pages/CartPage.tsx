// src/pages/CartPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../state/CartContext';
import type { Deal } from '../types';

interface StoreGrouping {
  storeId: string;
  storeName: string;
  storeBrand?: string;
  address?: string;
  distanceKm?: number;
  items: { deal: Deal; quantity: number }[];
}

const money = new Intl.NumberFormat('en-HK', {
  style: 'currency',
  currency: 'HKD',
  minimumFractionDigits: 2,
});

const groupByStore = (items: { deal: Deal; quantity: number }[]): StoreGrouping[] => {
  const map = new Map<string, StoreGrouping>();

  for (const entry of items) {
    const store = entry.deal.store;
    if (!store) {
      continue;
    }

    const existing = map.get(store.storeId);
    if (!existing) {
      map.set(store.storeId, {
        storeId: store.storeId,
        storeName: store.name,
        storeBrand: store.brand,
        address: store.address,
        distanceKm: store.distanceKm,
        items: [entry],
      });
    } else {
      existing.items.push(entry);
    }
  }

  return Array.from(map.values());
};


export const CartPage = () => {
  const { cart, deals, loading, createOrder } = useCart();
  const [processing, setProcessing] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  if (loading) {
    return <div className="page-loading">Loading cart...</div>;
  }

  // In a real app, you'd fetch full deal details. Here we simulate it.
  const detailedCartItems = cart.items
    .map(item => {
      const deal = deals.find(d => d.dealId === item.dealId);
      if (!deal) {
        return null;
      }
      return { deal, quantity: item.quantity };
    })
    .filter((entry): entry is { deal: Deal; quantity: number } => entry !== null);

  const storeGroups = groupByStore(detailedCartItems);

  const totals = storeGroups.reduce(
    (acc, group) => {
      const groupSubtotal = group.items.reduce((sum, { deal, quantity }) => sum + deal.discountedPrice * quantity, 0);
      acc.byStore.push({
        storeId: group.storeId,
        subtotal: groupSubtotal,
      });
      acc.subtotal += groupSubtotal;
      return acc;
    },
    { subtotal: 0, byStore: [] as { storeId: string; subtotal: number }[] }
  );

  const serviceFeeRate = 0.02;
  const serviceFee = Number((totals.subtotal * serviceFeeRate).toFixed(2));
  const grandTotal = Number((totals.subtotal + serviceFee).toFixed(2));
  const subtotalByStore = new Map(totals.byStore.map(entry => [entry.storeId, entry.subtotal]));

  const handleCheckout = async () => {
    try {
      setProcessing(true);
  const orders = await createOrder(cart);
  setConfirmation(`All set! ${orders.length} pickup${orders.length > 1 ? 's are' : ' is'} ready in Orders.`);
    } catch (error) {
      setConfirmation('Something went wrong. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="cart-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Checkout overview</p>
          <h1>Your cart</h1>
          <p>Review each pickup before heading to payment.</p>
        </div>
        {storeGroups.length > 0 && (
          <span className="badge badge-soft">{storeGroups.length} pickup{storeGroups.length > 1 ? 's' : ''}</span>
        )}
      </section>

      {storeGroups.length === 0 && (
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Browse nearby deals and add your favourites to see them here.</p>
          <Link to="/" className="primary">
            Explore deals
          </Link>
        </div>
      )}

      <div className="cart-layout">
        <div className="cart-groups">
          {storeGroups.map(group => (
            <div key={group.storeId} className="cart-card">
              <header>
                <div>
                  <p className="eyebrow">{group.storeBrand ?? 'Cooking partner'}</p>
                  <h2>{group.storeName}</h2>
                  {group.address && <p className="meta">{group.address}</p>}
                </div>
                <span className="chip">Pickup on site</span>
              </header>
              {group.distanceKm !== undefined && (
                <p className="meta distance">Approx. {group.distanceKm.toFixed(1)} km away</p>
              )}
              <ul>
                {group.items.map(({ deal, quantity }) => (
                  <li key={deal.dealId}>
                    <div>
                      <p>{deal.item?.name ?? 'Deal item'}</p>
                      <span className="meta">Qty {quantity}</span>
                    </div>
                    <span className="price">{money.format(deal.discountedPrice * quantity)}</span>
                  </li>
                ))}
              </ul>
              <footer>
                <span>Subtotal</span>
                <span className="price">{money.format(subtotalByStore.get(group.storeId) ?? 0)}</span>
              </footer>
            </div>
          ))}
        </div>

        {storeGroups.length > 0 && (
          <aside className="cart-summary">
            <h2>Order summary</h2>
            <dl>
              <div>
                <dt>Items</dt>
                <dd>{money.format(totals.subtotal)}</dd>
              </div>
              <div>
                <dt>Service fee (2%)</dt>
                <dd>{money.format(serviceFee)}</dd>
              </div>
              <div className="grand-total">
                <dt>Total due</dt>
                <dd>{money.format(grandTotal)}</dd>
              </div>
            </dl>
            <button
              onClick={handleCheckout}
              className="primary"
              disabled={processing}
              type="button"
            >
              {processing ? 'Processing…' : `Proceed to pay (${storeGroups.length} pickup${storeGroups.length > 1 ? 's' : ''})`}
            </button>
            {confirmation && <p className="confirmation">{confirmation}</p>}
          </aside>
        )}
      </div>
    </div>
  );
};
