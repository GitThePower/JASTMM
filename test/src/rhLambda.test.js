const AWS = require('aws-sdk-mock');
const lambdaLocal = require('lambda-local');
const lambdaFunc = require('../../src/rh/index');

process.env.RH_CREDENTIALS_ARN = 'someArn';
testSecret = {

}

afterEach(() => {
    AWS.restore();
})

test('lambda should successfully get credentials from secrets manager', async () => {
    AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
        cb(null, testSecret)
    });

    const response = await lambdaLocal.execute({
        event: {},
        lambdaFunc
    });
    
    expect(response).toEqual(testSecret);
});
