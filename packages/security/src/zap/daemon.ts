/**
 * OWASP ZAP Daemon Manager
 * ========================
 * Manages ZAP daemon lifecycle (start/stop/health)
 */

import { spawn, ChildProcess, execSync } from 'child_process';
import { ZapClient } from './client';
import { getZapConfig } from './config';
import { ZapConfig } from './types';

export interface DaemonOptions {
  /** Path to ZAP installation (default: auto-detect) */
  zapPath?: string;
  /** Port for ZAP to listen on */
  port?: number;
  /** ZAP API key */
  apiKey?: string;
  /** Additional ZAP command line options */
  additionalOptions?: string[];
  /** Timeout for ZAP to start (ms) */
  startupTimeout?: number;
}

export class ZapDaemon {
  private process: ChildProcess | null = null;
  private config: ZapConfig;
  private client: ZapClient;
  private options: DaemonOptions;

  constructor(options: DaemonOptions = {}) {
    this.options = {
      port: 8080,
      startupTimeout: 60000,
      ...options,
    };

    this.config = {
      ...getZapConfig(),
      proxyPort: this.options.port!,
      apiKey: this.options.apiKey || process.env.ZAP_API_KEY || '',
    };

    this.client = new ZapClient(this.config);
  }

  /**
   * Auto-detect ZAP installation path
   */
  private detectZapPath(): string {
    const possiblePaths = [
      // macOS
      '/Applications/ZAP.app/Contents/Java/zap.sh',
      '/Applications/OWASP ZAP.app/Contents/Java/zap.sh',
      // Linux
      '/usr/share/zaproxy/zap.sh',
      '/opt/zaproxy/zap.sh',
      // Docker (assume ZAP is in PATH)
      'zap.sh',
    ];

    if (this.options.zapPath) {
      return this.options.zapPath;
    }

    // Check if running in Docker with ZAP
    if (process.env.ZAP_PATH) {
      return process.env.ZAP_PATH;
    }

    for (const path of possiblePaths) {
      try {
        execSync(`test -f ${path}`, { stdio: 'ignore' });
        return path;
      } catch {
        // Path doesn't exist, continue
      }
    }

    // Default to expecting it in PATH
    return 'zap.sh';
  }

  /**
   * Start ZAP in daemon mode
   */
  async start(): Promise<void> {
    // Check if already running
    if (await this.client.isRunning()) {
      console.log('ZAP daemon already running');
      return;
    }

    const zapPath = this.detectZapPath();
    const args = [
      '-daemon',
      '-host', '0.0.0.0',
      '-port', String(this.options.port),
      '-config', 'api.disablekey=false',
      '-config', `api.key=${this.config.apiKey}`,
      '-config', 'api.addrs.addr.name=.*',
      '-config', 'api.addrs.addr.regex=true',
      '-config', 'connection.timeoutInSecs=120',
      ...(this.options.additionalOptions || []),
    ];

    console.log(`Starting ZAP daemon: ${zapPath} ${args.join(' ')}`);

    this.process = spawn(zapPath, args, {
      detached: true,
      stdio: 'ignore',
    });

    this.process.unref();

    // Wait for ZAP to be ready
    await this.waitForStartup();

    console.log('ZAP daemon started successfully');
  }

  /**
   * Wait for ZAP to be ready
   */
  private async waitForStartup(): Promise<void> {
    const startTime = Date.now();
    const timeout = this.options.startupTimeout!;

    while (Date.now() - startTime < timeout) {
      if (await this.client.isRunning()) {
        return;
      }
      await this.sleep(1000);
    }

    throw new Error(`ZAP daemon failed to start within ${timeout}ms`);
  }

  /**
   * Stop ZAP daemon
   */
  async stop(): Promise<void> {
    try {
      // Try graceful shutdown via API
      await fetch(`${this.config.apiUrl}/JSON/core/action/shutdown/?apikey=${this.config.apiKey}`);
    } catch {
      // API not available, try to kill process
      if (this.process) {
        this.process.kill('SIGTERM');
      }
    }

    this.process = null;
    console.log('ZAP daemon stopped');
  }

  /**
   * Get ZAP client for API operations
   */
  getClient(): ZapClient {
    return this.client;
  }

  /**
   * Get ZAP configuration
   */
  getConfig(): ZapConfig {
    return this.config;
  }

  /**
   * Check if ZAP is running
   */
  async isRunning(): Promise<boolean> {
    return this.client.isRunning();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Global ZAP daemon instance for test runs
 */
let globalDaemon: ZapDaemon | null = null;

export async function getGlobalDaemon(options?: DaemonOptions): Promise<ZapDaemon> {
  if (!globalDaemon) {
    globalDaemon = new ZapDaemon(options);
  }
  return globalDaemon;
}

export async function shutdownGlobalDaemon(): Promise<void> {
  if (globalDaemon) {
    await globalDaemon.stop();
    globalDaemon = null;
  }
}
