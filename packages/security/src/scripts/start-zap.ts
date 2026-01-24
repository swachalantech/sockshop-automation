/**
 * Start ZAP Daemon
 * ================
 * Standalone script to start ZAP daemon
 */

import { ZapDaemon } from '../zap/daemon';

async function main(): Promise<void> {
  const port = parseInt(process.env.ZAP_PROXY_PORT || '8080', 10);
  const apiKey = process.env.ZAP_API_KEY || 'security-test-key';

  console.log(`Starting ZAP daemon on port ${port}...`);

  const daemon = new ZapDaemon({
    port,
    apiKey,
  });

  await daemon.start();

  const client = daemon.getClient();
  const version = await client.getVersion();

  console.log(`\nZAP daemon started successfully!`);
  console.log(`  Version: ${version}`);
  console.log(`  API URL: http://localhost:${port}`);
  console.log(`  API Key: ${apiKey}`);
  console.log(`\nProxy your browser to http://localhost:${port} to start scanning.`);
}

main().catch(console.error);
