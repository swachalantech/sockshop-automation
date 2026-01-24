/**
 * OWASP ZAP REST API Client
 * =========================
 * Controls ZAP daemon via REST API
 */

import { ZapConfig, ZapAlert, ZapScanStatus, AlertSummary, ZapContext } from './types';

export class ZapClient {
  private config: ZapConfig;
  private baseUrl: string;

  constructor(config: ZapConfig) {
    this.config = config;
    this.baseUrl = config.apiUrl;
  }

  /**
   * Make authenticated API request to ZAP
   */
  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (this.config.apiKey) {
      url.searchParams.set('apikey', this.config.apiKey);
    }

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`ZAP API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  // ═══════════════════════════════════════════════════════════════════
  // CORE API
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Check if ZAP is running and accessible
   */
  async isRunning(): Promise<boolean> {
    try {
      await this.request('/JSON/core/view/version/');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get ZAP version
   */
  async getVersion(): Promise<string> {
    const result = await this.request<{ version: string }>('/JSON/core/view/version/');
    return result.version;
  }

  /**
   * Create new session (clears all data)
   */
  async newSession(name?: string, overwrite = true): Promise<void> {
    await this.request('/JSON/core/action/newSession/', {
      name: name || '',
      overwrite: String(overwrite),
    });
  }

  /**
   * Set session mode (safe, protected, standard, attack)
   */
  async setMode(mode: 'safe' | 'protected' | 'standard' | 'attack'): Promise<void> {
    await this.request('/JSON/core/action/setMode/', { mode });
  }

  // ═══════════════════════════════════════════════════════════════════
  // CONTEXT MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Create a new context
   */
  async createContext(contextName: string): Promise<string> {
    const result = await this.request<{ contextId: string }>('/JSON/context/action/newContext/', {
      contextName,
    });
    return result.contextId;
  }

  /**
   * Include URL pattern in context
   */
  async includeInContext(contextName: string, regex: string): Promise<void> {
    await this.request('/JSON/context/action/includeInContext/', {
      contextName,
      regex,
    });
  }

  /**
   * Exclude URL pattern from context
   */
  async excludeFromContext(contextName: string, regex: string): Promise<void> {
    await this.request('/JSON/context/action/excludeFromContext/', {
      contextName,
      regex,
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // PASSIVE SCANNING
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Enable/disable passive scanning
   */
  async setPassiveScanEnabled(enabled: boolean): Promise<void> {
    await this.request('/JSON/pscan/action/setEnabled/', {
      enabled: String(enabled),
    });
  }

  /**
   * Get number of records left to scan passively
   */
  async getPassiveScanRecordsToScan(): Promise<number> {
    const result = await this.request<{ recordsToScan: string }>('/JSON/pscan/view/recordsToScan/');
    return parseInt(result.recordsToScan, 10);
  }

  /**
   * Wait for passive scanning to complete
   */
  async waitForPassiveScan(timeoutMs = 60000): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const recordsToScan = await this.getPassiveScanRecordsToScan();

      if (recordsToScan === 0) {
        return;
      }

      await this.sleep(1000);
    }

    throw new Error('Passive scan timeout exceeded');
  }

  // ═══════════════════════════════════════════════════════════════════
  // SPIDER (CRAWLER)
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Start spider scan
   */
  async startSpider(url: string, contextName?: string): Promise<string> {
    const params: Record<string, string> = { url };
    if (contextName) {
      params.contextName = contextName;
    }

    const result = await this.request<{ scan: string }>('/JSON/spider/action/scan/', params);
    return result.scan;
  }

  /**
   * Get spider scan status
   */
  async getSpiderStatus(scanId: string): Promise<number> {
    const result = await this.request<{ status: string }>('/JSON/spider/view/status/', {
      scanId,
    });
    return parseInt(result.status, 10);
  }

  /**
   * Wait for spider to complete
   */
  async waitForSpider(scanId: string, timeoutMs = 300000): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const status = await this.getSpiderStatus(scanId);

      if (status >= 100) {
        return;
      }

      await this.sleep(2000);
    }

    throw new Error('Spider scan timeout exceeded');
  }

  // ═══════════════════════════════════════════════════════════════════
  // ACTIVE SCANNING
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Start active scan
   * WARNING: Only run in single-worker mode after tests complete
   */
  async startActiveScan(url: string, contextId?: string): Promise<string> {
    const params: Record<string, string> = { url };
    if (contextId) {
      params.contextId = contextId;
    }

    const result = await this.request<{ scan: string }>('/JSON/ascan/action/scan/', params);
    return result.scan;
  }

  /**
   * Get active scan status (0-100)
   */
  async getActiveScanStatus(scanId: string): Promise<ZapScanStatus> {
    const result = await this.request<{ status: string }>('/JSON/ascan/view/status/', {
      scanId,
    });

    const status = parseInt(result.status, 10);
    return {
      status,
      state: status >= 100 ? 'FINISHED' : 'RUNNING',
    };
  }

  /**
   * Wait for active scan to complete
   */
  async waitForActiveScan(scanId: string, timeoutMs = 600000, onProgress?: (status: number) => void): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const { status } = await this.getActiveScanStatus(scanId);

      if (onProgress) {
        onProgress(status);
      }

      if (status >= 100) {
        return;
      }

      await this.sleep(5000);
    }

    throw new Error('Active scan timeout exceeded');
  }

  /**
   * Stop active scan
   */
  async stopActiveScan(scanId: string): Promise<void> {
    await this.request('/JSON/ascan/action/stop/', { scanId });
  }

  // ═══════════════════════════════════════════════════════════════════
  // ALERTS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Get all alerts
   */
  async getAlerts(baseUrl?: string, start = 0, count = 1000): Promise<ZapAlert[]> {
    const params: Record<string, string> = {
      start: String(start),
      count: String(count),
    };

    if (baseUrl) {
      params.baseurl = baseUrl;
    }

    const result = await this.request<{ alerts: ZapAlert[] }>('/JSON/core/view/alerts/', params);
    return result.alerts;
  }

  /**
   * Get alerts grouped by risk
   */
  async getAlertsSummary(baseUrl?: string): Promise<AlertSummary> {
    const alerts = await this.getAlerts(baseUrl);

    const summary: AlertSummary = {
      high: 0,
      medium: 0,
      low: 0,
      informational: 0,
      total: alerts.length,
    };

    for (const alert of alerts) {
      switch (alert.risk) {
        case 'High':
          summary.high++;
          break;
        case 'Medium':
          summary.medium++;
          break;
        case 'Low':
          summary.low++;
          break;
        case 'Informational':
          summary.informational++;
          break;
      }
    }

    return summary;
  }

  /**
   * Delete all alerts
   */
  async deleteAllAlerts(): Promise<void> {
    await this.request('/JSON/core/action/deleteAllAlerts/');
  }

  // ═══════════════════════════════════════════════════════════════════
  // REPORTS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Generate HTML report
   */
  async generateHtmlReport(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/OTHER/core/other/htmlreport/?apikey=${this.config.apiKey}`);
    return response.text();
  }

  /**
   * Generate JSON report
   */
  async generateJsonReport(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/OTHER/core/other/jsonreport/?apikey=${this.config.apiKey}`);
    return response.text();
  }

  // ═══════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
