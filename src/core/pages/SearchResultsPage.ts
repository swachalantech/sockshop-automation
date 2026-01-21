/**
 * SearchResultsPage - Amazon Search Results
 */

import { Page, Locator, expect } from '@playwright/test';
import { Selectors } from '../../constants/selectors';

export class SearchResultsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ═══════════════════════════════════════════════════════════
  // LOCATORS
  // ═══════════════════════════════════════════════════════════

  get resultsContainer(): Locator {
    return this.page.locator(Selectors.SearchResultsPage.RESULTS_CONTAINER);
  }

  get productCards(): Locator {
    return this.page.locator(Selectors.SearchResultsPage.PRODUCT_CARD);
  }

  get productTitles(): Locator {
    return this.page.locator(Selectors.SearchResultsPage.PRODUCT_TITLE);
  }

  get filtersSection(): Locator {
    return this.page.locator(Selectors.SearchResultsPage.FILTERS_SECTION);
  }

  get firstProductTitle(): Locator {
    return this.productTitles.first();
  }

  // ═══════════════════════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════════════════════

  async waitForResults(): Promise<void> {
    await this.resultsContainer.waitFor({ state: 'visible', timeout: 15000 });
    await this.productCards.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async getProductCount(): Promise<number> {
    await this.waitForResults();
    return this.productCards.count();
  }

  async getAllProductTitles(): Promise<string[]> {
    await this.waitForResults();
    return this.productTitles.allTextContents();
  }

  async getFirstProductTitle(): Promise<string> {
    await this.waitForResults();
    return this.firstProductTitle.innerText();
  }

  async hasResults(): Promise<boolean> {
    try {
      await this.waitForResults();
      const count = await this.productCards.count();
      return count > 0;
    } catch {
      return false;
    }
  }

  async resultsContainTerm(searchTerm: string): Promise<boolean> {
    const titles = await this.getAllProductTitles();
    const lowerTerm = searchTerm.toLowerCase();
    return titles.some(title => title.toLowerCase().includes(lowerTerm));
  }
}
