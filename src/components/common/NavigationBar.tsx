// src/components/common/NavigationBar.tsx
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Discover' },
  { to: '/cart', label: 'Cart' },
  { to: '/orders', label: 'Orders' },
  { to: '/alerts', label: 'Alerts' },
];

export const NavigationBar = () => {
  return (
    <nav className="navigation-bar">
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `navigation-link ${isActive ? 'active' : ''}`}
          end={link.to === '/'}
        >
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
