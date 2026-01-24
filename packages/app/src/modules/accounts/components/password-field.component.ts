/**
 * Password Field Component
 * ========================
 * Password input with show/hide toggle
 */

import { Page, Locator } from '@playwright/test';

export class PasswordFieldComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get passwordInput(): Locator {
    return this.page.locator('#ap_password');
  }

  get showPasswordCheckbox(): Locator {
    return this.page.locator('#auth-show-password-checkbox');
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.showPasswordCheckbox.click();
  }

  async isPasswordVisible(): Promise<boolean> {
    const type = await this.passwordInput.getAttribute('type');
    return type === 'text';
  }
}
