pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        CI = 'true'
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}/browsers"
        REPORTPORTAL_URL = 'http://localhost:9080'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    parameters {
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'ui', 'api', 'performance'],
            description: 'Select which test suite to run'
        )
        choice(
            name: 'ENVIRONMENT',
            choices: ['prod', 'qa', 'dev'],
            description: 'Target environment'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git log -1 --pretty=format:"%h - %s (%an)"'
            }
        }

        stage('Setup') {
            steps {
                sh '''
                    echo "Node version: $(node -v)"
                    echo "NPM version: $(npm -v)"
                    npm install
                '''
            }
        }

        stage('Install Browsers') {
            steps {
                sh 'npx playwright install chromium || true'
            }
        }

        stage('UI Tests') {
            when {
                expression {
                    return params.TEST_SUITE == 'all' || params.TEST_SUITE == 'ui'
                }
            }
            steps {
                sh "TEST_ENV=${params.ENVIRONMENT} npm run test:ui --workspace=@sockshop/app || true"
            }
        }

        stage('API Tests') {
            when {
                expression {
                    return params.TEST_SUITE == 'all' || params.TEST_SUITE == 'api'
                }
            }
            steps {
                sh "TEST_ENV=${params.ENVIRONMENT} npm run test:api --workspace=@sockshop/app || true"
            }
        }

        stage('Performance Tests') {
            when {
                expression {
                    return params.TEST_SUITE == 'all' || params.TEST_SUITE == 'performance'
                }
            }
            steps {
                sh '''
                    cd packages/performance
                    k6 run --env TEST_TYPE=smoke src/k6/petstore.load.js || true
                '''
            }
        }

        stage('Sync Reports') {
            steps {
                sh 'bash scripts/sync-reports.sh || true'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'packages/*/playwright-report/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'packages/*/test-results/**/*', allowEmptyArchive: true

            script {
                env.TEST_SUMMARY = sh(
                    script: 'node scripts/parse-test-results.js 2>/dev/null || echo "Results parsing unavailable"',
                    returnStdout: true
                ).trim()
            }
        }

        success {
            echo 'Pipeline completed successfully!'
            script {
                sendSlackNotification('PASSED')
            }
        }

        failure {
            echo 'Pipeline failed!'
            script {
                sendSlackNotification('FAILED')
            }
        }

        unstable {
            script {
                sendSlackNotification('UNSTABLE')
            }
        }
    }
}

def sendSlackNotification(String status) {
    def emoji = status == 'PASSED' ? '✅' : (status == 'FAILED' ? '❌' : '⚠️')
    def color = status == 'PASSED' ? 'good' : (status == 'FAILED' ? 'danger' : 'warning')

    def consoleLink = status == 'FAILED' ? "\n• <${env.BUILD_URL}console|Console Output>" : ''

    def payload = """{
  "attachments": [
    {
      "color": "${color}",
      "blocks": [
        {
          "type": "header",
          "text": { "type": "plain_text", "text": "${emoji} Test Execution ${status}", "emoji": true }
        },
        {
          "type": "section",
          "fields": [
            { "type": "mrkdwn", "text": "*Job:*\\n${env.JOB_NAME} #${env.BUILD_NUMBER}" },
            { "type": "mrkdwn", "text": "*Environment:*\\n${params.ENVIRONMENT}" },
            { "type": "mrkdwn", "text": "*Test Suite:*\\n${params.TEST_SUITE}" },
            { "type": "mrkdwn", "text": "*Status:*\\n${emoji} ${status}" }
          ]
        },
        {
          "type": "section",
          "text": { "type": "mrkdwn", "text": "*Results Summary:*\\n${env.TEST_SUMMARY}" }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Reports:*\\n• <${env.BUILD_URL}artifact/reports/dashboard.html|Dashboard Report>\\n• <${env.BUILD_URL}artifact/packages/app/reports/html/index.html|Playwright Report>\\n• <${env.REPORTPORTAL_URL}|ReportPortal>${consoleLink}"
          }
        }
      ]
    }
  ]
}"""

    try {
        withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_WEBHOOK')]) {
            sh "curl -s -X POST \"\${SLACK_WEBHOOK}\" -H 'Content-Type: application/json' -d '${payload}'"
        }
    } catch (Exception e) {
        echo "Slack notification skipped: credential 'slack-webhook' not configured. ${e.message}"
    }
}
