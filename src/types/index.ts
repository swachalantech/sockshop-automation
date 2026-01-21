/**
 * Type Definitions for the Test Framework
 * ========================================
 * Centralized type definitions for type safety and IDE support
 */

import { Page, Locator, BrowserContext } from '@playwright/test';

/**
 * Environment configuration structure
 */
export interface EnvironmentConfig {
  readonly baseUrl: string;
  readonly credentials: Credentials;
  readonly testData: TestData;
  readonly timeouts: Timeouts;
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
 * Page Object interface - all pages must implement this
 */
export interface IPage {
  readonly page: Page;
  goto(): Promise<void>;
  isLoaded(): Promise<boolean>;
}

/**
 * Locator definition type for organized locator storage
 */
export type LocatorDefinition = {
  readonly selector: string;
  readonly description: string;
};

/**
 * Test context with injected dependencies
 */
export interface TestContext {
  page: Page;
  context: BrowserContext;
}

/**
 * Product information from search results
 */
export interface ProductInfo {
  title: string;
  price?: string;
  rating?: string;
  index: number;
}

/**
 * Login result status
 */
export type LoginStatus = 'success' | 'invalid_email' | 'invalid_password' | 'error';

/**
 * Search result status
 */
export interface SearchResult {
  hasResults: boolean;
  productCount: number;
  searchTerm: string;
}
