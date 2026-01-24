# Accounts Module

## Ownership
- **Team**: Identity & Access Team
- **Contact**: identity@example.com

## Scope
This module covers Amazon account functionality including:
- User login
- User registration
- Password recovery
- Account settings
- Profile management

## Test Files
- `login.ui.spec.ts` - Login UI tests

## Page Objects
- `login.page.ts` - Login page interactions
- `register.page.ts` - Registration page interactions

## Components
- `password-field.component.ts` - Password input with visibility toggle

## Running Tests
```bash
# Run all accounts module tests
npx playwright test src/modules/accounts/tests/

# Run specific test file
npx playwright test src/modules/accounts/tests/login.ui.spec.ts
```
