const AWS = require('aws-sdk');

class KMS {
  constructor() {
    this.kms = new AWS.KMS();
  }

  decrypt = (KeyId, CiphertextBlob) => 
    this.kms.decrypt({KeyId, CiphertextBlob}).promise()
            .then((data) =>  data.Plaintext)
            .catch(() => {
              throw new Error('An error occured while decrypting data.');
            });
}

class S3 {
  constructor() {
    this.s3 = new AWS.S3();
  }

  getObject = (Bucket, Key) => 
    this.s3.getObject({Bucket, Key}).promise()
      .then((data) => data.toString("utf-8"))
      .catch(() => {
        throw new Error('Unable to get bucket object');
      });

  decodeObject = (buffer, encoding) => JSON.parse(buffer.toString(encoding));
}

module.exports = {
  KMS,
  S3
}