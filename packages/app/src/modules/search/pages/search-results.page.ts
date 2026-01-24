/**
 * Search Results Page
 * ===================
 * Amazon search results page
 */

import { Page, Locator } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ═══════════════════════════════════════════════════════════
  // LOCATORS
  // ═══════════════════════════════════════════════════════════

  get resultsContainer(): Locator {
    return this.page.locator('.s-main-slot');
  }

  get productCards(): Locator {
    return this.page.locator('[data-component-type="s-search-result"]');
  }

  get productTitles(): Locator {
    return this.page.locator('[data-component-type="s-search-result"] h2');
  }

  get filtersSection(): Locator {
    return this.page.locator('#s-refinements');
  }

  get firstProductTitle(): Locator {
    return this.productTitles.first();
  }

  get sortDropdown(): Locator {
    return this.page.locator('#s-result-sort-select');
  }

  get pagination(): Locator {
    return this.page.locator('.s-pagination-strip');
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

  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption(option);
    await this.waitForResults();
  }

  async clickProduct(index: number): Promise<void> {
    await this.productCards.nth(index).click();
  }
}
