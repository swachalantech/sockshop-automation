/**
 * Roles Constants
 * ===============
 * User roles and permissions
 */

export const Roles = {
  GUEST: 'guest',
  USER: 'user',
  PRIME_MEMBER: 'prime_member',
  SELLER: 'seller',
  ADMIN: 'admin',
} as const;

export type Role = typeof Roles[keyof typeof Roles];

export const RolePermissions: Record<Role, string[]> = {
  guest: ['view_products', 'search'],
  user: ['view_products', 'search', 'add_to_cart', 'checkout', 'view_orders'],
  prime_member: ['view_products', 'search', 'add_to_cart', 'checkout', 'view_orders', 'prime_delivery', 'prime_video'],
  seller: ['view_products', 'search', 'manage_listings', 'view_sales'],
  admin: ['*'],
};
