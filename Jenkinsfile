pipeline {
  agent any

  tools {nodejs "nodejs"}
  stages {
    stage('Build') {
      steps {
        sh 'npm i yarn'
        sh 'yarn'
        sh 'yarn build'
      }
    }
    stage('Deploy') {
      steps {
        sshagent(['ssh']) {
            sh 'scp -r -o StrictHostKeyChecking=no .next regshort@rs-web:/git/rs-web/'
            sh 'ssh regshort@rs-web "cd /git/rs-web/ && git pull"'
            sh 'ssh regshort@rs-web "/usr/local/lib/npm/bin/pm2 restart web"'
        }
      }
    }
  }
}