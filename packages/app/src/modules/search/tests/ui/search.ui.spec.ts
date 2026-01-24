/**
 * Search Module - UI Tests
 * ========================
 */

import { test, expect } from '@fixtures/base.fixture';
import { TEST_DATA } from '@config';

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
