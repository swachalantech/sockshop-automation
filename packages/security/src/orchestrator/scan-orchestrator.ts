/**
 * Security Scan Orchestrator
 * ==========================
 * Manages passive and active scanning modes
 * Ensures safe execution based on worker count
 */

import * as fs from 'fs';
import * as path from 'path';
import { ZapClient } from '../zap/client';
import { getZapConfig, isActiveScanEnabled, getWorkerCount, getScanThresholds } from '../zap/config';
import {
  ZapAlert,
  AlertSummary,
  SecurityScanResult,
  ScanMode,
  ScanThresholds,
} from '../zap/types';

export class ScanOrchestrator {
  private client: ZapClient;
  private targetUrl: string;
  private contextName: string;
  private reportDir: string;

  constructor(targetUrl: string, contextName = 'security-test') {
    const config = getZapConfig();
    this.client = new ZapClient(config);
    this.targetUrl = targetUrl;
    this.contextName = contextName;
    this.reportDir = path.resolve(__dirname, '../../reports');
  }

  /**
   * Initialize ZAP session for security testing
   */
  async initialize(): Promise<void> {
    console.log('Initializing ZAP security scan session...');

    // Verify ZAP is running
    const isRunning = await this.client.isRunning();
    if (!isRunning) {
      throw new Error('ZAP daemon is not running');
    }

    const version = await this.client.getVersion();
    console.log(`ZAP version: ${version}`);

    // Create new session
    await this.client.newSession(`security-${Date.now()}`);

    // Create context for target
    await this.client.createContext(this.contextName);
    await this.client.includeInContext(this.contextName, `${this.escapeRegex(this.targetUrl)}.*`);

    // Set mode based on scan type
    const mode = isActiveScanEnabled() ? 'attack' : 'standard';
    await this.client.setMode(mode);

    // Enable passive scanning
    await this.client.setPassiveScanEnabled(true);

    console.log(`ZAP initialized in ${mode} mode for target: ${this.targetUrl}`);
  }

  /**
   * Get current scan mode based on configuration
   */
  getScanMode(): ScanMode {
    return {
      type: isActiveScanEnabled() ? 'active' : 'passive',
      workers: getWorkerCount(),
    };
  }

  /**
   * Wait for passive scanning to complete
   * Safe to call in parallel mode
   */
  async waitForPassiveScan(timeoutMs = 60000): Promise<void> {
    console.log('Waiting for passive scan to complete...');
    await this.client.waitForPassiveScan(timeoutMs);
    console.log('Passive scan completed');
  }

  /**
   * Run active scan
   * ONLY safe in single-worker mode after tests complete
   */
  async runActiveScan(spiderFirst = true): Promise<void> {
    const mode = this.getScanMode();

    if (mode.workers > 1) {
      throw new Error(
        'SECURITY VIOLATION: Active scan attempted with multiple workers. ' +
        'Active scans are only safe with PW_WORKERS=1.'
      );
    }

    console.log('Starting active security scan...');
    console.log('WARNING: Active scan will send attack payloads to the target.');

    // Optional: Spider the site first to discover all URLs
    if (spiderFirst) {
      console.log('Running spider to discover URLs...');
      const spiderId = await this.client.startSpider(this.targetUrl, this.contextName);
      await this.client.waitForSpider(spiderId, 300000);
      console.log('Spider completed');
    }

    // Run active scan
    console.log('Running active scan...');
    const scanId = await this.client.startActiveScan(this.targetUrl);

    await this.client.waitForActiveScan(scanId, 600000, (status) => {
      console.log(`Active scan progress: ${status}%`);
    });

    console.log('Active scan completed');
  }

  /**
   * Get scan results
   */
  async getResults(): Promise<SecurityScanResult> {
    const startTime = Date.now();
    const mode = this.getScanMode();

    // Wait for any pending passive scans
    await this.waitForPassiveScan();

    const alerts = await this.client.getAlerts(this.targetUrl);
    const summary = await this.client.getAlertsSummary(this.targetUrl);
    const thresholds = getScanThresholds();

    const passedThresholds =
      summary.high <= thresholds.maxHigh &&
      summary.medium <= thresholds.maxMedium &&
      summary.low <= thresholds.maxLow;

    return {
      scanMode: mode,
      targetUrl: this.targetUrl,
      duration: Date.now() - startTime,
      alerts,
      summary,
      passedThresholds,
    };
  }

  /**
   * Generate and save reports
   */
  async generateReports(): Promise<{ html: string; json: string }> {
    // Ensure report directory exists
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Generate HTML report
    const htmlReport = await this.client.generateHtmlReport();
    const htmlPath = path.join(this.reportDir, `zap-report-${timestamp}.html`);
    fs.writeFileSync(htmlPath, htmlReport);

    // Generate JSON report
    const jsonReport = await this.client.generateJsonReport();
    const jsonPath = path.join(this.reportDir, `zap-report-${timestamp}.json`);
    fs.writeFileSync(jsonPath, jsonReport);

    // Generate summary report
    const results = await this.getResults();
    const summaryPath = path.join(this.reportDir, `scan-summary-${timestamp}.json`);
    fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));

    console.log(`Reports generated:`);
    console.log(`  HTML: ${htmlPath}`);
    console.log(`  JSON: ${jsonPath}`);
    console.log(`  Summary: ${summaryPath}`);

    return { html: htmlPath, json: jsonPath };
  }

  /**
   * Print scan summary to console
   */
  async printSummary(): Promise<void> {
    const results = await this.getResults();
    const { summary, scanMode, passedThresholds } = results;
    const thresholds = getScanThresholds();

    console.log('\n' + '='.repeat(60));
    console.log('SECURITY SCAN SUMMARY');
    console.log('='.repeat(60));
    console.log(`Target URL: ${this.targetUrl}`);
    console.log(`Scan Mode: ${scanMode.type.toUpperCase()}`);
    console.log(`Workers: ${scanMode.workers}`);
    console.log('-'.repeat(60));
    console.log('ALERTS:');
    console.log(`  High:          ${summary.high} (max: ${thresholds.maxHigh}) ${summary.high > thresholds.maxHigh ? '❌' : '✅'}`);
    console.log(`  Medium:        ${summary.medium} (max: ${thresholds.maxMedium}) ${summary.medium > thresholds.maxMedium ? '❌' : '✅'}`);
    console.log(`  Low:           ${summary.low} (max: ${thresholds.maxLow}) ${summary.low > thresholds.maxLow ? '❌' : '✅'}`);
    console.log(`  Informational: ${summary.informational}`);
    console.log(`  Total:         ${summary.total}`);
    console.log('-'.repeat(60));
    console.log(`RESULT: ${passedThresholds ? '✅ PASSED' : '❌ FAILED'}`);
    console.log('='.repeat(60) + '\n');
  }

  /**
   * Cleanup after scan
   */
  async cleanup(): Promise<void> {
    // Clear alerts if needed
    // await this.client.deleteAllAlerts();
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
