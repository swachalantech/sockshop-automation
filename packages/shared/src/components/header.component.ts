/**
 * Header Component
 * ================
 * Global header component used across all pages
 */

import { Page, Locator } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get logo(): Locator {
    return this.page.locator('#nav-logo-sprites');
  }

  get searchBox(): Locator {
    return this.page.locator('#twotabsearchtextbox');
  }

  get searchButton(): Locator {
    return this.page.locator('#nav-search-submit-button');
  }

  get accountLink(): Locator {
    return this.page.locator('#nav-link-accountList');
  }

  get cartLink(): Locator {
    return this.page.locator('#nav-cart');
  }

  get cartCount(): Locator {
    return this.page.locator('#nav-cart-count');
  }

  async search(term: string): Promise<void> {
    await this.searchBox.fill(term);
    await this.searchButton.click();
  }

  async getCartCount(): Promise<number> {
    const text = await this.cartCount.textContent();
    return parseInt(text || '0', 10);
  }
}
