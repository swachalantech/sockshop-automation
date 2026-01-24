/**
 * Stop ZAP Daemon
 * ===============
 * Standalone script to stop ZAP daemon
 */

import { ZapClient } from '../zap/client';
import { getZapConfig } from '../zap/config';

async function main(): Promise<void> {
  const config = getZapConfig();
  const client = new ZapClient(config);

  const isRunning = await client.isRunning();

  if (!isRunning) {
    console.log('ZAP daemon is not running.');
    return;
  }

  console.log('Stopping ZAP daemon...');

  try {
    await fetch(`${config.apiUrl}/JSON/core/action/shutdown/?apikey=${config.apiKey}`);
    console.log('ZAP daemon stopped successfully.');
  } catch (error) {
    console.log('ZAP daemon stopped (connection closed).');
  }
}

main().catch(console.error);
