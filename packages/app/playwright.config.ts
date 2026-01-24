import { defineConfig, devices } from '@playwright/test';

// ZAP proxy configuration (set ZAP_PROXY=true to enable)
const zapProxy = process.env.ZAP_PROXY === 'true' ? {
  proxy: {
    server: `http://${process.env.ZAP_HOST || 'localhost'}:${process.env.ZAP_PORT || '8080'}`,
  },
  ignoreHTTPSErrors: true,
} : {};

// ReportPortal configuration (set REPORT_PORTAL=true to enable)
const rpConfig = {
  apiKey: process.env.RP_API_KEY || 'sockshop_api_key',
  endpoint: process.env.RP_ENDPOINT || 'http://localhost:9080/api/v1',
  project: process.env.RP_PROJECT || 'sockshop_automation',
  launch: process.env.RP_LAUNCH || 'Sockshop Test Execution',
  description: 'Automated test execution',
  attributes: [
    { key: 'framework', value: 'playwright' },
    { key: 'environment', value: process.env.TEST_ENV || 'local' },
  ],
};

// Build reporters array
const reporters: any[] = [
  ['html', { outputFolder: 'reports/html' }],
  ['list'],
];

// Add ReportPortal reporter if enabled
if (process.env.REPORT_PORTAL === 'true') {
  reporters.push(['@reportportal/agent-js-playwright', rpConfig]);
}

export default defineConfig({
  testDir: './src',
  fullyParallel: process.env.ZAP_PROXY !== 'true', // Single thread when proxying through ZAP
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.ZAP_PROXY === 'true' ? 1 : (process.env.CI ? 1 : undefined),
  reporter: reporters,
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
