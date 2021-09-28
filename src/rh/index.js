const AWS = require('aws-sdk');
let credentials = null;

class SecretsManager {
  constructor() {
    this.secretsManager = new AWS.SecretsManager();
  }

  getSecretValue = (SecretId) =>
    this.secretsManager.getSecretValue({ SecretId }).promise();
}

exports.handler = async () => {
  const SM = new SecretsManager();

  if (!credentials) {
    try {
      const secretPromise = await SM.getSecretValue(process.env.RH_CREDENTIALS_ARN);
      credentials = JSON.parse(secretPromise.SecretString);
    } catch {
      throw new Error('Unable to get Secret Value.');
    }
  }

  return credentials;
}