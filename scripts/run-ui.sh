#!/bin/bash
# Run UI Tests
# Usage: ./scripts/run-ui.sh [module]

MODULE=$1
CONFIG="config/playwright.config.ts"

if [ -z "$MODULE" ]; then
  echo "Running all UI tests..."
  npx playwright test --config=$CONFIG '**/tests/*.ui.spec.ts'
else
  echo "Running UI tests for module: $MODULE"
  npx playwright test --config=$CONFIG "src/modules/$MODULE/tests/*.ui.spec.ts"
fi
