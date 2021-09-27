const AWS = require('aws-sdk-mock');
const fs = require('fs');
const { KMS, S3 } = require('../../../src/utils/aws-utils');

const Bucket = 'someBucket';
const Key = 'someKey';
const test_buffer = fs.readFileSync(process.env.HOME + '\\Documents\\PProjects\\JASTMM\\test\\src\\utils\\rh_credentials.json');

afterEach(() => {
    AWS.restore();
})

test('s3 should retrieve and decode object from s3 bucket', async () => {
    AWS.mock('S3', 'getObject', Buffer.from(test_buffer));

    const s3Client = new S3();
    const data = await s3Client.getObject(Bucket, Key);
    const creds = s3Client.decodeObject(data);
    expect(creds.rhUsername).toEqual('dummyUsername');
    expect(creds.rhPassword).toEqual('dummyPassword');
});