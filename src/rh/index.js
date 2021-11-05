const AWS = require('aws-sdk');
let credentials = null;

const parseEvent = (event) => {
  if(event &&
    event.Records &&
    event.Records[0] &&
    event.Records[0].Sns &&
    event.Records[0].Sns.Message) {
      try {
        const data = JSON.parse(event.Records[0].Sns.Message);
        console.log(`func=rhLambda,msg=sns event received`);
        return data.messageBody;
      } catch {
        const errorMsg = `invalid sns event`
        console.error(`func=rhLambda,msg=${errorMsg}`);
        throw new Error(errorMsg);
      }
  } else {
    console.log(`func=rhLambda,msg=scheduled execution`);
  }
}

exports.handler = async (event) => {
  parseEvent(event);

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