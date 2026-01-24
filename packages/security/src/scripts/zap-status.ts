/**
 * ZAP Status Check
 * ================
 * Check if ZAP daemon is running and get stats
 */

import { ZapClient } from '../zap/client';
import { getZapConfig } from '../zap/config';

async function main(): Promise<void> {
  const config = getZapConfig();
  const client = new ZapClient(config);

  console.log('Checking ZAP daemon status...\n');
  console.log(`API URL: ${config.apiUrl}`);

  const isRunning = await client.isRunning();

  if (!isRunning) {
    console.log('\n❌ ZAP daemon is NOT running.');
    console.log('\nTo start ZAP:');
    console.log('  npm run zap:start');
    process.exit(1);
  }

  const version = await client.getVersion();
  const alertsSummary = await client.getAlertsSummary();
  const recordsToScan = await client.getPassiveScanRecordsToScan();

  console.log(`\n✅ ZAP daemon is running`);
  console.log(`\nStatus:`);
  console.log(`  Version: ${version}`);
  console.log(`  Passive scan queue: ${recordsToScan} records`);
  console.log(`\nAlerts:`);
  console.log(`  High: ${alertsSummary.high}`);
  console.log(`  Medium: ${alertsSummary.medium}`);
  console.log(`  Low: ${alertsSummary.low}`);
  console.log(`  Informational: ${alertsSummary.informational}`);
  console.log(`  Total: ${alertsSummary.total}`);
}

main().catch(console.error);
