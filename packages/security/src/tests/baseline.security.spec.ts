/**
 * Baseline Security Tests
 * =======================
 * Passive scanning during normal user flows
 * Safe for parallel execution
 */

import { test, expect } from '../fixtures/zap.fixture';

test.describe('Baseline Security - Homepage', () => {

  test('should scan homepage for vulnerabilities', async ({ page, zapClient }) => {
    // Navigate to homepage - ZAP passively scans all traffic
    await page.goto('/');

    // Verify page loaded
    await expect(page).toHaveTitle(/./);

    // Interact with common elements to generate more traffic for scanning
    await page.locator('#nav-logo-sprites').waitFor({ state: 'visible' });

    // Wait for any AJAX requests to complete
    await page.waitForLoadState('networkidle');
  });

  test('should scan search functionality', async ({ page, zapClient }) => {
    await page.goto('/');

    // Perform search - ZAP captures search requests
    const searchBox = page.locator('#twotabsearchtextbox');
    await searchBox.fill('test product');
    await page.locator('#nav-search-submit-button').click();

    // Wait for search results
    await page.waitForLoadState('networkidle');

    // Verify search executed
    await expect(page).toHaveURL(/s\?k=/);
  });

  test('should scan login page', async ({ page, zapClient }) => {
    await page.goto('/');

    // Navigate to login - captures login form
    await page.locator('#nav-link-accountList').click();

    // Wait for login page to load
    await page.waitForLoadState('networkidle');

    // Verify login page elements (don't actually login)
    const emailField = page.getByRole('textbox', { name: /email|mobile/i });
    await expect(emailField).toBeVisible();
  });

});

test.describe('Baseline Security - Navigation', () => {

  test('should scan main navigation links', async ({ page }) => {
    await page.goto('/');

    // Click through main navigation to discover URLs
    const navLinks = page.locator('#nav-main a').first();

    if (await navLinks.count() > 0) {
      await navLinks.click();
      await page.waitForLoadState('networkidle');
    }

    // Go back and try another link
    await page.goBack();
    await page.waitForLoadState('networkidle');
  });

  test('should scan footer links', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer to load any lazy content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await page.waitForLoadState('networkidle');
  });

});
