// src/components/discover/DealCard.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DealCard } from './DealCard';
import type { Deal } from '../../types';
import { vi, describe, it, expect } from 'vitest';

const mockDeal: Deal = {
  dealId: '1',
  itemId: 'item-1',
  storeId: 'store-1',
  originalPrice: 100,
  discountedPrice: 50,
  expiryTimestamp: new Date().toISOString(),
  quantity: 10,
  item: {
    itemId: 'item-1',
    name: 'Organic Mixed Greens Salad',
    description: 'A fresh and healthy salad.',
    images: ['/salad.jpg'],
  },
  store: {
    storeId: 'store-1',
    brand: 'Wellcome',
    name: 'Wellcome (Sai Ying Pun)',
    address: '12 High Street',
    location: { lat: 22.285, lng: 114.14 }
  }
};

// Mock the useCart hook
vi.mock('../../state/CartContext', () => ({
  useCart: () => ({
    addToCart: vi.fn(),
  }),
}));

describe('DealCard', () => {
  it('renders the deal information', () => {
    render(
      <MemoryRouter>
        <DealCard deal={mockDeal} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Organic Mixed Greens Salad')).toBeInTheDocument();
    expect(screen.getByText('HK$50')).toBeInTheDocument();
    expect(screen.getByText(/HK\$100/)).toBeInTheDocument();
    expect(screen.getByText(/50% OFF/)).toBeInTheDocument();
    expect(screen.getByText(/10 available|Only 10 left/)).toBeInTheDocument();
    expect(screen.getByText(/Wellcome \(Sai Ying Pun\)/)).toBeInTheDocument();
  });
});
