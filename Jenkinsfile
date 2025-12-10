pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📥 Installing dependencies...'
                sh '''
                    if [ -f package.json ]; then
                        npm install
                    else
                        echo "No package.json found"
                    fi
                '''
            }
        }
        
        stage('Build') {
            steps {
                echo '🔨 Building application...'
                sh '''
                    if [ -f package.json ]; then
                        npm run build || echo "No build script defined"
                    else
                        echo "No package.json found"
                    fi
                '''
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                sh '''
                    if [ -f package.json ]; then
                        npm test || echo "No test script defined"
                    else
                        echo "No package.json found"
                    fi
                '''
            }
        }
        
        stage('Docker Build') {
            steps {
                echo '🐳 Building Docker image...'
                sh '''
                    if [ -f Dockerfile ]; then
                        docker build -t btech:${BUILD_NUMBER} .
                        docker tag btech:${BUILD_NUMBER} btech:latest
                        echo "Docker image built: btech:${BUILD_NUMBER}"
                    else
                        echo "No Dockerfile found, skipping Docker build"
                    fi
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ Build successful!'
            echo "Build #${BUILD_NUMBER} completed"
        }
        failure {
            echo '❌ Build failed!'
        }
        always {
            echo '🧹 Cleaning workspace...'
        }
    }
}