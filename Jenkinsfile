pipeline {
    agent {
        docker {
            image 'node:lts-buster-slim' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                dir('server') {
                  sh 'npm install' 
		}
            }
        }
    }
}
