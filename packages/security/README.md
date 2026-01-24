# Security Testing Package

OWASP ZAP integration with Playwright for automated security scanning.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Test Execution                            │
├─────────────────────────────────────────────────────────────────┤
│  Playwright Tests  ──proxy──►  ZAP Daemon  ──scan──►  Target    │
│  (login, navigate)           (passive/active)        (app)      │
└─────────────────────────────────────────────────────────────────┘

PASSIVE MODE (workers=N):           ACTIVE MODE (workers=1):
├── Test 1 ──► ZAP ──►              ├── Test 1 ──► ZAP ──►
├── Test 2 ──► ZAP ──►   Target     ├── Test 2 ──► ZAP ──►   Target
├── Test 3 ──► ZAP ──►              ├── [Tests Complete]
└── Test N ──► ZAP ──►              └── Active Scan ──────►
```

## Quick Start

### 1. Install ZAP

```bash
# macOS
brew install --cask zap

# Docker
docker pull ghcr.io/zaproxy/zaproxy:stable
```

### 2. Start ZAP Daemon

```bash
# Using script
npm run zap:start --workspace=@sockshop/security

# Or manually
zap.sh -daemon -host 0.0.0.0 -port 8080 -config api.key=your-api-key
```

### 3. Run Security Tests

```bash
# Passive scan (safe for parallel)
npm run test:passive --workspace=@sockshop/security

# Active scan (single worker only)
npm run test:active --workspace=@sockshop/security
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TARGET_URL` | `https://www.amazon.in` | Target application URL |
| `ZAP_API_URL` | `http://localhost:8080` | ZAP API endpoint |
| `ZAP_API_KEY` | (empty) | ZAP API authentication key |
| `ZAP_PROXY_HOST` | `localhost` | ZAP proxy host |
| `ZAP_PROXY_PORT` | `8080` | ZAP proxy port |
| `ZAP_ACTIVE_SCAN` | `false` | Enable active scanning |
| `ZAP_EXTERNAL` | `false` | ZAP managed externally (CI) |
| `PW_WORKERS` | `1` | Playwright worker count |
| `ZAP_MAX_HIGH` | `0` | Max high severity alerts |
| `ZAP_MAX_MEDIUM` | `5` | Max medium severity alerts |
| `ZAP_MAX_LOW` | `20` | Max low severity alerts |

## Scan Modes

### Passive Scanning

- **Safe for parallel execution** (multiple workers)
- Analyzes traffic without modifying requests
- Runs during normal test execution
- Detects: missing headers, cookies issues, information disclosure

```bash
PW_WORKERS=4 ZAP_ACTIVE_SCAN=false npm run test
```

### Active Scanning

- **Requires single worker** (workers=1)
- Sends attack payloads to target
- Runs AFTER tests complete
- Detects: XSS, SQL injection, path traversal, etc.

```bash
PW_WORKERS=1 ZAP_ACTIVE_SCAN=true npm run test
```

## Safety Constraints

The framework enforces these safety rules:

1. **Active scan + parallel workers = ERROR**
   ```
   SECURITY VIOLATION: Active scanning requires single worker mode
   ```

2. **Active scans run ONLY after tests complete**
   - Prevents interference with test assertions
   - Ensures deterministic test results

3. **Authenticated scanning uses Playwright login**
   - ZAP captures auth tokens automatically
   - No need for ZAP authentication scripts

## CI/CD Integration

### Docker Compose

```yaml
services:
  zap:
    image: ghcr.io/zaproxy/zaproxy:stable
    ports:
      - "8080:8080"
    command: zap.sh -daemon -host 0.0.0.0 -port 8080 -config api.key=ci-key

  tests:
    build: .
    depends_on:
      - zap
    environment:
      - ZAP_EXTERNAL=true
      - ZAP_PROXY_HOST=zap
      - ZAP_PROXY_PORT=8080
```

### GitHub Actions

See `ci/github-actions.yml` for complete example.

## Reports

Reports are generated in `reports/`:

- `zap-report-{timestamp}.html` - Full ZAP HTML report
- `zap-report-{timestamp}.json` - Raw JSON data
- `scan-summary-{timestamp}.json` - Summary with thresholds

## Project Structure

```
packages/security/
├── src/
│   ├── zap/
│   │   ├── client.ts        # ZAP REST API client
│   │   ├── daemon.ts        # ZAP daemon manager
│   │   ├── config.ts        # Configuration
│   │   └── types.ts         # TypeScript types
│   ├── fixtures/
│   │   └── zap.fixture.ts   # Playwright fixtures
│   ├── orchestrator/
│   │   └── scan-orchestrator.ts
│   ├── scripts/
│   │   ├── global-setup.ts
│   │   ├── global-teardown.ts
│   │   ├── start-zap.ts
│   │   └── stop-zap.ts
│   └── tests/
│       ├── baseline.security.spec.ts
│       ├── authenticated.security.spec.ts
│       └── threshold.security.spec.ts
├── playwright.config.ts
└── package.json
```

## Writing Security Tests

```typescript
import { test, expect } from '../fixtures/zap.fixture';

test('should scan page for vulnerabilities', async ({ page, zapClient }) => {
  // Navigate - ZAP passively scans all traffic
  await page.goto('/sensitive-page');

  // Interact to generate more traffic
  await page.fill('#input', 'test');
  await page.click('#submit');

  // Wait for page to settle
  await page.waitForLoadState('networkidle');
});

test('should have no high alerts', async ({ assertAlertsWithinThresholds }) => {
  await assertAlertsWithinThresholds({
    maxHigh: 0,
    maxMedium: 5,
    maxLow: 20,
  });
});
```
