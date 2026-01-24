/**
 * Playwright Configuration for Security Testing
 * ==============================================
 * Routes all traffic through OWASP ZAP proxy
 */

import { defineConfig, devices } from '@playwright/test';
import { getZapConfig, validateScanConfiguration, isActiveScanEnabled, getWorkerCount } from './src/zap/config';

// Validate configuration at startup
validateScanConfiguration();

const zapConfig = getZapConfig();
const workers = getWorkerCount();
const activeScanEnabled = isActiveScanEnabled();

// Proxy configuration for ZAP
const proxyServer = `http://${zapConfig.proxyHost}:${zapConfig.proxyPort}`;

export default defineConfig({
  testDir: './src/tests',

  // CRITICAL: Use single worker for active scanning
  // Parallel workers are only safe for passive scanning
  workers: workers,

  // Increase timeouts for security testing (ZAP proxy adds latency)
  timeout: 60000,
  expect: {
    timeout: 10000,
  },

  fullyParallel: !activeScanEnabled, // Only parallel for passive scanning
  forbidOnly: !!process.env.CI,
  retries: 0, // No retries for security tests - we need deterministic results

  reporter: [
    ['html', { outputFolder: 'reports/playwright' }],
    ['list'],
  ],

  // Global setup/teardown for ZAP management
  globalSetup: require.resolve('./src/scripts/global-setup.ts'),
  globalTeardown: require.resolve('./src/scripts/global-teardown.ts'),

  use: {
    baseURL: process.env.TARGET_URL || 'https://www.amazon.in',

    // Route all traffic through ZAP proxy
    proxy: {
      server: proxyServer,
    },

    // Ignore HTTPS errors (ZAP uses self-signed cert)
    ignoreHTTPSErrors: true,

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',

    // Longer action timeout for proxied requests
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },

  projects: [
    // Single browser for security testing (reduces noise)
    {
      name: 'security-chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Disable features that might interfere with ZAP
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--ignore-certificate-errors',
          ],
        },
      },
    },
  ],
});
