/**
 * Global Setup for Security Tests
 * ================================
 * Initializes ZAP daemon and session before tests
 */

import { FullConfig } from '@playwright/test';
import { ZapDaemon, getGlobalDaemon } from '../zap/daemon';
import { ScanOrchestrator } from '../orchestrator/scan-orchestrator';
import { validateScanConfiguration, isActiveScanEnabled, getWorkerCount } from '../zap/config';

async function globalSetup(config: FullConfig): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('SECURITY TEST GLOBAL SETUP');
  console.log('='.repeat(60));

  // Validate configuration
  validateScanConfiguration();

  const activeScan = isActiveScanEnabled();
  const workers = getWorkerCount();
  const targetUrl = process.env.TARGET_URL || 'https://www.amazon.in';

  console.log(`Target URL: ${targetUrl}`);
  console.log(`Scan Mode: ${activeScan ? 'ACTIVE' : 'PASSIVE'}`);
  console.log(`Workers: ${workers}`);

  if (activeScan) {
    console.log('\n⚠️  WARNING: Active scanning enabled.');
    console.log('   Active scans will send attack payloads to the target.');
    console.log('   Ensure you have authorization to test this target.\n');
  }

  // Check if ZAP is externally managed (e.g., Docker, CI)
  const zapExternallyManaged = process.env.ZAP_EXTERNAL === 'true';

  if (!zapExternallyManaged) {
    // Start ZAP daemon if not externally managed
    console.log('Starting ZAP daemon...');
    const daemon = await getGlobalDaemon({
      port: parseInt(process.env.ZAP_PROXY_PORT || '8080', 10),
      apiKey: process.env.ZAP_API_KEY || 'security-test-key',
    });

    const isRunning = await daemon.isRunning();
    if (!isRunning) {
      await daemon.start();
    }
  } else {
    console.log('ZAP externally managed - skipping daemon startup');
  }

  // Initialize ZAP session
  const orchestrator = new ScanOrchestrator(targetUrl);
  await orchestrator.initialize();

  console.log('='.repeat(60));
  console.log('SETUP COMPLETE - Starting security tests...');
  console.log('='.repeat(60) + '\n');
}

export default globalSetup;
