# CI/CD Pipeline Documentation

This document explains how to set up and run the Jenkins pipeline for the SockShop Automation Framework.

---

## Quick Start

### Option 1: Use Existing Jenkins

1. Create a new Pipeline job in Jenkins
2. Point to this repository
3. Jenkins will automatically detect the `Jenkinsfile`

### Option 2: Docker Compose (Jenkins + ZAP)

```bash
# Start Jenkins and ZAP containers
docker-compose up -d

# Access Jenkins at http://localhost:8081
# ZAP API at http://localhost:8080
```

---

## Pipeline Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────────┐
│  Checkout   │───▶│    Setup    │───▶│Install Browsers │
└─────────────┘    └─────────────┘    └────────┬────────┘
                                               │
                   ┌───────────────────────────┼───────────────────────────┐
                   │                           │                           │
                   ▼                           ▼                           ▼
            ┌─────────────┐             ┌─────────────┐             ┌─────────────┐
            │  UI Tests   │             │  API Tests  │             │  Start ZAP  │
            │ (parallel)  │             │ (parallel)  │             │ (if enabled)│
            └──────┬──────┘             └──────┬──────┘             └─────────────┘
                   │                           │
                   └───────────────┬───────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ Performance Test│
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ Security Results│
                          │   (if ZAP on)   │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  Sync Reports   │
                          │  & Dashboard    │
                          └─────────────────┘
```

---

## Pipeline Parameters

| Parameter | Options | Description |
|-----------|---------|-------------|
| `TEST_SUITE` | all, ui, api, performance, security | Select test suite |
| `ENVIRONMENT` | prod, qa, dev | Target environment |
| `ENABLE_ZAP` | true/false | Enable ZAP passive scanning |

---

## Jenkins Setup

### Required Plugins

Install these plugins in Jenkins:

1. **Pipeline** - Core pipeline functionality
2. **HTML Publisher** - Publish HTML reports
3. **NodeJS** - Node.js installation
4. **Docker Pipeline** - Docker support (optional)
5. **Workspace Cleanup** - Clean workspace after builds

### Global Tool Configuration

1. Go to **Manage Jenkins** → **Global Tool Configuration**
2. Add **NodeJS** installation:
   - Name: `NodeJS-18`
   - Version: `18.x`
   - Global npm packages: `playwright`

### Credentials (if needed)

Add credentials for:
- Git repository access
- ZAP API key (if using authenticated scans)
- Slack/Email notifications

---

## Running the Pipeline

### From Jenkins UI

1. Open the pipeline job
2. Click **Build with Parameters**
3. Select:
   - `TEST_SUITE`: Choose which tests to run
   - `ENVIRONMENT`: Target environment
   - `ENABLE_ZAP`: Enable for security scanning
4. Click **Build**

### From Command Line (Jenkins CLI)

```bash
java -jar jenkins-cli.jar -s http://localhost:8081/ \
  build sockshop-automation \
  -p TEST_SUITE=all \
  -p ENVIRONMENT=prod \
  -p ENABLE_ZAP=true
```

---

## Reports

After pipeline execution, reports are available:

| Report | Location | Description |
|--------|----------|-------------|
| **UI Test Report** | Pipeline → UI Test Report | Playwright HTML report |
| **API Test Report** | Pipeline → API Test Report | Playwright HTML report |
| **Performance Report** | Pipeline → Performance Report | k6 metrics |
| **Security Report** | Pipeline → Security Report | ZAP findings |
| **Dashboard** | Pipeline → Test Dashboard | Unified view |

---

## Docker Setup

### Starting Containers

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Container Details

| Container | Port | Purpose |
|-----------|------|---------|
| `jenkins` | 8081 | Jenkins UI |
| `jenkins-agent` | - | Playwright test runner |
| `zap` | 8080 | OWASP ZAP proxy |

### Initial Jenkins Setup

1. Get initial admin password:
   ```bash
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```
2. Access http://localhost:8081
3. Install suggested plugins
4. Create admin user

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CI` | true | Indicates CI environment |
| `TEST_ENV` | prod | Target environment |
| `ZAP_PROXY` | false | Enable ZAP proxy |
| `ZAP_HOST` | localhost | ZAP host address |
| `ZAP_PORT` | 8080 | ZAP port |

---

## Troubleshooting

### Browser Installation Failed

```bash
# Install browsers manually
docker exec jenkins-agent npx playwright install --with-deps
```

### ZAP Connection Refused

```bash
# Check ZAP is running
curl http://localhost:8080/JSON/core/view/version/

# Restart ZAP container
docker-compose restart zap
```

### Permission Denied

```bash
# Fix workspace permissions
docker exec jenkins-agent chown -R pwuser:pwuser /workspace
```

### Out of Memory

Add to Jenkins container:
```yaml
environment:
  - JAVA_OPTS=-Xmx2g -Xms512m
```

---

## Pipeline Customization

### Adding Slack Notifications

```groovy
post {
    failure {
        slackSend channel: '#automation',
                  color: 'danger',
                  message: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
    }
}
```

### Adding Email Notifications

```groovy
post {
    failure {
        emailext subject: "Build Failed: ${env.JOB_NAME}",
                 body: "Check console output at ${env.BUILD_URL}",
                 to: 'team@example.com'
    }
}
```

### Running on Specific Node

```groovy
agent {
    label 'playwright-agent'
}
```

---

## Best Practices

1. **Run ZAP tests in non-production** - Security scans can be intrusive
2. **Use parallel execution** - UI and API tests run in parallel
3. **Archive artifacts** - Keep reports for debugging
4. **Set timeouts** - Prevent stuck builds
5. **Clean workspace** - Free up disk space

---

## Support

For issues with:
- **Pipeline**: Check Jenkins console output
- **Tests**: Review Playwright reports
- **ZAP**: Check ZAP logs in Docker
- **Docker**: Use `docker-compose logs`
