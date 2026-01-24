/**
 * Register Page
 * =============
 * Amazon account registration page
 */

import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get nameInput(): Locator {
    return this.page.locator('#ap_customer_name');
  }

  get emailInput(): Locator {
    return this.page.locator('#ap_email');
  }

  get passwordInput(): Locator {
    return this.page.locator('#ap_password');
  }

  get confirmPasswordInput(): Locator {
    return this.page.locator('#ap_password_check');
  }

  get createAccountButton(): Locator {
    return this.page.locator('#continue');
  }

  async goto(): Promise<void> {
    await this.page.goto('/ap/register');
    await this.nameInput.waitFor({ state: 'visible' });
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.createAccountButton.click();
  }
}
