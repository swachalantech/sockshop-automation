#!/bin/bash
# Run Journey Tests
# Usage: ./scripts/run-journeys.sh [journey-name]

JOURNEY=$1
CONFIG="config/playwright.config.ts"

if [ -z "$JOURNEY" ]; then
  echo "Running all journey tests..."
  npx playwright test --config=$CONFIG 'src/journeys/*.spec.ts'
else
  echo "Running journey: $JOURNEY"
  npx playwright test --config=$CONFIG "src/journeys/$JOURNEY.journey.spec.ts"
fi
