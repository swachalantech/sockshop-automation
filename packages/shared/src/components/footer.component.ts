/**
 * Footer Component
 * ================
 * Global footer component
 */

import { Page, Locator } from '@playwright/test';

export class FooterComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get footer(): Locator {
    return this.page.locator('#navFooter');
  }

  get backToTopLink(): Locator {
    return this.page.locator('#navBackToTop');
  }

  async scrollToTop(): Promise<void> {
    await this.backToTopLink.click();
  }
}
