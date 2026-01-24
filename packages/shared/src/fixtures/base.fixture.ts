/**
 * Base Fixture - Single test() export
 * ====================================
 * All modules should import test from here
 */

import { test as base } from '@playwright/test';
import { HomePage } from '@modules/home/pages/home.page';
import { LoginPage } from '@modules/accounts/pages/login.page';
import { SearchResultsPage } from '@modules/search/pages/search-results.page';

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
