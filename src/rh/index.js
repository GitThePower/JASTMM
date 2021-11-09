const AWS = require('aws-sdk');
const { handleFailure, handleResult, sleep } = require('../utils');
const robinhood = require('./api');
const config = require('./config');
let credentials = null;
let rh = null;

const parseEvent = (event) => {
  if(event &&
    event.Records &&
    event.Records[0] &&
    event.Records[0].Sns &&
    event.Records[0].Sns.Message) {
      try {
        const data = JSON.parse(event.Records[0].Sns.Message);
        const mfa_code = data.messageBody.match(config.MFA_TOKEN_PATTERN)[0];
        return handleResult(config.SNS_EVENT_RECEIVED, mfa_code);
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

const connect = async (mfa_code) => {
  const creds = (mfa_code) ? { mfa_code, ...credentials } : credentials;
  try {
    rh = new robinhood(creds);
    await sleep(3);
  } catch {
    
  }
}

exports.handler = async (event) => {
  const mfa_code = parseEvent(event);
  await retrieveCredentials();
  connect(mfa_code);
  
  return handleResult(config.EXECUTION_SUCCESS);
}