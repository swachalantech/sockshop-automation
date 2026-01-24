/**
 * Token Manager
 * =============
 * API token management
 */

interface TokenStore {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

class TokenManager {
  private store: TokenStore = {};

  setTokens(accessToken: string, refreshToken?: string, expiresIn?: number): void {
    this.store.accessToken = accessToken;
    this.store.refreshToken = refreshToken;
    if (expiresIn) {
      this.store.expiresAt = Date.now() + expiresIn * 1000;
    }
  }

  getAccessToken(): string | undefined {
    return this.store.accessToken;
  }

  getRefreshToken(): string | undefined {
    return this.store.refreshToken;
  }

  isExpired(): boolean {
    if (!this.store.expiresAt) return false;
    return Date.now() >= this.store.expiresAt;
  }

  clear(): void {
    this.store = {};
  }

  hasTokens(): boolean {
    return !!this.store.accessToken;
  }
}

export const tokenManager = new TokenManager();
