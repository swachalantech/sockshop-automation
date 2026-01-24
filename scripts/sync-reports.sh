#!/bin/bash

# Sync Reports Script
# ===================
# Copies all reports to the central reports folder

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPORTS_DIR="$ROOT_DIR/reports"

echo "Syncing reports to central location..."

# Create directories
mkdir -p "$REPORTS_DIR/web"
mkdir -p "$REPORTS_DIR/api"
mkdir -p "$REPORTS_DIR/performance"
mkdir -p "$REPORTS_DIR/security"

# Sync Web UI reports
if [ -d "$ROOT_DIR/packages/web/playwright-report" ]; then
    cp -r "$ROOT_DIR/packages/web/playwright-report/"* "$REPORTS_DIR/web/" 2>/dev/null
    echo "✓ Web UI report synced"
else
    echo "⚠ Web UI report not found"
fi

# Sync API reports
if [ -d "$ROOT_DIR/packages/api/playwright-report" ]; then
    cp -r "$ROOT_DIR/packages/api/playwright-report/"* "$REPORTS_DIR/api/" 2>/dev/null
    echo "✓ API report synced"
else
    echo "⚠ API report not found"
fi

# Sync Performance reports
if [ -f "$ROOT_DIR/packages/performance/reports/petstore-report.html" ]; then
    cp "$ROOT_DIR/packages/performance/reports/petstore-report.html" "$REPORTS_DIR/performance/"
    cp "$ROOT_DIR/packages/performance/reports/petstore-summary.json" "$REPORTS_DIR/performance/" 2>/dev/null
    echo "✓ Performance report synced"
else
    echo "⚠ Performance report not found"
fi

# Sync Security reports
if [ -f "$ROOT_DIR/packages/security/reports/zap-scan-report.html" ]; then
    cp "$ROOT_DIR/packages/security/reports/zap-scan-report.html" "$REPORTS_DIR/security/"
    echo "✓ Security report synced"
else
    echo "⚠ Security report not found"
fi

echo ""
echo "Reports synced to: $REPORTS_DIR"
echo ""
echo "Report structure:"
echo "  reports/"
echo "  ├── dashboard.html"
echo "  ├── web/index.html"
echo "  ├── api/index.html"
echo "  ├── performance/petstore-report.html"
echo "  └── security/zap-scan-report.html"
