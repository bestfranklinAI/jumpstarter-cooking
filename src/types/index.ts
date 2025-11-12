// src/types/index.ts

export interface User {
  userId: string;
  name: string;
  email: string;
}

export interface Store {
  storeId: string;
  brand: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  distanceKm?: number;
  phone?: string;
  openingHours?: string;
}

export interface Item {
  itemId: string;
  name:string;
  description: string;
  images: string[];
  allergens?: string[];
  ingredients?: string;
  unit?: string;
}

export interface Deal {
  dealId: string;
  sku?: string;
  itemId: string;
  storeId: string;
  originalPrice: number;
  discountedPrice: number;
  expiryTimestamp: string;
  quantity: number;
  category?: string;
  unit?: string;
  dietaryTags?: string[];
  badges?: string[];
  distanceKm?: number;
  item?: Item; // Optional: The API might populate this
  store?: Store; // Optional: The API might populate this
}

export interface CartItem {
  dealId: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  lastUpdated: string;
}

export type OrderStatus = "Paid" | "Ready for Pickup" | "Completed" | "Cancelled";

export interface OrderStoreSnapshot {
  storeId: string;
  brand: string;
  name: string;
  address: string;
}

export interface Order {
  orderId: string;
  userId: string;
  storeId: string;
  storeSnapshot?: OrderStoreSnapshot;
  deals: {
    dealId: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
  status: OrderStatus;
  qrCode: string;
  pickupWindow: {
    start: string;
    end: string;
  };
  createdAt: string;
  totalAmount?: number;
}

export interface Filters {
  sortBy: string;
  categories: string[];
  stores: string[];
  dietary: string[];
  priceMax: number;
}

export interface DealFiltersPayload {
  sortBy?: string;
  categories?: string[];
  stores?: string[];
  dietary?: string[];
  priceMax?: number;
}