const { getSecretValue, parsePinpointSNSMessage } = require('../utils/aws');
const { handleFailure, handleResult } = require('../utils/helpers');
const api = require('./api');
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

exports.handler = async (event) => {
  const mfa_code = parseEvent(event);
  await retrieveCredentials();
  rh = await api.connect(credentials, mfa_code);

  return handleResult(config.EXECUTION_SUCCESS);
}