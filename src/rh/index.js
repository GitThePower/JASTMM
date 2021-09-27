const { KMS, S3 } = require('../utils/aws-utils');

exports.handler = async (event) => {
  const { s3Path } = JSON.parse(event.body);

  let s3Object;
  try {
    s3Object = await S3.getObject(process.env.S3_BUCKET, s3Path);
  } catch (err) {
    console.error(JSON.stringify(err));
  }

  let creds;
  try {
    creds = await KMS.decrypt(process.env.KMS_KEY, s3Object);
  } catch (err) {
    console.error(JSON.stringify(err));
  }

  return {
    message: `Credentials: ${JSON.stringify(creds)}`
  };
}