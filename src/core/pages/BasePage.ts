/**
 * BasePage - Base class for all Page Objects
 */

import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
