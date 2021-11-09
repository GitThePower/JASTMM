const AWS = require('aws-sdk');
const config = require('./config');
let credentials = null;

const handleResult = (msg, res) => {
  console.log(`func=${config.FUNCTION_NAME},msg=${msg}`);
  return res;
}

const handleFailure = (msg) => {
  console.log(`func=${config.FUNCTION_NAME},msg=${msg}`);
  return new Error(msg);
}

const parseEvent = (event) => {
  if(event &&
    event.Records &&
    event.Records[0] &&
    event.Records[0].Sns &&
    event.Records[0].Sns.Message) {
      try {
        const data = JSON.parse(event.Records[0].Sns.Message);
        const mfaCode = data.messageBody.match(config.MFA_TOKEN_PATTERN)[0];
        return handleResult(config.SNS_EVENT_RECEIVED, mfaCode);
      } catch {
        throw handleFailure(config.INVALID_SNS_MESSAGE);
      }
  } else {
    return handleResult(config.SCHEDULED_EXECUTION);
  }
}

const retrieveCredentials = async () => {
  const SM = new AWS.SecretsManager();
  if (!credentials) {
    try {
      const secretPromise = await SM.getSecretValue({ SecretId: process.env.RH_CREDENTIALS_ARN }).promise();
      credentials = JSON.parse(secretPromise.SecretString);
    } catch {
      throw handleFailure(config.SECRETS_MANANGER_ERROR);
    }
  }
}

exports.handler = async (event) => {
  const mfa_code = parseEvent(event);
  await retrieveCredentials();
  
  return handleResult(config.EXECUTION_SUCCESS);
}