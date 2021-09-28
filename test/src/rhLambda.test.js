const AWS = require('aws-sdk-mock');
const lambdaLocal = require('lambda-local');
const lambdaFunc = require('../../src/rh/index');

process.env.RH_CREDENTIALS_ARN = 'someArn';
const event = {};
const testSecret = {
    ARN: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:TestSecret-a1b2c3',
    CreatedDate: 1.523477145713E9,
    Name: 'TestSecret',
    SecretString: '{\n  "username":"testUsername",\n  "password":"testPassword"\n}\n',
    VersionId: 'EXAMPLE1-90ab-cdef-fedc-ba987SECRET1'
};

afterEach(() => {
    AWS.restore();
});

test('lambda should throw error when unable to get secret', async () => {
    AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
        cb('Secret Unvailable.', null)
    });

    try {
        const result = await lambdaLocal.execute({
            event,
            lambdaFunc,
            verboseLevel: 0
        });
        expect(result).toBeFalsy();
    } catch (e) {
        expect(e.errorMessage).toEqual('Unable to get Secret Value.');
    }
});

test('lambda should get and cache credentials from secrets manager', async () => {
    AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
        cb(null, testSecret)
    });

    const response1 = await lambdaLocal.execute({
        event,
        lambdaFunc,
        verboseLevel: 0
    });

    expect(response1.username).toEqual('testUsername');
    expect(response1.password).toEqual('testPassword');

    AWS.restore();

    const response2 = await lambdaLocal.execute({
        event,
        lambdaFunc,
        verboseLevel: 0
    });

    expect(response2.username).toEqual('testUsername');
    expect(response2.password).toEqual('testPassword');
});