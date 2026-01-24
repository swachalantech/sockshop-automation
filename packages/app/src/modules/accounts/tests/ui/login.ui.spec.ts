/**
 * Accounts Module - Login UI Tests
 * ================================
 */

import { test, expect } from '@fixtures/base.fixture';
import { CREDENTIALS } from '@config';

test.describe('Login Functionality', () => {

  test('TC003: Should display error for invalid login credentials', async ({
    loginPage,
  }) => {
    const invalidEmail = CREDENTIALS.invalidEmail;

    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Enter invalid email and continue', async () => {
      await loginPage.enterEmail(invalidEmail);
    });

    await test.step('Verify unsuccessful login - account not found message displayed', async () => {
      const isErrorVisible = await loginPage.isErrorDisplayed();
      expect(isErrorVisible).toBeTruthy();
    });
  });

});
