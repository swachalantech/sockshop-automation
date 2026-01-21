/**
 * LoginPage - Amazon Login Page
 */

import { Page, Locator, expect } from '@playwright/test';
import { Selectors, LOGIN_URL } from '../../constants/selectors';

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
      this.page.locator(Selectors.LoginPage.EMAIL_INPUT)
    );
  }

  get continueButton(): Locator {
    return this.page.locator('#continue input[type="submit"], #continue').first();
  }

  get passwordInput(): Locator {
    return this.page.locator(Selectors.LoginPage.PASSWORD_INPUT);
  }

  get signInButton(): Locator {
    return this.page.locator(Selectors.LoginPage.SIGN_IN_BUTTON);
  }

  get errorMessageBox(): Locator {
    return this.page.locator(Selectors.LoginPage.ERROR_MESSAGE_BOX);
  }

  get errorMessageText(): Locator {
    return this.page.locator(Selectors.LoginPage.ERROR_MESSAGE_TEXT);
  }

  get alertContent(): Locator {
    return this.page.locator(Selectors.LoginPage.ALERT_CONTENT);
  }

  get emailErrorAlert(): Locator {
    return this.page.locator(Selectors.LoginPage.EMAIL_ERROR_ALERT);
  }

  get createAccountLink(): Locator {
    return this.page.locator(Selectors.LoginPage.CREATE_ACCOUNT_LINK);
  }

  get newToAmazonMessage(): Locator {
    return this.page.getByRole('heading', { name: /looks like you are new to amazon/i });
  }

  get proceedToCreateAccountButton(): Locator {
    return this.page.getByRole('button', { name: /proceed to create an account/i });
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
}
