/**
 * API Fixture
 * ===========
 * API testing fixture extensions
 */

import { test as base, APIRequestContext } from '@playwright/test';

type APIFixtures = {
  apiContext: APIRequestContext;
};

export const test = base.extend<APIFixtures>({
  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL || 'https://www.amazon.in',
    });
    await use(context);
    await context.dispose();
  },
});

export { expect } from '@playwright/test';
