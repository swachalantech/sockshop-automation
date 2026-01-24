/**
 * Home Page
 * =========
 * Amazon India Homepage
 */

import { Page, Locator } from '@playwright/test';
import { Routes } from '@shared/constants/routes';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ═══════════════════════════════════════════════════════════
  // LOCATORS
  // ═══════════════════════════════════════════════════════════

  get logo(): Locator {
    return this.page.locator('#nav-logo-sprites');
  }

  get searchBox(): Locator {
    return this.page.locator('#twotabsearchtextbox');
  }

  get searchButton(): Locator {
    return this.page.locator('#nav-search-submit-button');
  }

  get signInLink(): Locator {
    return this.page.locator('#nav-link-accountList');
  }

  get cartLink(): Locator {
    return this.page.locator('#nav-cart');
  }

  // ═══════════════════════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════════════════════

  async goto(): Promise<void> {
    await this.page.goto(Routes.HOME, { waitUntil: 'domcontentloaded' });
    await this.searchBox.waitFor({ state: 'visible', timeout: 15000 });
  }

  async searchProduct(productName: string): Promise<void> {
    await this.searchBox.fill(productName);
    await this.searchButton.click();
  }

  async clickSignIn(): Promise<void> {
    await this.signInLink.click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }
}
