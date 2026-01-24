/**
 * Environment Utilities
 * =====================
 * Environment-related helpers
 */

export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

export function getEnvVarOrNull(name: string): string | null {
  return process.env[name] || null;
}

export function isCI(): boolean {
  return process.env.CI === 'true';
}

export function isDebug(): boolean {
  return process.env.DEBUG === 'true';
}

export function getEnvironment(): string {
  return process.env.TEST_ENV || 'prod';
}
