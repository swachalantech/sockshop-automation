#!/bin/bash

# Start ReportPortal services
echo "Starting ReportPortal..."

cd "$(dirname "$0")/../reportportal"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Start services
docker compose up -d

echo ""
echo "Waiting for services to be healthy..."
sleep 30

# Check health
echo ""
echo "Checking service health..."
docker compose ps

echo ""
echo "=============================================="
echo "ReportPortal is starting up!"
echo "=============================================="
echo ""
echo "Access URLs:"
echo "  - ReportPortal UI: http://localhost:9080"
echo "  - Default credentials: superadmin / erebus"
echo ""
echo "First-time setup:"
echo "  1. Login with superadmin / erebus"
echo "  2. Create a new project 'sockshop_automation'"
echo "  3. Go to Profile -> API Keys"
echo "  4. Generate an API key and update RP_API_KEY"
echo ""
echo "Run tests with ReportPortal:"
echo "  REPORT_PORTAL=true npm run test:ui --workspace=@sockshop/app"
echo ""
