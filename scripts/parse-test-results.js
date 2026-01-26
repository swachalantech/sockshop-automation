#!/usr/bin/env node
/**
 * Parse Playwright test results and output summary for Slack notifications
 */
const fs = require('fs');
const path = require('path');

const results = {
    ui: { passed: 0, failed: 0, skipped: 0 },
    api: { passed: 0, failed: 0, skipped: 0 },
    performance: { iterations: 0, duration: '0s' }
};

// Parse Playwright HTML report JSON
function parsePlaywrightReport(reportPath) {
    try {
        if (!fs.existsSync(reportPath)) return { passed: 0, failed: 0, skipped: 0 };

        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        let passed = 0, failed = 0, skipped = 0;

        const countTests = (suites) => {
            if (!suites) return;
            suites.forEach(suite => {
                if (suite.specs) {
                    suite.specs.forEach(spec => {
                        if (spec.tests) {
                            spec.tests.forEach(test => {
                                if (test.status === 'expected' || test.status === 'passed') passed++;
                                else if (test.status === 'unexpected' || test.status === 'failed') failed++;
                                else if (test.status === 'skipped') skipped++;
                            });
                        }
                    });
                }
                if (suite.suites) countTests(suite.suites);
            });
        };

        countTests(report.suites);
        return { passed, failed, skipped };
    } catch (e) {
        return { passed: 0, failed: 0, skipped: 0 };
    }
}

// Parse k6 performance results
function parseK6Results(summaryPath) {
    try {
        if (!fs.existsSync(summaryPath)) return { iterations: 0, duration: '0s' };

        const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
        return {
            iterations: summary.metrics?.iterations?.values?.count || 0,
            duration: summary.state?.testRunDurationMs
                ? `${(summary.state.testRunDurationMs / 1000).toFixed(1)}s`
                : '0s'
        };
    } catch (e) {
        return { iterations: 0, duration: '0s' };
    }
}

// Main parsing
const appReportPath = path.join(process.cwd(), 'packages/app/reports/html/report.json');
const perfSummaryPath = path.join(process.cwd(), 'packages/performance/reports/petstore-summary.json');

// Get all test results
const appResults = parsePlaywrightReport(appReportPath);

// Separate UI and API based on test file patterns (simplified - counts all as combined)
results.ui = appResults;
results.performance = parseK6Results(perfSummaryPath);

// Calculate totals
const totalPassed = results.ui.passed;
const totalFailed = results.ui.failed;
const totalSkipped = results.ui.skipped;
const totalTests = totalPassed + totalFailed + totalSkipped;

// Output formatted summary
const status = totalFailed > 0 ? 'FAILED' : 'PASSED';
const emoji = totalFailed > 0 ? ':x:' : ':white_check_mark:';

const summary = {
    status,
    emoji,
    tests: {
        total: totalTests,
        passed: totalPassed,
        failed: totalFailed,
        skipped: totalSkipped
    },
    performance: results.performance,
    passRate: totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0'
};

// Output as formatted text for Slack
console.log(`Tests: ${totalPassed} passed, ${totalFailed} failed, ${totalSkipped} skipped (${summary.passRate}% pass rate)`);
if (results.performance.iterations > 0) {
    console.log(`Performance: ${results.performance.iterations} iterations in ${results.performance.duration}`);
}

// Also output JSON for programmatic use
if (process.argv.includes('--json')) {
    console.log(JSON.stringify(summary, null, 2));
}
