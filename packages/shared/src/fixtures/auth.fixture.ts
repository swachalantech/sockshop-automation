/**
 * Auth Fixture
 * ============
 * Authentication-related fixture extensions
 */

import { test as base } from '@playwright/test';

export const test = base.extend({
  // Add auth-specific fixtures here
  // Example: authenticatedPage fixture with pre-logged-in state
});

export { expect } from '@playwright/test';
