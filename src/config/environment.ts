/**
 * Environment Configuration
 * =========================
 *
 * Centralized configuration management for different environments.
 * Supports multiple environments (production, staging, development).
 *
 * Usage:
 *   import { TEST_DATA, TIMEOUTS } from '@config/environment';
 */

import { EnvironmentConfig } from '@types';

/**
 * Environment configurations
 */
const environments: Record<string, EnvironmentConfig> = {
  production: {
    baseUrl: 'https://www.amazon.in',
    credentials: {
      validEmail: '',
      validPassword: '',
      invalidEmail: 'testinvalid123@fakeemail.com',
      invalidPassword: 'WrongPassword@123',
    },
    testData: {
      searchTerms: {
        primary: 'iPhone 15',
        secondary: 'laptop',
        noResults: 'xyznonexistentproduct12345',
      },
    },
    timeouts: {
      short: 5000,
      medium: 10000,
      long: 30000,
      pageLoad: 60000,
    },
  },

  staging: {
    baseUrl: 'https://www.amazon.in',
    credentials: {
      validEmail: '',
      validPassword: '',
      invalidEmail: 'testinvalid123@fakeemail.com',
      invalidPassword: 'WrongPassword@123',
    },
    testData: {
      searchTerms: {
        primary: 'iPhone 15',
        secondary: 'laptop',
        noResults: 'xyznonexistentproduct12345',
      },
    },
    timeouts: {
      short: 5000,
      medium: 10000,
      long: 30000,
      pageLoad: 60000,
    },
  },
};

/**
 * Get current environment from ENV variable or default to production
 */
const currentEnv = process.env.TEST_ENV || 'production';

/**
 * Export current environment configuration
 */
export const config: EnvironmentConfig = environments[currentEnv];

/**
 * Convenience exports
 */
export const BASE_URL = config.baseUrl;
export const CREDENTIALS = config.credentials;
export const TEST_DATA = config.testData;
export const TIMEOUTS = config.timeouts;
