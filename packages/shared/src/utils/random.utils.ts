/**
 * Random Utilities
 * ================
 * Generate random test data
 */

export function randomString(length = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function randomEmail(domain = 'test.com'): string {
  return `test_${randomString(8)}@${domain}`;
}

export function randomNumber(min = 0, max = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomPhone(): string {
  return `+1${randomNumber(1000000000, 9999999999)}`;
}

export function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomBoolean(): boolean {
  return Math.random() > 0.5;
}
