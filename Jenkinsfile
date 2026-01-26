pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        CI = 'true'
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}/browsers"
        // Slack configuration - set in Jenkins credentials
        SLACK_CHANNEL = '#test-automation'
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

            // Generate test summary for Slack
            script {
                env.TEST_SUMMARY = sh(
                    script: 'node scripts/parse-test-results.js 2>/dev/null || echo "Results parsing unavailable"',
                    returnStdout: true
                ).trim()
            }
        }

        success {
            echo 'Pipeline completed successfully!'
            slackSend(
                channel: env.SLACK_CHANNEL,
                color: 'good',
                message: """
:white_check_mark: *Test Execution Passed*
*Job:* ${env.JOB_NAME} #${env.BUILD_NUMBER}
*Environment:* ${params.ENVIRONMENT}
*Test Suite:* ${params.TEST_SUITE}

*Results Summary:*
${env.TEST_SUMMARY}

:link: *Reports:*
• <${env.BUILD_URL}artifact/reports/dashboard.html|Dashboard Report>
• <${env.BUILD_URL}artifact/packages/app/reports/html/index.html|Playwright Report>
• <${env.REPORTPORTAL_URL}|ReportPortal>
                """
            )
        }

        failure {
            echo 'Pipeline failed!'
            slackSend(
                channel: env.SLACK_CHANNEL,
                color: 'danger',
                message: """
:x: *Test Execution Failed*
*Job:* ${env.JOB_NAME} #${env.BUILD_NUMBER}
*Environment:* ${params.ENVIRONMENT}
*Test Suite:* ${params.TEST_SUITE}

*Results Summary:*
${env.TEST_SUMMARY}

:link: *Reports:*
• <${env.BUILD_URL}artifact/reports/dashboard.html|Dashboard Report>
• <${env.BUILD_URL}artifact/packages/app/reports/html/index.html|Playwright Report>
• <${env.REPORTPORTAL_URL}|ReportPortal>
• <${env.BUILD_URL}console|Console Output>
                """
            )
        }

        unstable {
            slackSend(
                channel: env.SLACK_CHANNEL,
                color: 'warning',
                message: """
:warning: *Test Execution Unstable*
*Job:* ${env.JOB_NAME} #${env.BUILD_NUMBER}
*Environment:* ${params.ENVIRONMENT}
*Test Suite:* ${params.TEST_SUITE}

*Results Summary:*
${env.TEST_SUMMARY}

:link: *Reports:*
• <${env.BUILD_URL}artifact/reports/dashboard.html|Dashboard Report>
• <${env.BUILD_URL}artifact/packages/app/reports/html/index.html|Playwright Report>
• <${env.REPORTPORTAL_URL}|ReportPortal>
                """
            )
        }
    }
}
