const AWS = require('aws-sdk');
let credentials = null;

class SecretsManager {
  constructor() {
    this.secretsManager = new AWS.SecretsManager();
  }

  getSecretValue = (SecretId) =>
    this.secretsManager.getSecretValue({ SecretId }).promise()
      .then((r) => r)
      .catch((e) => e);
}

exports.handler = async (event) => {
  if (!credentials) {
    try {
      const SM = new SecretsManager();
      credentials = await SM.getSecretValue(process.env.RH_CREDENTIALS_ARN);
    } catch (e) {
      console.error(JSON.stringify(e));
    }
  }

  return credentials;
}