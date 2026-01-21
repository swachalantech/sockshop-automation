/**
 * HomePage - Amazon India Homepage
 */

import { Page, Locator, expect } from '@playwright/test';
import { Selectors, Paths } from '../../constants/selectors';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ═══════════════════════════════════════════════════════════
  // LOCATORS
  // ═══════════════════════════════════════════════════════════

  get logo(): Locator {
    return this.page.locator(Selectors.HomePage.LOGO);
  }

  get searchBox(): Locator {
    return this.page.locator(Selectors.HomePage.SEARCH_BOX);
  }

  get searchButton(): Locator {
    return this.page.locator(Selectors.HomePage.SEARCH_BUTTON);
  }

  get signInLink(): Locator {
    return this.page.locator(Selectors.HomePage.SIGN_IN_LINK);
  }

  get cartLink(): Locator {
    return this.page.locator(Selectors.HomePage.CART_LINK);
  }

  // ═══════════════════════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════════════════════

  async goto(): Promise<void> {
    await this.page.goto(Paths.HOME, { waitUntil: 'domcontentloaded' });
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
