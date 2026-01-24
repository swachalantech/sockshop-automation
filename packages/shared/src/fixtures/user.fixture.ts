/**
 * User Fixture
 * ============
 * User-related fixture extensions
 */

import { test as base } from '@playwright/test';

export const test = base.extend({
  // Add user-specific fixtures here
  // Example: testUser fixture with generated user data
});

export { expect } from '@playwright/test';
