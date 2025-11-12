// src/pages/AlertsPage.tsx
const sampleAlerts = [
  {
    id: 'alert-1',
    title: 'New deal posted near Sheung Wan',
    description: 'Green Common just added 3 ready-to-eat bowls with 55% off until 8pm.',
    time: '2m ago',
  },
  {
    id: 'alert-2',
    title: 'Pickup reminder',
    description: 'Remember to collect your bundle from ParknShop before 7:30pm.',
    time: '35m ago',
  },
  {
    id: 'alert-3',
    title: 'Wishlist item spotted',
    description: 'A gluten-free pasta kit is now available at CitySuper with 40% off.',
    time: '1h ago',
  },
];

export const AlertsPage = () => {
  return (
    <div className="alerts-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Stay in the loop</p>
          <h1>Alerts</h1>
          <p>Manage price drops, restocks, and pickup reminders all in one place.</p>
        </div>
        <button className="secondary" type="button">Manage preferences</button>
      </section>

      <div className="alerts-board">
        {sampleAlerts.map(alert => (
          <article key={alert.id} className="alert-card">
            <div>
              <h2>{alert.title}</h2>
              <p>{alert.description}</p>
            </div>
            <footer>
              <span className="meta">{alert.time}</span>
              <button className="ghost" type="button">Mark as read</button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
};
