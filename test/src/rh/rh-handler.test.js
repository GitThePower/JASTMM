const AWS = require('aws-sdk-mock');
const lambdaFunc = require('../../../src/rh/index');
const { copy, executeLambda } = require('../test-helpers');
const { EVENT_SCHEDULED, EVENT_SNS, SECRET } = require('./test-constants');

process.env.RH_CREDENTIALS_ARN = 'someArn';

afterEach(() => {
    AWS.restore();
});

/**
 * ERRORS
 */
test('lambda should throw error for malformed sns event', async () => {
    const sns_event_malformed = copy(EVENT_SNS);
    AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
        cb(null, SECRET)
    });

    sns_event_malformed.Records[0].Sns.Message = 'some string message';
    try {await executeLambda(lambdaFunc, sns_event_malformed);}
    catch (e) {expect(e.errorMessage).toEqual('invalid sns event');}

    sns_event_malformed.Records[0].Sns.Message = '{"messageBody": "some non-numerical message"}';
    try {await executeLambda(lambdaFunc, sns_event_malformed);}
    catch (e) {expect(e.errorMessage).toEqual('invalid sns event');}

    sns_event_malformed.Records[0].Sns.Message = '{"messageBody": "12345"}';
    try {executeLambda(lambdaFunc, sns_event_malformed);}
    catch (e) {expect(e.errorMessage).toEqual('invalid sns event');}

    sns_event_malformed.Records[0].Sns.Message = '{"messageBody": "1234567"}';
    try {await executeLambda(lambdaFunc, sns_event_malformed);}
    catch (e) {expect(e.errorMessage).toEqual('invalid sns event');}
});

test('lambda should throw error when unable to get secret', async () => {
    AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
        cb('Secret Unvailable.', null)
    });

    try {
        await executeLambda(lambdaFunc, EVENT_SCHEDULED);
    } catch (e) {
        console.log('ERROR', JSON.stringify(e));
        expect(e.errorMessage).toEqual('unable to get secret value');
    }
});

/**
 * SUCCESSES
 */
test('lambda return should not be defined', async () => {
    AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
        cb(null, SECRET)
    });

    const result = await executeLambda(lambdaFunc, EVENT_SCHEDULED);
    expect(result).toBeUndefined();
});

test('lambda should succeed for sns event', async () => {
    AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
        cb(null, SECRET)
    });

    await executeLambda(lambdaFunc, EVENT_SNS);
});

test('lambda should cache credentials from secrets manager', async () => {
    AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
        cb(null, SECRET)
    });

    await executeLambda(lambdaFunc, EVENT_SCHEDULED);
    AWS.restore();
    await executeLambda(lambdaFunc, EVENT_SCHEDULED);
});