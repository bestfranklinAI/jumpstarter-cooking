import { UserProvider } from './state/UserContext';
import { CartProvider } from './state/CartContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DiscoverPage } from './pages/DiscoverPage';
import { DealDetailPage } from './pages/DealDetailPage';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import { AlertsPage } from './pages/AlertsPage';
import { HeaderBar } from './components/common/HeaderBar';
import { NavigationBar } from './components/common/NavigationBar';
import './App.css';

function App() {
  // Ensure routing works when hosted under a subpath (e.g., GitHub Pages)
  const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return (
    <UserProvider>
      <CartProvider>
        <Router basename={basename}>
          <div className="app">
            <HeaderBar />
            <main className="app-content">
              <Routes>
                <Route path="/" element={<DiscoverPage />} />
                <Route path="/deal/:dealId" element={<DealDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
              </Routes>
            </main>
            <NavigationBar />
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
