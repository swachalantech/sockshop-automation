/**
 * Playwright Fixtures - Dependency Injection
 * ==========================================
 *
 * Similar to @Autowired in Spring/Serenity BDD
 *
 * Usage:
 *   test('example', async ({ homePage, loginPage }) => {
 *     await homePage.goto();
 *   });
 */

import { test as base } from '@playwright/test';
import { HomePage } from '../core/pages/HomePage';
import { LoginPage } from '../core/pages/LoginPage';
import { SearchResultsPage } from '../core/pages/SearchResultsPage';

type PageFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  searchResultsPage: SearchResultsPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },
});

export { expect } from '@playwright/test';
