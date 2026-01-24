/**
 * Hero Banner Component
 * =====================
 * Homepage hero banner/carousel
 */

import { Page, Locator } from '@playwright/test';

export class HeroBannerComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get banner(): Locator {
    return this.page.locator('.a-carousel-container');
  }

  get nextButton(): Locator {
    return this.page.locator('.a-carousel-goto-nextpage');
  }

  get prevButton(): Locator {
    return this.page.locator('.a-carousel-goto-prevpage');
  }

  async nextSlide(): Promise<void> {
    await this.nextButton.click();
  }

  async prevSlide(): Promise<void> {
    await this.prevButton.click();
  }
}
