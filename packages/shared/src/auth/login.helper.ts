/**
 * Login Helper
 * ============
 * Authentication helper functions
 */

import { Page } from '@playwright/test';
import { CREDENTIALS } from '@config';

export async function loginAsUser(page: Page, email?: string, password?: string): Promise<void> {
  const userEmail = email || CREDENTIALS.validEmail;
  const userPassword = password || CREDENTIALS.validPassword;

  // Navigate to login page
  await page.goto('/ap/signin');

  // Enter email
  await page.getByRole('textbox', { name: /email|mobile/i }).fill(userEmail);
  await page.locator('#continue input[type="submit"], #continue').first().click();

  // Enter password
  await page.locator('#ap_password').waitFor({ state: 'visible' });
  await page.locator('#ap_password').fill(userPassword);
  await page.locator('#signInSubmit').click();

  // Wait for redirect to homepage
  await page.waitForURL('**/');
}

export async function logout(page: Page): Promise<void> {
  await page.locator('#nav-link-accountList').hover();
  await page.locator('text=Sign Out').click();
}

export function isLoggedIn(page: Page): Promise<boolean> {
  return page.locator('#nav-link-accountList').textContent()
    .then(text => !text?.includes('Sign in'));
}
