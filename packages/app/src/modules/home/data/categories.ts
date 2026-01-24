/**
 * Home Module Test Data - Categories
 * ===================================
 */

export const Categories = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Books',
  'Toys & Games',
  'Beauty',
  'Sports & Fitness',
  'Grocery',
] as const;

export type Category = typeof Categories[number];
