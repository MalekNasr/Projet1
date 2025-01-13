pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t hotel-service ./MicroSer'
                sh 'docker build -t user-service ./MicroServ'
            }
        }
        stage('Scan') {
            steps {
                sh 'trivy image hotel-service'
                sh 'trivy image user-service'
            }
        }
        stage('Push') {
            steps {
                withCredentials([string(credentialsId: 'docker-hub-password', variable: 'DOCKER_PASSWORD')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login --username your-docker-username --password-stdin'
                    sh 'docker tag hotel-service your-docker-username/hotel-service'
                    sh 'docker push your-docker-username/hotel-service'
                    sh 'docker tag user-service your-docker-username/user-service'
                    sh 'docker push your-docker-username/user-service'
                }
            }
        }
    }
}
