#!/usr/bin/env node

/**
 * Dashboard Update Script
 * =======================
 * Updates the dashboard with latest test results and stats
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(ROOT_DIR, 'reports');
const DASHBOARD_FILE = path.join(REPORTS_DIR, 'dashboard.html');

// Collect stats from various reports
function collectStats() {
  const stats = {
    ui: { passed: 0, failed: 0, skipped: 0 },
    api: { passed: 0, failed: 0 },
    performance: { rps: '-', avg: '-', p95: '-' },
    security: { high: 0, medium: 0, low: 0 },
    lastUpdated: new Date().toISOString(),
  };

  // Try to read Playwright UI results
  try {
    const uiResultsPath = path.join(ROOT_DIR, 'packages/web/test-results/.last-run.json');
    if (fs.existsSync(uiResultsPath)) {
      const results = JSON.parse(fs.readFileSync(uiResultsPath, 'utf8'));
      stats.ui.passed = results.passed || 0;
      stats.ui.failed = results.failed || 0;
      stats.ui.skipped = results.skipped || 0;
    }
  } catch (e) {
    console.log('Could not read UI test results');
  }

  // Try to read Playwright API results
  try {
    const apiResultsPath = path.join(ROOT_DIR, 'packages/api/test-results/.last-run.json');
    if (fs.existsSync(apiResultsPath)) {
      const results = JSON.parse(fs.readFileSync(apiResultsPath, 'utf8'));
      stats.api.passed = results.passed || 0;
      stats.api.failed = results.failed || 0;
    }
  } catch (e) {
    console.log('Could not read API test results');
  }

  // Try to read k6 performance results
  try {
    const perfDir = path.join(ROOT_DIR, 'packages/performance/reports');
    if (fs.existsSync(perfDir)) {
      const files = fs.readdirSync(perfDir).filter(f => f.endsWith('.json') && f.includes('summary'));
      if (files.length > 0) {
        const latestFile = files.sort().pop();
        const perfResults = JSON.parse(fs.readFileSync(path.join(perfDir, latestFile), 'utf8'));
        if (perfResults.metrics) {
          const httpReqs = perfResults.metrics.http_reqs?.values?.rate || 0;
          const httpDuration = perfResults.metrics.http_req_duration?.values || {};
          stats.performance.rps = httpReqs.toFixed(1);
          stats.performance.avg = (httpDuration.avg || 0).toFixed(0);
          stats.performance.p95 = (httpDuration['p(95)'] || 0).toFixed(0);
        }
      }
    }
  } catch (e) {
    console.log('Could not read performance results');
  }

  // Try to read ZAP security results
  try {
    const secDir = path.join(ROOT_DIR, 'packages/security/reports');
    if (fs.existsSync(secDir)) {
      const files = fs.readdirSync(secDir).filter(f => f.endsWith('.json') && f.includes('summary'));
      if (files.length > 0) {
        const latestFile = files.sort().pop();
        const secResults = JSON.parse(fs.readFileSync(path.join(secDir, latestFile), 'utf8'));
        if (secResults.summary) {
          stats.security.high = secResults.summary.high || 0;
          stats.security.medium = secResults.summary.medium || 0;
          stats.security.low = secResults.summary.low || 0;
        }
      }
    }
  } catch (e) {
    console.log('Could not read security results');
  }

  return stats;
}

// Update dashboard HTML with stats
function updateDashboard(stats) {
  if (!fs.existsSync(DASHBOARD_FILE)) {
    console.error('Dashboard file not found:', DASHBOARD_FILE);
    return;
  }

  let html = fs.readFileSync(DASHBOARD_FILE, 'utf8');

  // Update stats in the HTML
  const statsScript = `
  <script>
    // Auto-loaded stats from last test run
    const dashboardStats = ${JSON.stringify(stats, null, 2)};
    localStorage.setItem('dashboardStats', JSON.stringify(dashboardStats));

    // Update UI
    document.getElementById('lastUpdated').textContent = new Date('${stats.lastUpdated}').toLocaleString();
    document.getElementById('ui-passed').textContent = '${stats.ui.passed}';
    document.getElementById('ui-failed').textContent = '${stats.ui.failed}';
    document.getElementById('ui-skipped').textContent = '${stats.ui.skipped}';
    document.getElementById('api-passed').textContent = '${stats.api.passed}';
    document.getElementById('api-failed').textContent = '${stats.api.failed}';
    document.getElementById('perf-rps').textContent = '${stats.performance.rps}';
    document.getElementById('perf-avg').textContent = '${stats.performance.avg}';
    document.getElementById('perf-p95').textContent = '${stats.performance.p95}';
    document.getElementById('sec-high').textContent = '${stats.security.high}';
    document.getElementById('sec-medium').textContent = '${stats.security.medium}';
    document.getElementById('sec-low').textContent = '${stats.security.low}';
  </script>
</body>`;

  // Replace closing body tag with stats script
  html = html.replace(/<\/body>/, statsScript);

  fs.writeFileSync(DASHBOARD_FILE, html);
  console.log('Dashboard updated with latest stats');
}

// Main
const stats = collectStats();
console.log('Collected stats:', JSON.stringify(stats, null, 2));
updateDashboard(stats);
console.log('Dashboard ready:', DASHBOARD_FILE);
