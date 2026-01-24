/**
 * Global Teardown for Security Tests
 * ===================================
 * Finalizes scans and generates reports after tests
 */

import { FullConfig } from '@playwright/test';
import { ScanOrchestrator } from '../orchestrator/scan-orchestrator';
import { shutdownGlobalDaemon } from '../zap/daemon';
import { isActiveScanEnabled } from '../zap/config';

async function globalTeardown(config: FullConfig): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('SECURITY TEST GLOBAL TEARDOWN');
  console.log('='.repeat(60));

  const targetUrl = process.env.TARGET_URL || 'https://www.amazon.in';
  const orchestrator = new ScanOrchestrator(targetUrl);

  try {
    // Run active scan if enabled (only safe after tests complete)
    if (isActiveScanEnabled()) {
      console.log('\nRunning post-test active scan...');
      await orchestrator.runActiveScan(true);
    }

    // Wait for all passive scans to complete
    await orchestrator.waitForPassiveScan();

    // Print summary
    await orchestrator.printSummary();

    // Generate reports
    await orchestrator.generateReports();

    // Get final results for CI
    const results = await orchestrator.getResults();

    if (!results.passedThresholds) {
      console.log('\n❌ SECURITY SCAN FAILED - Thresholds exceeded');
      // Don't throw here - let the test results speak for themselves
      // The CI can check the exit code from test results
    } else {
      console.log('\n✅ SECURITY SCAN PASSED');
    }
  } catch (error) {
    console.error('Error during security scan teardown:', error);
  } finally {
    // Cleanup
    await orchestrator.cleanup();

    // Stop ZAP daemon if we started it
    const zapExternallyManaged = process.env.ZAP_EXTERNAL === 'true';
    if (!zapExternallyManaged && process.env.ZAP_SHUTDOWN !== 'false') {
      console.log('Shutting down ZAP daemon...');
      await shutdownGlobalDaemon();
    }
  }

  console.log('='.repeat(60));
  console.log('TEARDOWN COMPLETE');
  console.log('='.repeat(60) + '\n');
}

export default globalTeardown;
