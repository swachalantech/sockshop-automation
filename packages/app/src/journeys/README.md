# Cross-Module E2E Journeys

## Purpose
This directory contains end-to-end test journeys that span multiple modules,
simulating real user flows across the application.

## Test Files
- `onboarding.journey.spec.ts` - New user registration to first purchase
- `purchase.journey.spec.ts` - Complete purchase flow
- `refund.journey.spec.ts` - Return and refund process
- `role-based-access.journey.spec.ts` - Access control verification

## Guidelines
1. Journeys should test business-critical flows
2. Use page objects from individual modules
3. Keep journeys focused on user scenarios
4. Document prerequisites and test data requirements

## Running Journeys
```bash
# Run all journey tests
npx playwright test src/journeys/

# Run specific journey
npx playwright test src/journeys/purchase.journey.spec.ts
```

## Ownership
- **Team**: QA Platform Team
- **Contact**: qa-platform@example.com
