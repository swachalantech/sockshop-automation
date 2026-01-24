/**
 * Playwright Configuration
 * ========================
 *
 * Production-grade configuration for E2E testing.
 *
 * Run Commands:
 *   npm test              - Run all tests headless
 *   npm run test:headed   - Run with browser visible
 *   npm run test:debug    - Debug mode with Playwright Inspector
 *   npm run test:ui       - Interactive UI mode
 */

import { defineConfig, devices } from '@playwright/test';
import { BASE_URL, TIMEOUTS } from './index';

export default defineConfig({
  // ═══════════════════════════════════════════════════════════
  // TEST DIRECTORY & FILES
  // ═══════════════════════════════════════════════════════════

  testDir: '../src',
  testMatch: ['**/tests/*.spec.ts', '**/journeys/*.spec.ts'],

  // ═══════════════════════════════════════════════════════════
  // EXECUTION SETTINGS
  // ═══════════════════════════════════════════════════════════

  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  timeout: TIMEOUTS.pageLoad,

  forbidOnly: !!process.env.CI,

  // ═══════════════════════════════════════════════════════════
  // REPORTING
  // ═══════════════════════════════════════════════════════════

  reporter: [
    ['list'],
    ['html', {
      open: 'never',
      outputFolder: '../reports/playwright',
    }],
    ['json', {
      outputFile: '../test-results/results.json',
    }],
    ['junit', {
      outputFile: '../reports/junit/results.xml',
    }],
  ],

  outputDir: '../test-results',

  // ═══════════════════════════════════════════════════════════
  // GLOBAL SETTINGS
  // ═══════════════════════════════════════════════════════════

  use: {
    baseURL: BASE_URL,

    headless: false,
    viewport: { width: 1280, height: 720 },

    launchOptions: {
      slowMo: process.env.CI ? 0 : 200,
    },

    actionTimeout: TIMEOUTS.medium,
    navigationTimeout: TIMEOUTS.long,

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    acceptDownloads: true,
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
  ],

  // ═══════════════════════════════════════════════════════════
  // GLOBAL SETUP/TEARDOWN
  // ═══════════════════════════════════════════════════════════

  // globalSetup: '../src/global-setup.ts',
});
