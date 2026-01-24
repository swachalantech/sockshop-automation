/**
 * Accounts Module Test Data - Users
 * ==================================
 */

export const TestUsers = {
  VALID_USER: {
    email: '',
    password: '',
    name: 'Test User',
  },
  INVALID_USER: {
    email: 'testinvalid123@fakeemail.com',
    password: 'WrongPassword@123',
  },
  LOCKED_USER: {
    email: 'locked@example.com',
    password: 'LockedPassword123',
  },
} as const;

export const PasswordStrength = {
  WEAK: '123456',
  MEDIUM: 'Test1234',
  STRONG: 'Test@1234!Secure',
} as const;
