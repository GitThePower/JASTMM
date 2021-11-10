const RH = require('ar-eych');
const { getSecretValue, parsePinpointSNSMessage } = require('../utils/aws');
const { handleFailure, handleResult, sleep } = require('../utils/helpers');
const config = require('./config');
let credentials = null;
let rh = null;

const parseEvent = (event) => {
  if (event && !event.Records) return handleResult(config.SCHEDULED_EXECUTION);

  try {
    return handleResult(config.SNS_EVENT_RECEIVED, parsePinpointSNSMessage(event, config.MFA_TOKEN_PATTERN));
  } catch {
    throw handleFailure(config.INVALID_SNS_MESSAGE);
  }
}

const retrieveCredentials = async () => {
  if (!credentials) {
    try {
      credentials = await getSecretValue(process.env.RH_CREDENTIALS_ARN);
      return handleResult(config.SECRET_RETRIEVED);
    } catch {
      throw handleFailure(config.SECRETS_MANANGER_ERROR);
    }
  }
}

const connect = async (mfa_code) => {
  const creds = (mfa_code) ? { mfa_code, ...credentials } : credentials;
  try {
    rh = new RH(creds);
    await sleep(3);
    return handleResult(config.RH_CONNECTION_SUCCESS);
  } catch {
    return handleResult(config.RH_CONNECTION_ERROR);
  }
}

exports.handler = async (event) => {
  const mfa_code = parseEvent(event);
  await retrieveCredentials();
  await connect(mfa_code);

  return handleResult(config.EXECUTION_SUCCESS);
}