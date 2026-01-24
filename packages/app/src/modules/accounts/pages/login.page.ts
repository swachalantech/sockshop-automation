/**
 * Login Page
 * ==========
 * Amazon login page
 */

import { Page, Locator } from '@playwright/test';
import { LOGIN_URL } from '@shared/constants/routes';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ═══════════════════════════════════════════════════════════
  // LOCATORS
  // ═══════════════════════════════════════════════════════════

  get emailInput(): Locator {
    return this.page.getByRole('textbox', { name: /email|mobile/i }).or(
      this.page.locator('#ap_email')
    );
  }

  get continueButton(): Locator {
    return this.page.locator('#continue input[type="submit"], #continue').first();
  }

  get passwordInput(): Locator {
    return this.page.locator('#ap_password');
  }

  get signInButton(): Locator {
    return this.page.locator('#signInSubmit');
  }

  get errorMessageBox(): Locator {
    return this.page.locator('#auth-error-message-box');
  }

  get errorMessageText(): Locator {
    return this.page.locator('#auth-error-message-box .a-list-item');
  }

  get alertContent(): Locator {
    return this.page.locator('.a-alert-content');
  }

  get emailErrorAlert(): Locator {
    return this.page.locator('#auth-email-invalid-claim-alert, #auth-email-missing-alert');
  }

  get createAccountLink(): Locator {
    return this.page.locator('#createAccountSubmit');
  }

  get newToAmazonMessage(): Locator {
    return this.page.getByRole('heading', { name: /looks like you are new to amazon/i });
  }

  get proceedToCreateAccountButton(): Locator {
    return this.page.getByRole('button', { name: /proceed to create an account/i });
  }

  get forgotPasswordLink(): Locator {
    return this.page.locator('#auth-fpp-link-bottom');
  }

  // ═══════════════════════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════════════════════

  async goto(): Promise<void> {
    await this.page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
    await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.continueButton.click();
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
  }

  async isErrorDisplayed(): Promise<boolean> {
    const errorBoxVisible = await this.errorMessageBox.isVisible();
    const alertVisible = await this.alertContent.isVisible();
    const emailErrorVisible = await this.emailErrorAlert.isVisible();
    const newToAmazonVisible = await this.newToAmazonMessage.isVisible();
    return errorBoxVisible || alertVisible || emailErrorVisible || newToAmazonVisible;
  }

  async getErrorMessage(): Promise<string> {
    if (await this.errorMessageBox.isVisible()) {
      return this.errorMessageText.innerText();
    }
    if (await this.alertContent.isVisible()) {
      return this.alertContent.innerText();
    }
    return '';
  }

  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  async clickCreateAccount(): Promise<void> {
    await this.createAccountLink.click();
  }
}
