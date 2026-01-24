/**
 * OWASP ZAP Type Definitions
 * ==========================
 */

export interface ZapConfig {
  /** ZAP API base URL (default: http://localhost:8080) */
  apiUrl: string;
  /** ZAP API key for authentication */
  apiKey: string;
  /** Proxy host for Playwright (default: localhost) */
  proxyHost: string;
  /** Proxy port for Playwright (default: 8080) */
  proxyPort: number;
}

export interface ZapAlert {
  id: string;
  pluginId: string;
  alertRef: string;
  alert: string;
  name: string;
  risk: 'Informational' | 'Low' | 'Medium' | 'High';
  confidence: 'False Positive' | 'Low' | 'Medium' | 'High' | 'Confirmed';
  description: string;
  uri: string;
  method: string;
  param: string;
  attack: string;
  evidence: string;
  solution: string;
  reference: string;
  cweid: string;
  wascid: string;
  sourceid: string;
}

export interface ZapScanStatus {
  status: number;
  state: 'NOT_STARTED' | 'RUNNING' | 'PAUSED' | 'FINISHED';
}

export interface ZapSpiderStatus {
  status: number;
  state: 'NOT_STARTED' | 'RUNNING' | 'PAUSED' | 'FINISHED';
}

export interface ZapContext {
  id: string;
  name: string;
}

export interface ScanMode {
  type: 'passive' | 'active';
  workers: number;
}

export interface SecurityScanResult {
  scanMode: ScanMode;
  targetUrl: string;
  duration: number;
  alerts: ZapAlert[];
  summary: AlertSummary;
  passedThresholds: boolean;
}

export interface AlertSummary {
  high: number;
  medium: number;
  low: number;
  informational: number;
  total: number;
}

export interface ScanThresholds {
  maxHigh: number;
  maxMedium: number;
  maxLow: number;
}

export const DEFAULT_THRESHOLDS: ScanThresholds = {
  maxHigh: 0,
  maxMedium: 5,
  maxLow: 20,
};
