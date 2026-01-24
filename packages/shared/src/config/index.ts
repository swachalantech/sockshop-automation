/**
 * Configuration Index
 * ===================
 * Exports environment configuration based on TEST_ENV
 */

import { EnvironmentConfig } from './env.base';
import { devConfig } from './env.dev';
import { qaConfig } from './env.qa';
import { prodConfig } from './env.prod';

const environments: Record<string, EnvironmentConfig> = {
  dev: devConfig,
  development: devConfig,
  qa: qaConfig,
  staging: qaConfig,
  prod: prodConfig,
  production: prodConfig,
};

const currentEnv = process.env.TEST_ENV || 'prod';

export const config: EnvironmentConfig = environments[currentEnv] || prodConfig;

export const BASE_URL = config.baseUrl;
export const API_BASE_URLS = config.apiBaseUrls;
export const CREDENTIALS = config.credentials;
export const TEST_DATA = config.testData;
export const TIMEOUTS = config.timeouts;

export * from './env.base';
