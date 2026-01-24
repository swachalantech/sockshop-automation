pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        CI = 'true'
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}/browsers"
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
        }

        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }
    }
}
