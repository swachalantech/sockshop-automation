/**
 * Security Test Payloads
 * ======================
 * Common payloads for security testing
 */

export const XSSPayloads = [
  '<script>alert("XSS")</script>',
  '"><script>alert("XSS")</script>',
  "'-alert('XSS')-'",
  '<img src=x onerror=alert("XSS")>',
  '<svg onload=alert("XSS")>',
] as const;

export const SQLInjectionPayloads = [
  "' OR '1'='1",
  "' OR '1'='1' --",
  "1; DROP TABLE users--",
  "' UNION SELECT * FROM users--",
  "admin'--",
] as const;

export const PathTraversalPayloads = [
  '../../../etc/passwd',
  '..\\..\\..\\windows\\system32\\config\\sam',
  '....//....//....//etc/passwd',
] as const;

export const CommandInjectionPayloads = [
  '; ls -la',
  '| cat /etc/passwd',
  '`whoami`',
  '$(id)',
] as const;
