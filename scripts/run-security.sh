#!/bin/bash
# Run Security Tests
# Usage: ./scripts/run-security.sh [type]

TYPE=$1
CONFIG="config/playwright.config.ts"

if [ -z "$TYPE" ]; then
  echo "Running all security tests..."
  npx playwright test --config=$CONFIG 'src/security/**/*.spec.ts'
else
  echo "Running security tests for type: $TYPE"
  npx playwright test --config=$CONFIG "src/security/$TYPE/*.spec.ts"
fi
