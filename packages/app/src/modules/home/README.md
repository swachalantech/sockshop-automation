# Home Module

## Ownership
- **Team**: Platform Team
- **Contact**: platform@example.com

## Scope
This module covers the Amazon homepage functionality including:
- Homepage loading and core elements
- Navigation header
- Hero banners and carousels
- Category navigation
- Deals sections

## Test Files
- `home.ui.spec.ts` - UI tests for homepage elements

## Page Objects
- `home.page.ts` - Main homepage interactions

## Components
- `hero-banner.component.ts` - Homepage banner/carousel

## Running Tests
```bash
# Run all home module tests
npx playwright test src/modules/home/tests/

# Run specific test file
npx playwright test src/modules/home/tests/home.ui.spec.ts
```
