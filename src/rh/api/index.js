const RH = require('ar-eych');
const { handleFailure, handleResult, sleep } = require('../../utils/helpers');
const config = require('../config');

const connect = async (credentials, mfa_code) => {
  if (credentials){
    const creds = (mfa_code) ? { mfa_code, ...credentials } : credentials;
    try {
      const rh = new RH(creds);
      await sleep(3);
      return handleResult(config.RH_CONNECTION_SUCCESS, rh);
    } catch {
      return handleFailure(config.RH_CONNECTION_ERROR);
    }
  }
}

module.exports = {
  connect
}