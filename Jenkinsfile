pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-16' // Configure in Jenkins Global Tool Configuration
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/shikamusenge/btech-web.git',
                    credentialsId: 'github-token'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Lint') {
            steps {
                // sh 'npm run lint'
            }
        }
        
        stage('Test') {
            steps {
                // sh 'npm test'
            }
        }
        
        stage('Build') {
            steps {
                // sh 'npm run build'
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                // archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo '✅ Build successful!'
        }
        failure {
            echo '❌ Build failed!'
        }
    }
}