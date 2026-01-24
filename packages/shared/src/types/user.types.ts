/**
 * User Types
 * ==========
 */

import { Role } from '../constants/roles';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isPrime?: boolean;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  name: string;
  phone?: string;
}

export interface UserSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}
