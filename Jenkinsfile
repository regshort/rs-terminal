pipeline {
  agent any
  // environment {
  //   NODE_ENV = "production"
  // }
  tools {nodejs "nodejs"}
  stages {
    stage('Build') {
      steps {
        sh 'yarn'
        sh 'yarn build'
      }
    }
    stage('Deploy') {
      steps {
        sshagent(['ssh']) {
            sh 'scp -r -o StrictHostKeyChecking=no .next regshort@rs-web:/git/rs-terminal/'
            sh 'ssh regshort@rs-web "cd /git/rs-terminal/ && git reset --hard HEAD && git pull"'
            sh 'ssh regshort@rs-web "/usr/local/lib/npm/bin/pm2 restart terminal"'
        }
      }
    }
  }
}