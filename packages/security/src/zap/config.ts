/**
 * ZAP Configuration
 * =================
 * Environment-based configuration for OWASP ZAP
 */

import { ZapConfig, ScanThresholds, DEFAULT_THRESHOLDS } from './types';

export function getZapConfig(): ZapConfig {
  const proxyHost = process.env.ZAP_PROXY_HOST || 'localhost';
  const proxyPort = parseInt(process.env.ZAP_PROXY_PORT || '8080', 10);

  return {
    apiUrl: process.env.ZAP_API_URL || `http://${proxyHost}:${proxyPort}`,
    apiKey: process.env.ZAP_API_KEY || '',
    proxyHost,
    proxyPort,
  };
}

export function getScanThresholds(): ScanThresholds {
  return {
    maxHigh: parseInt(process.env.ZAP_MAX_HIGH || String(DEFAULT_THRESHOLDS.maxHigh), 10),
    maxMedium: parseInt(process.env.ZAP_MAX_MEDIUM || String(DEFAULT_THRESHOLDS.maxMedium), 10),
    maxLow: parseInt(process.env.ZAP_MAX_LOW || String(DEFAULT_THRESHOLDS.maxLow), 10),
  };
}

export function isActiveScanEnabled(): boolean {
  return process.env.ZAP_ACTIVE_SCAN === 'true';
}

export function getWorkerCount(): number {
  return parseInt(process.env.PW_WORKERS || '1', 10);
}

/**
 * Validates that active scanning is only enabled with single worker
 */
export function validateScanConfiguration(): void {
  const activeScan = isActiveScanEnabled();
  const workers = getWorkerCount();

  if (activeScan && workers > 1) {
    throw new Error(
      'SECURITY VIOLATION: Active scanning requires single worker mode (PW_WORKERS=1). ' +
      'Active scans modify application state and are not safe for parallel execution. ' +
      'Either set ZAP_ACTIVE_SCAN=false or PW_WORKERS=1.'
    );
  }
}
