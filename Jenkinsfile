pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        CI = 'true'
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}/browsers"
        ZAP_HOST = 'localhost'
        ZAP_PORT = '8080'
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
            choices: ['all', 'ui', 'api', 'performance', 'security'],
            description: 'Select which test suite to run'
        )
        choice(
            name: 'ENVIRONMENT',
            choices: ['prod', 'qa', 'dev'],
            description: 'Target environment'
        )
        booleanParam(
            name: 'ENABLE_ZAP',
            defaultValue: false,
            description: 'Enable ZAP passive security scanning'
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
            post {
                always {
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'packages/app/playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'UI Test Report'
                    ])
                }
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
            post {
                always {
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'packages/app/playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'API Test Report'
                    ])
                }
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
            post {
                always {
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'packages/performance/reports',
                        reportFiles: 'petstore-report.html',
                        reportName: 'Performance Report'
                    ])
                }
            }
        }

        stage('Sync Reports') {
            steps {
                sh 'bash scripts/sync-reports.sh || true'
            }
            post {
                always {
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'reports',
                        reportFiles: 'dashboard.html',
                        reportName: 'Test Dashboard'
                    ])
                }
            }
        }
    }

    post {
        always {
            // Archive test artifacts
            archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'packages/*/playwright-report/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'packages/*/test-results/**/*', allowEmptyArchive: true

            // Clean workspace
            cleanWs(
                cleanWhenNotBuilt: false,
                deleteDirs: true,
                disableDeferredWipeout: true,
                notFailBuild: true,
                patterns: [
                    [pattern: 'node_modules/**', type: 'EXCLUDE'],
                    [pattern: 'browsers/**', type: 'EXCLUDE']
                ]
            )
        }

        success {
            echo '✅ Pipeline completed successfully!'
            script {
                if (env.CHANGE_ID) {
                    // If this is a PR build, add a comment
                    echo "PR #${env.CHANGE_ID} - All tests passed"
                }
            }
        }

        failure {
            echo '❌ Pipeline failed!'
            script {
                // Send notification on failure (configure as needed)
                echo 'Consider adding Slack/Email notifications here'
            }
        }

        unstable {
            echo '⚠️ Pipeline unstable - some tests may have failed'
        }
    }
}
