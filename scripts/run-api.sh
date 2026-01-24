#!/bin/bash
# Run API Tests
# Usage: ./scripts/run-api.sh [module]

MODULE=$1
CONFIG="config/playwright.config.ts"

if [ -z "$MODULE" ]; then
  echo "Running all API tests..."
  npx playwright test --config=$CONFIG '**/tests/*.api.spec.ts'
else
  echo "Running API tests for module: $MODULE"
  npx playwright test --config=$CONFIG "src/modules/$MODULE/tests/*.api.spec.ts"
fi
