// src/pages/OrdersPage.tsx
import { useEffect, useState } from 'react';
import { getOrders } from '../services/api';
import type { Order } from '../types';
import { QRCodePage } from './QRCodePage';

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getOrders();
        setOrders(ordersData);
      } catch (err) {
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="page-loading">Loading orders...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  const activeOrders = orders.filter(o => o.status === 'Paid' || o.status === 'Ready for Pickup');
  const pastOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled');

  return (
    <div className="orders-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Track pickups</p>
          <h1>My orders</h1>
          <p>Keep an eye on active pickups and browse your history.</p>
        </div>
        <span className="badge badge-soft">{orders.length} total</span>
      </section>

      <div className="orders-grid">
        <section>
          <header>
            <h2>Active</h2>
            <span className="meta">Ready for pickup or on the way</span>
          </header>
          {activeOrders.length === 0 ? (
            <div className="empty-state compact">
              <h3>No active orders</h3>
              <p>Once you check out a deal, your pickup details will appear here.</p>
            </div>
          ) : (
            <div className="order-list">
              {activeOrders.map(order => (
                <article key={order.orderId} className="order-card">
                  <div>
                    <p className="order-id">#{order.orderId}</p>
                    <p className="order-store">Store: {order.storeId}</p>
                  </div>
                  <div className={`status-pill ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {order.status}
                  </div>
                  <button
                    className="primary"
                    onClick={() => setActiveOrder(order)}
                    type="button"
                  >
                    Show pick-up code
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <header>
            <h2>History</h2>
            <span className="meta">Completed or cancelled pickups</span>
          </header>
          {pastOrders.length === 0 ? (
            <div className="empty-state compact">
              <h3>No past orders</h3>
              <p>Check back after your first pickup to see the history here.</p>
            </div>
          ) : (
            <div className="order-list past">
              {pastOrders.map(order => (
                <article key={order.orderId} className="order-card">
                  <div>
                    <p className="order-id">#{order.orderId}</p>
                    <p className="order-store">Store: {order.storeId}</p>
                  </div>
                  <div className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {activeOrder && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-card">
            <button className="icon-button" onClick={() => setActiveOrder(null)} aria-label="Close pick-up code">
              ×
            </button>
            <QRCodePage orderId={activeOrder.orderId} qrCode={activeOrder.qrCode} />
          </div>
        </div>
      )}
    </div>
  );
};