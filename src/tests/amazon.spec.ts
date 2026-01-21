/**
 * Amazon India E2E Test Suite
 * ============================
 *
 * Design Pattern: Page Object Model with Fixtures
 */

import { test, expect } from '../fixtures';
import { TEST_DATA, CREDENTIALS } from '../config/environment';

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Search Functionality', () => {

  test('TC001: Should search for product and display results', async ({
    page,
    homePage,
    searchResultsPage,
  }) => {
    const searchTerm = TEST_DATA.searchTerms.primary;

    await test.step('Navigate to homepage', async () => {
      await homePage.goto();
    });

    await test.step(`Search for "${searchTerm}"`, async () => {
      await homePage.searchProduct(searchTerm);
    });

    await test.step('Wait for search results', async () => {
      await searchResultsPage.waitForResults();
    });

    await test.step('Verify URL contains search parameter', async () => {
      await expect(page).toHaveURL(/s\?k=/);
    });

    await test.step('Verify products are displayed', async () => {
      const productCount = await searchResultsPage.getProductCount();
      expect(productCount).toBeGreaterThan(0);
    });

    await test.step('Verify results contain search term', async () => {
      const hasRelevantResults = await searchResultsPage.resultsContainTerm(searchTerm);
      expect(hasRelevantResults).toBeTruthy();
    });

    await test.step('Verify filters section is visible', async () => {
      await expect(searchResultsPage.filtersSection).toBeVisible();
    });
  });

});

// ═══════════════════════════════════════════════════════════════════════════
// HOMEPAGE
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Homepage', () => {

  test('TC002: Should load homepage with all critical elements', async ({
    page,
    homePage,
  }) => {
    await test.step('Navigate to homepage', async () => {
      await homePage.goto();
    });

    await test.step('Verify page title contains Amazon', async () => {
      await expect(page).toHaveTitle(/Amazon/);
    });

    await test.step('Verify search box is visible', async () => {
      await expect(homePage.searchBox).toBeVisible();
    });

    await test.step('Verify logo is visible', async () => {
      await expect(homePage.logo).toBeVisible();
    });

    await test.step('Verify sign in link is visible', async () => {
      await expect(homePage.signInLink).toBeVisible();
    });

    await test.step('Verify cart link is visible', async () => {
      await expect(homePage.cartLink).toBeVisible();
    });
  });

});

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Login Functionality', () => {

  test('TC003: Should display error for invalid login credentials', async ({
    loginPage,
  }) => {
    const invalidEmail = CREDENTIALS.invalidEmail;

    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Enter invalid email and continue', async () => {
      await loginPage.enterEmail(invalidEmail);
    });

    await test.step('Verify unsuccessful login - account not found message displayed', async () => {
      const isErrorVisible = await loginPage.isErrorDisplayed();
      expect(isErrorVisible).toBeTruthy();
    });
  });

});
