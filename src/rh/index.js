const AWS = require('aws-sdk');
let credentials = null;

const tryParseSNSEvent = (event) => {
  if(event &&
    event.Records &&
    event.Records[0] &&
    event.Records[0].Sns &&
    event.Records[0].Sns.Message) {
      try {
        const data = JSON.parse(event.Records[0].Sns.Message);
        return data.messageBody;
      } catch {
        console.error(`func=rhLambda,msg=invalid sns event`);
      }
  }

  return null;
}

exports.handler = async (event) => {
  const eventMessage = tryParseSNSEvent(event);
  const startMsg = (eventMessage) ? 'sns event received' : 'scheduled execution';
  console.log(`func=rhLambda,msg=${startMsg}`);

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