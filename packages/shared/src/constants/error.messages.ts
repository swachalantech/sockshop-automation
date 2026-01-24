/**
 * Error Messages Constants
 * ========================
 * Common error messages for assertions
 */

export const ErrorMessages = {
  // Auth errors
  INVALID_EMAIL: 'We cannot find an account with that email address',
  INVALID_PASSWORD: 'Your password is incorrect',
  ACCOUNT_LOCKED: 'Your account has been locked',
  SESSION_EXPIRED: 'Your session has expired',

  // Cart errors
  EMPTY_CART: 'Your Shopping Cart is empty',
  ITEM_UNAVAILABLE: 'This item is no longer available',
  QUANTITY_LIMIT: 'This seller has a limit',

  // Search errors
  NO_RESULTS: 'No results for',

  // General errors
  PAGE_NOT_FOUND: 'Page not found',
  SERVER_ERROR: 'Something went wrong',
  NETWORK_ERROR: 'Network error',
} as const;

export type ErrorMessageKey = keyof typeof ErrorMessages;
