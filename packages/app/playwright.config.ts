import { defineConfig, devices } from '@playwright/test';

// ZAP proxy configuration (set ZAP_PROXY=true to enable)
const zapProxy = process.env.ZAP_PROXY === 'true' ? {
  proxy: {
    server: `http://${process.env.ZAP_HOST || 'localhost'}:${process.env.ZAP_PORT || '8080'}`,
  },
  ignoreHTTPSErrors: true,
} : {};

export default defineConfig({
  testDir: './src',
  fullyParallel: process.env.ZAP_PROXY !== 'true', // Single thread when proxying through ZAP
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.ZAP_PROXY === 'true' ? 1 : (process.env.CI ? 1 : undefined),
  reporter: [
    ['html', { outputFolder: 'reports/html' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.amazon.in',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ...zapProxy,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
