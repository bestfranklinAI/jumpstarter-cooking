// src/state/CartContext.tsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Cart, CartItem, Deal, Order } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import * as api from '../services/api';

interface CartContextType {
  cart: Cart;
  deals: Deal[];
  loading: boolean; // Add loading state
  addToCart: (dealId: string, quantity: number) => void;
  createOrder: (cart: Cart) => Promise<Order[]>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useLocalStorage<Cart>('cart', { items: [], lastUpdated: '' });
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all deals to have them available in the context
  useEffect(() => {
    setLoading(true);
    api.getDeals(22.28552, 114.15769, {}).then(fetchedDeals => {
      setDeals(fetchedDeals);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      // Handle error appropriately
    });
  }, []);

  const addToCart = useCallback((dealId: string, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.dealId === dealId);
      let newItems: CartItem[];

      if (existingItem) {
        newItems = prevCart.items.map(item =>
          item.dealId === dealId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        newItems = [...prevCart.items, { dealId, quantity }];
      }
      
      return {
        items: newItems,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, [setCart]);

  const createOrder = async (cartToOrder: Cart): Promise<Order[]> => {
    const newOrders = await api.createOrder(cartToOrder);
    // Clear cart after successful order
    setCart({ items: [], lastUpdated: '' });
    return newOrders;
  };

  return (
    <CartContext.Provider value={{ cart, deals, loading, addToCart, createOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
