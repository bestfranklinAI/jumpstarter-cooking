// src/services/api.ts
import axios from 'axios';
import type { Deal, Order, Cart, Filters } from '../types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDeals = async (lat: number, lon: number, filters: Partial<Filters>): Promise<Deal[]> => {
  const response = await apiClient.get('/deals', { params: { lat, lon, ...filters } });
  return response.data;
};

export const getOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get('/orders');
  return response.data;
};

export const createOrder = async (cart: Cart): Promise<Order[]> => {
  const response = await apiClient.post('/orders', { cart });
  return response.data;
};

export const getOrder = async (orderId: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
};
