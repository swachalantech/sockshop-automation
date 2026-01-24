/**
 * Navigation Component
 * ====================
 * Main navigation menu component
 */

import { Page, Locator } from '@playwright/test';

export class NavigationComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get hamburgerMenu(): Locator {
    return this.page.locator('#nav-hamburger-menu');
  }

  get menuPanel(): Locator {
    return this.page.locator('#hmenu-content');
  }

  async openMenu(): Promise<void> {
    await this.hamburgerMenu.click();
    await this.menuPanel.waitFor({ state: 'visible' });
  }

  async closeMenu(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }
}
