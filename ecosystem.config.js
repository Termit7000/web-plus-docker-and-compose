
require('dotenv').config();

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_REF, DEPLOY_REPO, DEPLOY_PATH,
} = process.env;

module.exports = {

  // Настройка деплоя
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      'post-deploy': 'docker-compose up --build',     
    },
  },
};
