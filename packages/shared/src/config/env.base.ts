/**
 * Base Environment Configuration
 * ==============================
 * Common configuration shared across all environments
 */

export interface EnvironmentConfig {
  readonly baseUrl: string;
  readonly apiBaseUrls: ApiBaseUrls;
  readonly credentials: Credentials;
  readonly testData: TestData;
  readonly timeouts: Timeouts;
}

export interface ApiBaseUrls {
  readonly petstore: string;
  // Add more API base URLs as needed
}

export interface Credentials {
  readonly validEmail: string;
  readonly validPassword: string;
  readonly invalidEmail: string;
  readonly invalidPassword: string;
}

export interface TestData {
  readonly searchTerms: {
    readonly primary: string;
    readonly secondary: string;
    readonly noResults: string;
  };
}

export interface Timeouts {
  readonly short: number;
  readonly medium: number;
  readonly long: number;
  readonly pageLoad: number;
}

/**
 * Default timeouts used across environments
 */
export const DEFAULT_TIMEOUTS: Timeouts = {
  short: 5000,
  medium: 10000,
  long: 30000,
  pageLoad: 60000,
};

/**
 * Default test data
 */
export const DEFAULT_TEST_DATA: TestData = {
  searchTerms: {
    primary: 'iPhone 15',
    secondary: 'laptop',
    noResults: 'xyznonexistentproduct12345',
  },
};

/**
 * Default API base URLs
 */
export const DEFAULT_API_BASE_URLS: ApiBaseUrls = {
  petstore: 'https://petstore.swagger.io/v2',
};
