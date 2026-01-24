/**
 * Home Module - UI Tests
 * ======================
 */

import { test, expect } from '@fixtures/base.fixture';

test.describe('Homepage', () => {

  test('TC002: Should load homepage with all critical elements', async ({
    page,
    homePage,
  }) => {
    await test.step('Navigate to homepage', async () => {
      await homePage.goto();
    });

    await test.step('Verify page title contains Amazon', async () => {
      await expect(page).toHaveTitle(/Amazon/);
    });

    await test.step('Verify search box is visible', async () => {
      await expect(homePage.searchBox).toBeVisible();
    });

    await test.step('Verify logo is visible', async () => {
      await expect(homePage.logo).toBeVisible();
    });

    await test.step('Verify sign in link is visible', async () => {
      await expect(homePage.signInLink).toBeVisible();
    });

    await test.step('Verify cart link is visible', async () => {
      await expect(homePage.cartLink).toBeVisible();
    });
  });

});
