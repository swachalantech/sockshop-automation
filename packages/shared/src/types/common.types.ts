/**
 * Common Types
 * ============
 */

import { Page, BrowserContext } from '@playwright/test';

export interface TestContext {
  page: Page;
  context: BrowserContext;
}

export interface ProductInfo {
  id?: string;
  title: string;
  price?: string;
  rating?: string;
  imageUrl?: string;
}

export interface SearchResult {
  hasResults: boolean;
  productCount: number;
  searchTerm: string;
  products?: ProductInfo[];
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: Date;
}

export type LoginStatus = 'success' | 'invalid_email' | 'invalid_password' | 'error';
