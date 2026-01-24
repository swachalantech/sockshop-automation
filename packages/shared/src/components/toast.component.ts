/**
 * Toast Component
 * ===============
 * Toast/notification messages
 */

import { Page, Locator } from '@playwright/test';

export class ToastComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get toast(): Locator {
    return this.page.locator('.a-toast-message, [role="alert"]');
  }

  async waitForToast(timeout = 5000): Promise<void> {
    await this.toast.waitFor({ state: 'visible', timeout });
  }

  async getMessage(): Promise<string> {
    return (await this.toast.textContent()) || '';
  }

  async dismiss(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }
}
