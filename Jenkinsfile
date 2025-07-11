pipeline {
    agent any

    tools {
        maven 'Maven3'
    }

    environment {
        MAVEN_OPTS = "-Dmaven.repo.local=C:\\jenkins1\\maven-repo"
    }

    stages {
        stage('Build Backend') {
            steps {
                dir('backend') {
                    bat 'mvn clean install -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('My SonarQube Server') {
                    bat 'sonar-scanner'
                }
            }
        }
    }
}
