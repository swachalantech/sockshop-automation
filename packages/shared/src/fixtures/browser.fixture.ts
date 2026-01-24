/**
 * Browser Fixture
 * ===============
 * Browser-specific fixture extensions
 */

import { test as base } from '@playwright/test';

export const test = base.extend({
  // Add browser-specific fixtures here
  // Example: custom browser context with specific settings
});

export { expect } from '@playwright/test';
