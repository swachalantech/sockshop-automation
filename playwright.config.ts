/**
 * Playwright Configuration
 * ========================
 *
 * Production-grade configuration for E2E testing.
 *
 * Features:
 * - Multiple browser support
 * - HTML and Allure-compatible reporting
 * - Screenshot/video capture on failure
 * - Configurable timeouts and retries
 *
 * Run Commands:
 *   npm test              - Run all tests headless
 *   npm run test:headed   - Run with browser visible
 *   npm run test:debug    - Debug mode with Playwright Inspector
 *   npm run test:ui       - Interactive UI mode
 */

import { defineConfig, devices } from '@playwright/test';
import { BASE_URL, TIMEOUTS } from './src/config/environment';

export default defineConfig({
  // ═══════════════════════════════════════════════════════════
  // TEST DIRECTORY & FILES
  // ═══════════════════════════════════════════════════════════

  testDir: './src/tests',
  testMatch: '**/*.spec.ts',

  // ═══════════════════════════════════════════════════════════
  // EXECUTION SETTINGS
  // ═══════════════════════════════════════════════════════════

  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  timeout: TIMEOUTS.pageLoad,

  // Fail fast in CI
  forbidOnly: !!process.env.CI,

  // ═══════════════════════════════════════════════════════════
  // REPORTING
  // ═══════════════════════════════════════════════════════════

  reporter: [
    ['list'],
    ['html', {
      open: 'never',
      outputFolder: 'playwright-report',
    }],
    ['json', {
      outputFile: 'test-results/results.json',
    }],
  ],

  // Output directory for test artifacts
  outputDir: 'test-results',

  // ═══════════════════════════════════════════════════════════
  // GLOBAL SETTINGS
  // ═══════════════════════════════════════════════════════════

  use: {
    baseURL: BASE_URL,

    // Browser behavior
    headless: false,
    viewport: { width: 1280, height: 720 },

    // Slow down for visibility (remove in CI)
    launchOptions: {
      slowMo: process.env.CI ? 0 : 200,
    },

    // Timeouts
    actionTimeout: TIMEOUTS.medium,
    navigationTimeout: TIMEOUTS.long,

    // Artifacts - capture on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // Accept downloads
    acceptDownloads: true,

    // Ignore HTTPS errors (useful for staging)
    ignoreHTTPSErrors: true,
  },

  // ═══════════════════════════════════════════════════════════
  // BROWSER PROJECTS
  // ═══════════════════════════════════════════════════════════

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          slowMo: process.env.CI ? 0 : 200,
          args: ['--start-maximized'],
        },
      },
    },

    // Uncomment to enable multi-browser testing
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //   },
    // },
  ],

  // ═══════════════════════════════════════════════════════════
  // GLOBAL SETUP/TEARDOWN (Optional)
  // ═══════════════════════════════════════════════════════════

  // globalSetup: './src/config/global-setup.ts',
  // globalTeardown: './src/config/global-teardown.ts',
});
