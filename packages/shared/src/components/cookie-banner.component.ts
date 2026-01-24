/**
 * Cookie Banner Component
 * =======================
 * Cookie consent banner handling
 */

import { Page, Locator } from '@playwright/test';

export class CookieBannerComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get banner(): Locator {
    return this.page.locator('#sp-cc');
  }

  get acceptButton(): Locator {
    return this.page.locator('#sp-cc-accept');
  }

  get rejectButton(): Locator {
    return this.page.locator('#sp-cc-reject');
  }

  async acceptCookies(): Promise<void> {
    if (await this.banner.isVisible()) {
      await this.acceptButton.click();
    }
  }

  async rejectCookies(): Promise<void> {
    if (await this.banner.isVisible()) {
      await this.rejectButton.click();
    }
  }
}
