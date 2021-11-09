const AWS = require('aws-sdk');

/**
 * Pinpoint
 */
 const parsePinpointSNSMessage = (event, pattern) => {
  const data = JSON.parse(event.Records[0].Sns.Message);
  return data.messageBody.match(pattern)[0];
}

/**
 * Secrets Manager
 */
const getSecretValue = async (SecretId) => {
  const SM = new AWS.SecretsManager();
  const secretPromise = await SM.getSecretValue({ SecretId }).promise();
  return JSON.parse(secretPromise.SecretString);
}

module.exports = {
    getSecretValue,
    parsePinpointSNSMessage
}