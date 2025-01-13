pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO = 'malek140'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/MalekNasr/Projet1'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def services = ['apiGateway', 'MicroSer', 'MicroServ']
                    services.each { service ->
                        // Build Docker images for each service
                        sh "docker build -t ${env.DOCKER_HUB_REPO}:${service} ./${service}"
                    }
                }
            }
        }
        
        stage('Scan Docker Images') {
            steps {
                script {
                    def services = ['api', 'MicroSer', 'MicroServ']
                    services.each { service ->
                        sh """
                        trivy image --exit-code 1 --severity HIGH,CRITICAL ${env.DOCKER_HUB_REPO}:${service} || true
                        """
                    }
                }
            }
        }


        stage('Login to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub using stored credentials
                    echo "Logging into Docker Hub as ${env.DOCKER_HUB_REPO}"
                    withCredentials([usernamePassword(credentialsId: '63fd3a88-d36b-479e-863b-a0881fde4f7e', 
                                                     usernameVariable: 'DOCKER_USERNAME', 
                                                     passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                        echo "Successfully logged into Docker Hub."
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            when {
                expression { return false } 
            }
            steps {
                // Docker push commands
                sh 'docker push moamrn:apiGateway'
                sh 'docker push moamrn:books-service'
                sh 'docker push moamrn:users-service'
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}

/*pipeline {
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
*/