/**
 * Security Threshold Tests
 * ========================
 * Validates scan results against defined thresholds
 * Run this as the LAST test to get complete results
 */

import { test, expect } from '../fixtures/zap.fixture';
import { DEFAULT_THRESHOLDS } from '../zap/types';

test.describe('Security Threshold Validation', () => {

  // This test should run last to capture all alerts from previous tests
  test.describe.configure({ mode: 'serial' });

  test('should have no high severity alerts', async ({ zapClient, getAlerts }) => {
    // Wait for passive scan to finish processing
    await zapClient.waitForPassiveScan(30000);

    const alerts = await getAlerts();
    const highAlerts = alerts.filter(a => a.risk === 'High');

    if (highAlerts.length > 0) {
      console.log('\nHigh Severity Alerts Found:');
      highAlerts.forEach(alert => {
        console.log(`  - ${alert.name}`);
        console.log(`    URL: ${alert.uri}`);
        console.log(`    Description: ${alert.description.substring(0, 100)}...`);
      });
    }

    expect(highAlerts.length, `Found ${highAlerts.length} high severity alerts`).toBeLessThanOrEqual(DEFAULT_THRESHOLDS.maxHigh);
  });

  test('should have acceptable medium severity alerts', async ({ zapClient, getAlerts }) => {
    const alerts = await getAlerts();
    const mediumAlerts = alerts.filter(a => a.risk === 'Medium');

    if (mediumAlerts.length > DEFAULT_THRESHOLDS.maxMedium) {
      console.log('\nMedium Severity Alerts Exceeding Threshold:');
      mediumAlerts.slice(0, 10).forEach(alert => {
        console.log(`  - ${alert.name}: ${alert.uri}`);
      });
    }

    expect(mediumAlerts.length, `Found ${mediumAlerts.length} medium severity alerts`).toBeLessThanOrEqual(DEFAULT_THRESHOLDS.maxMedium);
  });

  test('should have acceptable low severity alerts', async ({ zapClient, getAlerts }) => {
    const alerts = await getAlerts();
    const lowAlerts = alerts.filter(a => a.risk === 'Low');

    expect(lowAlerts.length, `Found ${lowAlerts.length} low severity alerts`).toBeLessThanOrEqual(DEFAULT_THRESHOLDS.maxLow);
  });

  test('should print full alert summary', async ({ getAlertsSummary }) => {
    const summary = await getAlertsSummary();

    console.log('\n' + '='.repeat(50));
    console.log('SECURITY ALERT SUMMARY');
    console.log('='.repeat(50));
    console.log(`  High:          ${summary.high}`);
    console.log(`  Medium:        ${summary.medium}`);
    console.log(`  Low:           ${summary.low}`);
    console.log(`  Informational: ${summary.informational}`);
    console.log(`  Total:         ${summary.total}`);
    console.log('='.repeat(50));

    // This test always passes - it's just for reporting
    expect(true).toBe(true);
  });

});
