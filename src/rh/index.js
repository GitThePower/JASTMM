const AWS = require('aws-sdk');
let credentials = null;

exports.handler = async (event) => {
  console.log('func=rhLambda,msg=starting exection');
  const SM = new AWS.SecretsManager();
  if (!credentials) {
    try {
      const secretPromise = await SM.getSecretValue({ SecretId: process.env.RH_CREDENTIALS_ARN }).promise();
      credentials = JSON.parse(secretPromise.SecretString);
    } catch {
      const errorMsg = 'unable to get secret value'
      console.error(`func=rhLambda,msg=${errorMsg}`);
      throw new Error(errorMsg);
    }
  }
  
  console.log('func=rhLambda,msg=success');
}