const AWS = require('aws-sdk');
let credentials = null;

exports.handler = async () => {
  const SM = new AWS.SecretsManager();

  if (!credentials) {
    try {
      const secretPromise = await SM.getSecretValue({ SecretId: process.env.RH_CREDENTIALS_ARN }).promise();
      credentials = JSON.parse(secretPromise.SecretString);
    } catch {
      throw new Error('Unable to get Secret Value.');
    }
  }

  return credentials;
}