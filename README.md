# SockShop Automation Framework

> **Enterprise-grade, multi-modular test automation framework** designed for scalable team collaboration across UI, API, Performance, and Security testing.

---

## Test Results Dashboard

![Dashboard Screenshot](docs/dashboard-screenshot.png)

**Latest Test Run:**

| Test Type | Passed | Failed | Details |
|-----------|--------|--------|---------|
| UI Tests | 7 | 2 | Chromium, Firefox, WebKit |
| API Tests | 9 | 0 | Petstore API endpoints |
| Performance | ✓ | - | Smoke test (30s, 11 iterations) |
| **Security** | - | - | ZAP proxy integration available |

**Reporting Options:**
- **Local Dashboard**: `npm run dashboard`
- **ReportPortal**: `http://localhost:9080` (for historical analysis)

---

## Purpose

This framework solves the challenge of **scaling test automation across multiple teams** by providing:

- **Modular Architecture** - Each feature/domain has its own isolated module with UI + API tests together
- **Single Repository** - All testing types (UI, API, Performance, Security) in one monorepo
- **Team Independence** - Different teams can work on different modules without conflicts
- **Shared Utilities** - Common code (auth, config, types) shared across all packages
- **Unified Reporting** - Consolidated dashboard for all test results

---

## Framework Architecture

```mermaid
mindmap
  root((SockShop<br/>Automation))
    packages/app
      modules
        accounts
          pages
          components
          tests/ui
          tests/api
        home
          pages
          components
          tests/ui
          tests/api
        search
          pages
          tests/ui
          tests/api
        petstore
          clients
          data
          tests/api
      fixtures
      journeys
    packages/shared
      config
        env.dev
        env.qa
        env.prod
      types
      utils
      auth
      components
    packages/security
      zap
        client
        daemon
        config
      tests
        baseline
        authenticated
        threshold
      orchestrator
    packages/performance
      k6
        load tests
        smoke tests
        stress tests
      reports
    packages/mobile
      (future)
```

---

## Visual Structure

```
sockshop-automation/
│
├── packages/
│   │
│   ├── app/                          # Main application tests (UI + API)
│   │   └── src/
│   │       ├── modules/              # Feature-based modules
│   │       │   ├── accounts/         # Login, Registration
│   │       │   │   ├── pages/        # Page Objects
│   │       │   │   ├── components/   # Reusable UI components
│   │       │   │   ├── api/          # API endpoints
│   │       │   │   ├── data/         # Test data
│   │       │   │   └── tests/
│   │       │   │       ├── ui/       # UI tests
│   │       │   │       └── api/      # API tests
│   │       │   │
│   │       │   ├── home/             # Homepage module
│   │       │   ├── search/           # Search module
│   │       │   └── petstore/         # Petstore API module
│   │       │
│   │       ├── fixtures/             # Playwright fixtures
│   │       └── journeys/             # End-to-end user journeys
│   │
│   ├── shared/                       # Shared utilities & config
│   │   └── src/
│   │       ├── config/               # Environment configs (dev/qa/prod)
│   │       ├── types/                # TypeScript interfaces
│   │       ├── utils/                # Helper functions
│   │       ├── auth/                 # Authentication helpers
│   │       └── components/           # Shared UI components
│   │
│   ├── security/                     # OWASP ZAP security tests
│   │   └── src/
│   │       ├── zap/                  # ZAP client & daemon
│   │       ├── tests/                # Security test suites
│   │       └── orchestrator/         # Scan orchestration
│   │
│   ├── performance/                  # k6 load/stress tests
│   │   └── src/k6/                   # k6 test scripts
│   │
│   └── mobile/                       # Mobile tests (future)
│
├── scripts/                          # Automation scripts
├── reports/                          # Consolidated test reports
└── package.json                      # Monorepo configuration
```

---

## Key Concepts

### 1. Module-Based Testing

Each feature is a self-contained module with everything it needs:

```
modules/accounts/
├── pages/              # Page Object Model classes
│   ├── login.page.ts
│   └── register.page.ts
├── components/         # Reusable UI components
│   └── password-field.component.ts
├── api/                # API client/endpoints
│   └── accounts.endpoints.ts
├── data/               # Test data factories
│   └── users.ts
└── tests/
    ├── ui/             # UI/E2E tests
    │   └── login.ui.spec.ts
    └── api/            # API tests
        └── accounts.api.spec.ts
```

**Benefits:**
- Teams own entire modules independently
- All related code in one place
- Easy to find and maintain tests
- Clear boundaries between features

### 2. Shared Package

Common utilities used across all packages:

| Folder | Purpose |
|--------|---------|
| `config/` | Environment-specific settings (URLs, credentials, timeouts) |
| `types/` | TypeScript interfaces for type safety |
| `utils/` | Helper functions (wait, retry, random, date) |
| `auth/` | Login helpers, token management |
| `components/` | Shared UI components (header, footer, toast) |

### 3. Test Types

| Type | Package | Tool | Purpose |
|------|---------|------|---------|
| **UI Tests** | `app` | Playwright | Browser-based E2E tests |
| **API Tests** | `app` | Playwright | REST API validation |
| **Security** | `security` | OWASP ZAP | Vulnerability scanning |
| **Performance** | `performance` | k6 | Load/stress testing |
| **Mobile** | `mobile` | (TBD) | iOS/Android tests |

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sockshop-automation

# Install all dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all app tests (UI + API)
npm run test:app

# Run only UI tests
npm run test:ui

# Run only API tests
npm run test:api

# Run specific module
npm run test:petstore --workspace=@sockshop/app
npm run test:home --workspace=@sockshop/app
npm run test:accounts --workspace=@sockshop/app

# Run with visible browser
npm run test:headed --workspace=@sockshop/app

# Run performance tests
npm run test:perf

# Run security tests
npm run test:security
```

---

## Commands Reference

### Root Level Commands

| Command | Description |
|---------|-------------|
| `npm run test:app` | Run all tests in app package |
| `npm run test:ui` | Run all UI tests |
| `npm run test:api` | Run all API tests |
| `npm run test:perf` | Run k6 performance tests |
| `npm run test:security` | Run ZAP security tests |
| `npm run test:all` | Run tests across all packages |
| `npm run dashboard` | Open unified test dashboard |
| `npm run test:ui:rp` | Run UI tests with ReportPortal reporting |
| `npm run test:api:rp` | Run API tests with ReportPortal reporting |
| `npm run test:all:rp` | Run all tests with ReportPortal reporting |
| `npm run reportportal:start` | Start ReportPortal services |
| `npm run reportportal:stop` | Stop ReportPortal services |
| `npm run reportportal:logs` | View ReportPortal logs |

### App Package Commands

```bash
# Navigate to app package
cd packages/app

# Or use workspace flag from root
npm run <command> --workspace=@sockshop/app
```

| Command | Description |
|---------|-------------|
| `npm run test` | Run all tests |
| `npm run test:ui` | Run UI tests only (`**/tests/ui/`) |
| `npm run test:api` | Run API tests only (`**/tests/api/`) |
| `npm run test:home` | Run home module tests |
| `npm run test:search` | Run search module tests |
| `npm run test:accounts` | Run accounts module tests |
| `npm run test:petstore` | Run petstore module tests |
| `npm run test:journeys` | Run end-to-end journeys |
| `npm run test:headed` | Run with visible browser |
| `npm run test:debug` | Run in debug mode |
| `npm run report` | Open HTML report |

---

## Environment Configuration

The framework supports multiple environments via `TEST_ENV`:

```bash
# Run tests against different environments
TEST_ENV=dev npm run test:app
TEST_ENV=qa npm run test:app
TEST_ENV=prod npm run test:app  # default
```

Configuration files:
- `packages/shared/src/config/env.dev.ts`
- `packages/shared/src/config/env.qa.ts`
- `packages/shared/src/config/env.prod.ts`

---

## Adding a New Module

1. **Create module folder structure:**

```bash
mkdir -p packages/app/src/modules/cart/{pages,components,api,data,tests/{ui,api}}
```

2. **Create page object:**

```typescript
// packages/app/src/modules/cart/pages/cart.page.ts
import { Page } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  async addItem(productId: string) {
    // implementation
  }

  async getItemCount(): Promise<number> {
    // implementation
  }
}
```

3. **Create test:**

```typescript
// packages/app/src/modules/cart/tests/ui/cart.ui.spec.ts
import { test, expect } from '@playwright/test';
import { CartPage } from '../../pages/cart.page';

test.describe('Cart Module', () => {
  test('should add item to cart', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.addItem('product-123');
    expect(await cartPage.getItemCount()).toBe(1);
  });
});
```

4. **Add npm script (optional):**

```json
// packages/app/package.json
"scripts": {
  "test:cart": "playwright test src/modules/cart/tests/"
}
```

---

## Security Testing with ZAP

The security package integrates OWASP ZAP for vulnerability scanning:

```bash
# Start ZAP daemon
npm run zap:start --workspace=@sockshop/security

# Run security tests (passive scanning)
npm run test:security

# Run with active scanning (attacks)
ZAP_ACTIVE_SCAN=true npm run test:security

# Check ZAP status
npm run zap:status --workspace=@sockshop/security
```

### Security Test Types

| Test | File | Description |
|------|------|-------------|
| Baseline | `baseline.security.spec.ts` | Passive scanning during user flows |
| Authenticated | `authenticated.security.spec.ts` | Scans with logged-in session |
| Threshold | `threshold.security.spec.ts` | Validates alert counts against thresholds |

---

## Performance Testing with k6

```bash
# Run load test
npm run test:perf

# Run specific test type
npm run test:k6:petstore:smoke --workspace=@sockshop/performance
npm run test:k6:petstore:load --workspace=@sockshop/performance
npm run test:k6:petstore:stress --workspace=@sockshop/performance
```

### Test Scenarios

| Scenario | VUs | Duration | Purpose |
|----------|-----|----------|---------|
| Smoke | 1 | 30s | Sanity check |
| Load | 10 | 5m | Normal load |
| Stress | 30 | 6m | Peak load |

---

## Reports & Dashboard

```bash
# Open unified dashboard
npm run dashboard

# Update dashboard with latest results
npm run dashboard:update

# View app package report
npm run reports:app
```

Reports are stored in:
- `reports/` - Consolidated dashboard
- `packages/app/reports/html/` - Playwright HTML reports
- `packages/performance/reports/` - k6 performance reports
- `packages/security/reports/` - ZAP security reports

---

## ReportPortal Integration

ReportPortal provides centralized test reporting with historical analysis, dashboards, and trend visualization.

### Setup

```bash
# Start ReportPortal services (requires Docker)
npm run reportportal:start

# Wait for services to initialize (~30 seconds)
# Access at: http://localhost:9080
# Default credentials: superadmin / erebus
```

### First-Time Configuration

1. Login to ReportPortal at `http://localhost:9080`
2. Create a new project named `sockshop_automation`
3. Go to **Profile > API Keys**
4. Generate an API key and set it as `RP_API_KEY` environment variable

### Running Tests with ReportPortal

```bash
# Run UI tests with ReportPortal reporting
npm run test:ui:rp

# Run API tests with ReportPortal reporting
npm run test:api:rp

# Run all tests with ReportPortal reporting
npm run test:all:rp

# Or set environment variable manually
REPORT_PORTAL=true npm run test:app
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REPORT_PORTAL` | `false` | Enable ReportPortal reporting |
| `RP_API_KEY` | `sockshop_api_key` | ReportPortal API key |
| `RP_ENDPOINT` | `http://localhost:9080/api/v1` | ReportPortal API endpoint |
| `RP_PROJECT` | `sockshop_automation` | Project name in ReportPortal |
| `RP_LAUNCH` | `Sockshop Test Execution` | Launch name for test runs |

### Managing ReportPortal

```bash
# Start services
npm run reportportal:start

# Stop services
npm run reportportal:stop

# View logs
npm run reportportal:logs
```

### Features

- **Historical Analysis** - Track test results over time
- **Dashboards** - Visualize pass/fail trends, execution statistics
- **Defect Triage** - Analyze and categorize failures
- **Filters** - Create custom views for different test suites
- **Widgets** - Overall statistics, launch trends, pass/fail charts

---

## Jenkins Integration

The framework includes a Jenkinsfile for CI/CD integration.

### Pipeline Features

- Parameterized builds (test suite selection, environment)
- Automated browser installation
- Parallel test execution support
- Artifact archiving for reports

### Running in Jenkins

1. Create a new Pipeline job
2. Point to SCM with this repository
3. Configure parameters:
   - `TEST_SUITE`: all, ui, api, performance
   - `ENVIRONMENT`: prod, qa, dev
4. Run the build

### Pipeline Stages

| Stage | Description |
|-------|-------------|
| Checkout | Clone repository |
| Setup | Install npm dependencies |
| Install Browsers | Install Playwright browsers |
| UI Tests | Run UI test suite |
| API Tests | Run API test suite |
| Performance Tests | Run k6 performance tests |
| Sync Reports | Consolidate all reports |

### Viewing HTML Reports in Jenkins

To properly render HTML reports with CSS in Jenkins, disable Content Security Policy by running this in Jenkins Script Console:

```groovy
System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", "")
```

### Slack Notifications

The pipeline sends test execution summaries to Slack with:
- Build status (pass/fail)
- Test results summary (passed, failed, skipped)
- Links to reports (Dashboard, Playwright, ReportPortal)

**Setup Steps:**

1. **Install Slack Notification Plugin**
   - Go to Jenkins > Manage Jenkins > Plugins
   - Search for "Slack Notification" and install

2. **Create Slack App**
   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - Create new app > From scratch
   - Add "Incoming Webhooks" feature
   - Activate and add webhook to your channel

3. **Configure Jenkins**
   - Go to Jenkins > Manage Jenkins > System
   - Find "Slack" section
   - Add workspace and credential (Bot token or Webhook)
   - Test connection

4. **Update Jenkinsfile**
   - Change `SLACK_CHANNEL` to your channel name
   - Update `REPORTPORTAL_URL` if different

**Sample Slack Message:**
```
✅ Test Execution Passed
Job: sockshop-automation #42
Environment: prod
Test Suite: all

Results Summary:
Tests: 16 passed, 0 failed, 0 skipped (100% pass rate)
Performance: 11 iterations in 30.5s

Reports:
• Dashboard Report
• Playwright Report
• ReportPortal
```

---

## Project Dependencies

```
┌─────────────────────────────────────────────────────────┐
│                    @sockshop/app                        │
│              (UI + API Tests - Playwright)              │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   @sockshop/shared                      │
│         (Config, Types, Utils, Auth, Components)        │
└─────────────────────────────────────────────────────────┘
                          ▲
          ┌───────────────┼───────────────┐
          │               │               │
┌─────────┴─────┐ ┌───────┴──────┐ ┌──────┴──────┐
│  @sockshop/   │ │  @sockshop/  │ │ @sockshop/  │
│   security    │ │  performance │ │   mobile    │
│    (ZAP)      │ │     (k6)     │ │   (TBD)     │
└───────────────┘ └──────────────┘ └─────────────┘
```

---

## Best Practices

### DO

- Keep modules independent and self-contained
- Write both UI and API tests for each feature
- Use page objects for UI interactions
- Use API clients for backend calls
- Share common utilities via `@sockshop/shared`
- Use environment-specific configurations
- Run security scans in CI/CD pipeline

### DON'T

- Don't create cross-module dependencies
- Don't hardcode credentials (use env vars)
- Don't skip API tests when UI tests exist
- Don't duplicate code across modules
- Don't commit sensitive data

---

## CI/CD Integration

```yaml
# Example GitHub Actions workflow
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - run: npm ci
      - run: npx playwright install --with-deps

      - name: Run UI Tests
        run: npm run test:ui

      - name: Run API Tests
        run: npm run test:api

      - name: Run Performance Tests
        run: npm run test:perf

      - name: Upload Reports
        uses: actions/upload-artifact@v4
        with:
          name: test-reports
          path: reports/
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Browser not found | `npx playwright install` |
| Module not found | `npm install` from root |
| TypeScript errors | Check `tsconfig.json` paths |
| ZAP not running | `npm run zap:start --workspace=@sockshop/security` |
| k6 not found | Install k6: `brew install k6` (macOS) |

---

## Contributing

1. Create a new branch from `main`
2. Add your module/tests following the structure
3. Ensure all tests pass: `npm run test:all`
4. Submit a pull request

---

## Integrations

### Slack Integration

The framework integrates with Slack to provide real-time test execution notifications directly to your team channels.

**Features:**
- Automated notifications on build completion (pass/fail/unstable)
- Test results summary with pass/fail counts and pass rate
- Direct links to Jenkins reports, Playwright reports, and ReportPortal
- Performance test metrics included in notifications

**Setup:**
1. Create a Slack App at [api.slack.com/apps](https://api.slack.com/apps)
2. Enable **Incoming Webhooks** feature
3. Create a webhook URL for your target channel
4. Store the webhook URL as Jenkins credential with ID `slack-webhook`

**Sample Notification:**
```
✅ Test Execution PASSED
━━━━━━━━━━━━━━━━━━━━━━━━━━
Job: sockshop-automation #13
Environment: prod
Test Suite: all

Results Summary:
Tests: 18 passed, 0 failed (100% pass rate)
Performance: 11 iterations in 30.3s

Reports:
• Dashboard Report
• Playwright Report
• ReportPortal
```

---

## Roadmap / TODO

### Planned Enhancements

| Feature | Description | Status |
|---------|-------------|--------|
| **AWS Lambda Auto-Scaling** | Dynamically spin up VMs for parallel test execution and terminate after completion using AWS Lambda triggers | Planned |
| **Grafana Integration** | Real-time dashboards for test metrics, performance trends, and historical analysis | Planned |
| **Dynatrace Integration** | APM integration for correlating test results with application performance metrics | Planned |

### AWS Lambda Auto-Scaling Execution

**Goal:** Automatically scale test execution infrastructure based on demand.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Jenkins   │────▶│  AWS Lambda  │────▶│  EC2 Instances  │
│   Trigger   │     │  Orchestrator │     │  (Playwright)   │
└─────────────┘     └──────────────┘     └─────────────────┘
                           │                      │
                           │                      ▼
                           │              ┌─────────────────┐
                           │              │  Run Tests in   │
                           │              │    Parallel     │
                           │              └─────────────────┘
                           │                      │
                           ▼                      ▼
                    ┌──────────────┐     ┌─────────────────┐
                    │  Terminate   │◀────│  Collect Results │
                    │     VMs      │     │   & Reports     │
                    └──────────────┘     └─────────────────┘
```

**Planned Features:**
- Trigger Lambda on Jenkins pipeline start
- Dynamically provision EC2 instances based on test count
- Distribute tests across instances for parallel execution
- Auto-terminate instances after test completion
- Cost optimization through spot instances

### Grafana Integration

**Goal:** Visualize test execution metrics and trends.

**Planned Dashboards:**
- Test execution trends (pass/fail over time)
- Performance test metrics (response times, throughput)
- Test duration analytics
- Failure pattern analysis
- Environment comparison views

### Dynatrace Integration

**Goal:** Correlate test execution with application performance.

**Planned Features:**
- Link test runs to Dynatrace sessions
- Capture APM data during test execution
- Identify performance bottlenecks from test failures
- Automated problem detection correlation

---

## License

ISC

---

<p align="center">
  <b>Built for Scale. Designed for Teams.</b>
</p>
