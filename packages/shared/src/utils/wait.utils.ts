/**
 * Wait Utilities
 * ==============
 * Custom wait helpers
 */

import { Page } from '@playwright/test';

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

export async function waitForCondition(
  condition: () => Promise<boolean>,
  timeout = 10000,
  interval = 100
): Promise<boolean> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (await condition()) return true;
    await sleep(interval);
  }
  return false;
}

export async function retryAction<T>(
  action: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < retries; i++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      if (i < retries - 1) await sleep(delay);
    }
  }
  throw lastError;
}
