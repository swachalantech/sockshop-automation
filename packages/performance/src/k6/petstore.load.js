/**
 * Petstore API Performance Tests
 * ==============================
 * k6 load tests for POST /pet and GET /pet/{id} endpoints
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics
const petCreated = new Counter('pets_created');
const petRetrieved = new Counter('pets_retrieved');
const errorRate = new Rate('errors');
const createPetDuration = new Trend('create_pet_duration');
const getPetDuration = new Trend('get_pet_duration');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'https://petstore.swagger.io/v2';
const TEST_TYPE = __ENV.TEST_TYPE || 'smoke';

// Test scenarios
const testConfigs = {
  smoke: {
    vus: 1,
    duration: '30s',
  },
  load: {
    stages: [
      { duration: '1m', target: 10 },   // Ramp up to 10 users
      { duration: '3m', target: 10 },   // Stay at 10 users
      { duration: '1m', target: 0 },    // Ramp down
    ],
  },
  stress: {
    stages: [
      { duration: '1m', target: 10 },   // Ramp up
      { duration: '2m', target: 20 },   // Increase load
      { duration: '2m', target: 30 },   // Peak load
      { duration: '1m', target: 0 },    // Ramp down
    ],
  },
};

export const options = {
  ...testConfigs[TEST_TYPE],
  thresholds: {
    http_req_duration: ['p(95)<2000'],    // 95% of requests under 2s
    http_req_failed: ['rate<0.05'],       // Error rate under 5%
    errors: ['rate<0.05'],                // Custom error rate under 5%
    create_pet_duration: ['p(95)<1500'],  // POST /pet under 1.5s
    get_pet_duration: ['p(95)<1000'],     // GET /pet/{id} under 1s
  },
};

// Generate random pet data
function generatePetData() {
  const petId = Math.floor(Math.random() * 1000000);
  const petNames = ['Buddy', 'Max', 'Luna', 'Charlie', 'Bella', 'Rocky', 'Daisy'];
  const statuses = ['available', 'pending', 'sold'];

  return {
    id: petId,
    name: petNames[Math.floor(Math.random() * petNames.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    category: {
      id: 1,
      name: 'Dogs',
    },
    photoUrls: ['https://example.com/photo.jpg'],
    tags: [
      { id: 1, name: 'friendly' },
    ],
  };
}

export default function () {
  let petId;

  group('POST /pet - Create Pet', () => {
    const petData = generatePetData();
    const payload = JSON.stringify(petData);

    const params = {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
    };

    const startTime = Date.now();
    const response = http.post(`${BASE_URL}/pet`, payload, params);
    const duration = Date.now() - startTime;

    createPetDuration.add(duration);

    const success = check(response, {
      'POST /pet status is 200': (r) => r.status === 200,
      'POST /pet response has id': (r) => {
        try {
          const body = JSON.parse(r.body);
          petId = body.id;
          return body.id !== undefined;
        } catch {
          return false;
        }
      },
      'POST /pet response has correct name': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.name === petData.name;
        } catch {
          return false;
        }
      },
    });

    if (success) {
      petCreated.add(1);
    } else {
      errorRate.add(1);
    }
  });

  sleep(1);

  group('GET /pet/{id} - Retrieve Pet', () => {
    if (!petId) {
      console.log('No pet ID available, skipping GET');
      return;
    }

    const params = {
      headers: {
        'accept': 'application/json',
      },
    };

    const startTime = Date.now();
    const response = http.get(`${BASE_URL}/pet/${petId}`, params);
    const duration = Date.now() - startTime;

    getPetDuration.add(duration);

    const success = check(response, {
      'GET /pet/{id} status is 200': (r) => r.status === 200,
      'GET /pet/{id} returns correct pet': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.id === petId;
        } catch {
          return false;
        }
      },
    });

    if (success) {
      petRetrieved.add(1);
    } else {
      errorRate.add(1);
    }
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data),
    'reports/petstore-summary.json': JSON.stringify(data, null, 2),
    'reports/petstore-report.html': generateHtmlReport(data),
  };
}

function textSummary(data) {
  let output = '\n';
  output += '='.repeat(60) + '\n';
  output += ` PETSTORE API PERFORMANCE TEST SUMMARY\n`;
  output += '='.repeat(60) + '\n\n';
  output += ` Test Type: ${TEST_TYPE}\n`;
  output += ` Base URL: ${BASE_URL}\n\n`;

  if (data.metrics) {
    output += ` METRICS:\n`;
    output += `   - Pets Created: ${data.metrics.pets_created?.values?.count || 0}\n`;
    output += `   - Pets Retrieved: ${data.metrics.pets_retrieved?.values?.count || 0}\n`;
    output += `   - Error Rate: ${((data.metrics.errors?.values?.rate || 0) * 100).toFixed(2)}%\n`;
    output += `   - Avg Create Duration: ${(data.metrics.create_pet_duration?.values?.avg || 0).toFixed(2)}ms\n`;
    output += `   - Avg Get Duration: ${(data.metrics.get_pet_duration?.values?.avg || 0).toFixed(2)}ms\n`;
  }

  output += '\n' + '='.repeat(60) + '\n';
  return output;
}

function generateHtmlReport(data) {
  const metrics = data.metrics || {};
  const testDuration = (data.state?.testRunDurationMs / 1000).toFixed(2);
  const totalRequests = metrics.http_reqs?.values?.count || 0;
  const errorRate = ((metrics.http_req_failed?.values?.rate || 0) * 100).toFixed(2);
  const petsCreated = metrics.pets_created?.values?.count || 0;
  const petsRetrieved = metrics.pets_retrieved?.values?.count || 0;

  const httpDuration = metrics.http_req_duration?.values || {};
  const createDuration = metrics.create_pet_duration?.values || {};
  const getDuration = metrics.get_pet_duration?.values || {};

  // Get thresholds status
  const thresholds = [];
  Object.keys(metrics).forEach(key => {
    if (metrics[key].thresholds) {
      Object.keys(metrics[key].thresholds).forEach(threshold => {
        thresholds.push({
          metric: key,
          threshold: threshold,
          passed: metrics[key].thresholds[threshold].ok
        });
      });
    }
  });

  // Get checks
  const checks = [];
  if (data.root_group?.groups) {
    data.root_group.groups.forEach(group => {
      if (group.checks) {
        group.checks.forEach(check => {
          checks.push({
            group: group.name,
            name: check.name,
            passes: check.passes,
            fails: check.fails
          });
        });
      }
    });
  }

  const passedThresholds = thresholds.filter(t => t.passed).length;
  const totalThresholds = thresholds.length;
  const passedChecks = checks.reduce((sum, c) => sum + c.passes, 0);
  const failedChecks = checks.reduce((sum, c) => sum + c.fails, 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>k6 Performance Test Report - Petstore API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background: #f5f7fa; color: #333; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; margin-bottom: 30px; border-radius: 10px; }
    header h1 { font-size: 2.5em; margin-bottom: 10px; }
    header .subtitle { opacity: 0.9; font-size: 1.1em; }
    .meta-info { display: flex; justify-content: center; gap: 30px; margin-top: 20px; flex-wrap: wrap; }
    .meta-item { background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 20px; }
    .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .card { background: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); text-align: center; }
    .card.success { border-top: 4px solid #10b981; }
    .card.warning { border-top: 4px solid #f59e0b; }
    .card.error { border-top: 4px solid #ef4444; }
    .card.info { border-top: 4px solid #3b82f6; }
    .card h3 { color: #666; font-size: 0.9em; text-transform: uppercase; margin-bottom: 10px; }
    .card .value { font-size: 2.5em; font-weight: bold; color: #333; }
    .card .unit { font-size: 0.9em; color: #888; }
    .section { background: white; border-radius: 10px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    .section h2 { color: #333; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #eee; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f8fafc; font-weight: 600; color: #555; }
    tr:hover { background: #f8fafc; }
    .status { padding: 4px 12px; border-radius: 20px; font-size: 0.85em; font-weight: 500; }
    .status.pass { background: #d1fae5; color: #065f46; }
    .status.fail { background: #fee2e2; color: #991b1b; }
    .metric-bar { display: flex; align-items: center; gap: 10px; }
    .bar-container { flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; background: linear-gradient(90deg, #10b981, #34d399); border-radius: 4px; }
    .response-times { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
    .time-stat { text-align: center; padding: 15px; background: #f8fafc; border-radius: 8px; }
    .time-stat .label { font-size: 0.85em; color: #666; margin-bottom: 5px; }
    .time-stat .value { font-size: 1.5em; font-weight: bold; color: #333; }
    footer { text-align: center; padding: 20px; color: #888; font-size: 0.9em; }
    .endpoint-section { margin-top: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; }
    .endpoint-section h4 { color: #555; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Petstore API Performance Report</h1>
      <p class="subtitle">k6 Load Test Results</p>
      <div class="meta-info">
        <div class="meta-item">Test Type: <strong>${TEST_TYPE.toUpperCase()}</strong></div>
        <div class="meta-item">Duration: <strong>${testDuration}s</strong></div>
        <div class="meta-item">Base URL: <strong>${BASE_URL}</strong></div>
        <div class="meta-item">Generated: <strong>${new Date().toLocaleString()}</strong></div>
      </div>
    </header>

    <div class="summary-cards">
      <div class="card info">
        <h3>Total Requests</h3>
        <div class="value">${totalRequests}</div>
      </div>
      <div class="card ${errorRate === '0.00' ? 'success' : 'error'}">
        <h3>Error Rate</h3>
        <div class="value">${errorRate}<span class="unit">%</span></div>
      </div>
      <div class="card success">
        <h3>Pets Created</h3>
        <div class="value">${petsCreated}</div>
      </div>
      <div class="card success">
        <h3>Pets Retrieved</h3>
        <div class="value">${petsRetrieved}</div>
      </div>
      <div class="card ${passedThresholds === totalThresholds ? 'success' : 'warning'}">
        <h3>Thresholds</h3>
        <div class="value">${passedThresholds}/${totalThresholds}</div>
      </div>
      <div class="card ${failedChecks === 0 ? 'success' : 'error'}">
        <h3>Checks Passed</h3>
        <div class="value">${passedChecks}<span class="unit">/${passedChecks + failedChecks}</span></div>
      </div>
    </div>

    <div class="section">
      <h2>Response Times Overview</h2>
      <div class="response-times">
        <div class="time-stat">
          <div class="label">Average</div>
          <div class="value">${(httpDuration.avg || 0).toFixed(0)}ms</div>
        </div>
        <div class="time-stat">
          <div class="label">Minimum</div>
          <div class="value">${(httpDuration.min || 0).toFixed(0)}ms</div>
        </div>
        <div class="time-stat">
          <div class="label">Median</div>
          <div class="value">${(httpDuration.med || 0).toFixed(0)}ms</div>
        </div>
        <div class="time-stat">
          <div class="label">Maximum</div>
          <div class="value">${(httpDuration.max || 0).toFixed(0)}ms</div>
        </div>
        <div class="time-stat">
          <div class="label">p(90)</div>
          <div class="value">${(httpDuration['p(90)'] || 0).toFixed(0)}ms</div>
        </div>
        <div class="time-stat">
          <div class="label">p(95)</div>
          <div class="value">${(httpDuration['p(95)'] || 0).toFixed(0)}ms</div>
        </div>
      </div>

      <div class="endpoint-section">
        <h4>POST /pet - Create Pet</h4>
        <div class="response-times">
          <div class="time-stat"><div class="label">Avg</div><div class="value">${(createDuration.avg || 0).toFixed(0)}ms</div></div>
          <div class="time-stat"><div class="label">Min</div><div class="value">${(createDuration.min || 0).toFixed(0)}ms</div></div>
          <div class="time-stat"><div class="label">Max</div><div class="value">${(createDuration.max || 0).toFixed(0)}ms</div></div>
          <div class="time-stat"><div class="label">p(95)</div><div class="value">${(createDuration['p(95)'] || 0).toFixed(0)}ms</div></div>
        </div>
      </div>

      <div class="endpoint-section">
        <h4>GET /pet/{id} - Retrieve Pet</h4>
        <div class="response-times">
          <div class="time-stat"><div class="label">Avg</div><div class="value">${(getDuration.avg || 0).toFixed(0)}ms</div></div>
          <div class="time-stat"><div class="label">Min</div><div class="value">${(getDuration.min || 0).toFixed(0)}ms</div></div>
          <div class="time-stat"><div class="label">Max</div><div class="value">${(getDuration.max || 0).toFixed(0)}ms</div></div>
          <div class="time-stat"><div class="label">p(95)</div><div class="value">${(getDuration['p(95)'] || 0).toFixed(0)}ms</div></div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Thresholds</h2>
      <table>
        <thead>
          <tr><th>Metric</th><th>Threshold</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${thresholds.map(t => `
            <tr>
              <td>${t.metric}</td>
              <td>${t.threshold}</td>
              <td><span class="status ${t.passed ? 'pass' : 'fail'}">${t.passed ? 'PASSED' : 'FAILED'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Checks</h2>
      <table>
        <thead>
          <tr><th>Group</th><th>Check</th><th>Passes</th><th>Fails</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${checks.map(c => `
            <tr>
              <td>${c.group}</td>
              <td>${c.name}</td>
              <td>${c.passes}</td>
              <td>${c.fails}</td>
              <td><span class="status ${c.fails === 0 ? 'pass' : 'fail'}">${c.fails === 0 ? 'PASSED' : 'FAILED'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <footer>
      <p>Generated by k6 Performance Testing Framework | Petstore API Load Tests</p>
    </footer>
  </div>
</body>
</html>`;
}
