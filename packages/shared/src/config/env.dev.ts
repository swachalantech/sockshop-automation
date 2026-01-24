/**
 * Development Environment Configuration
 */

import { EnvironmentConfig, DEFAULT_TIMEOUTS, DEFAULT_TEST_DATA, DEFAULT_API_BASE_URLS } from './env.base';

export const devConfig: EnvironmentConfig = {
  baseUrl: 'https://www.amazon.in',
  apiBaseUrls: DEFAULT_API_BASE_URLS,
  credentials: {
    validEmail: '',
    validPassword: '',
    invalidEmail: 'testinvalid123@fakeemail.com',
    invalidPassword: 'WrongPassword@123',
  },
  testData: DEFAULT_TEST_DATA,
  timeouts: DEFAULT_TIMEOUTS,
};
