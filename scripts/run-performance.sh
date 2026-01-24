#!/bin/bash
# Run Performance Tests
# Usage: ./scripts/run-performance.sh [test-name]

TEST=$1

if [ -z "$TEST" ]; then
  echo "Running all k6 performance tests..."
  for file in src/performance/k6/*.ts; do
    echo "Running: $file"
    k6 run "$file"
  done
else
  echo "Running performance test: $TEST"
  k6 run "src/performance/k6/$TEST.ts"
fi
