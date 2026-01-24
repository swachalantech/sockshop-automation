/**
 * ZAP Security Test Fixtures
 * ==========================
 * Playwright fixtures for security testing with OWASP ZAP
 */

import { test as base, Page, BrowserContext } from '@playwright/test';
import { ZapClient } from '../zap/client';
import { getZapConfig, isActiveScanEnabled } from '../zap/config';
import { ZapAlert, AlertSummary, SecurityScanResult, ScanThresholds, DEFAULT_THRESHOLDS } from '../zap/types';

interface ZapFixtures {
  /** ZAP API client */
  zapClient: ZapClient;

  /** Authenticated page (use this after login for authenticated scanning) */
  authenticatedPage: Page;

  /** Get alerts for current target */
  getAlerts: () => Promise<ZapAlert[]>;

  /** Get alerts summary */
  getAlertsSummary: () => Promise<AlertSummary>;

  /** Assert alerts are within thresholds */
  assertAlertsWithinThresholds: (thresholds?: ScanThresholds) => Promise<void>;
}

export const test = base.extend<ZapFixtures>({
  zapClient: async ({}, use) => {
    const config = getZapConfig();
    const client = new ZapClient(config);

    // Verify ZAP is running
    const isRunning = await client.isRunning();
    if (!isRunning) {
      throw new Error('ZAP daemon is not running. Start ZAP before running security tests.');
    }

    await use(client);
  },

  authenticatedPage: async ({ page, zapClient }, use) => {
    // This page is used for authenticated scanning
    // The test should perform login before using this fixture
    await use(page);
  },

  getAlerts: async ({ zapClient }, use) => {
    const targetUrl = process.env.TARGET_URL || 'https://www.amazon.in';

    await use(async () => {
      return zapClient.getAlerts(targetUrl);
    });
  },

  getAlertsSummary: async ({ zapClient }, use) => {
    const targetUrl = process.env.TARGET_URL || 'https://www.amazon.in';

    await use(async () => {
      return zapClient.getAlertsSummary(targetUrl);
    });
  },

  assertAlertsWithinThresholds: async ({ zapClient }, use) => {
    const targetUrl = process.env.TARGET_URL || 'https://www.amazon.in';

    await use(async (thresholds: ScanThresholds = DEFAULT_THRESHOLDS) => {
      // Wait for passive scan to complete
      await zapClient.waitForPassiveScan(30000);

      const summary = await zapClient.getAlertsSummary(targetUrl);

      const violations: string[] = [];

      if (summary.high > thresholds.maxHigh) {
        violations.push(`High alerts: ${summary.high} (max: ${thresholds.maxHigh})`);
      }
      if (summary.medium > thresholds.maxMedium) {
        violations.push(`Medium alerts: ${summary.medium} (max: ${thresholds.maxMedium})`);
      }
      if (summary.low > thresholds.maxLow) {
        violations.push(`Low alerts: ${summary.low} (max: ${thresholds.maxLow})`);
      }

      if (violations.length > 0) {
        throw new Error(
          `Security thresholds exceeded:\n${violations.join('\n')}\n\n` +
          `Total alerts: ${summary.total} (High: ${summary.high}, Medium: ${summary.medium}, Low: ${summary.low}, Info: ${summary.informational})`
        );
      }
    });
  },
});

export { expect } from '@playwright/test';
