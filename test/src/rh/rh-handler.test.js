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
    AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
        cb(null, SECRET)
    });

    const sns_event_malformed = copy(EVENT_SNS);
    sns_event_malformed.Records[0].Sns.Message = 'some string message';

    try {
        const result = await executeLambda(lambdaFunc, sns_event_malformed);
        expect(result).toBeFalsy();
    } catch (e) {
        expect(e.errorMessage).toEqual('invalid sns event');
    }
});

test('lambda should throw error when unable to get secret', async () => {
    AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
        cb('Secret Unvailable.', null)
    });

    try {
        const result = await executeLambda(lambdaFunc, EVENT_SCHEDULED);
        expect(result).toBeFalsy();
    } catch (e) {
        console.log('ERROR', JSON.stringify(e));
        expect(e.errorMessage).toEqual('unable to get secret value');
    }
});

/**
 * SUCCESSES
 */
test('lambda should succeed for scheduled event', async () => {
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

    const result = await executeLambda(lambdaFunc, EVENT_SNS);
    expect(result).toBeUndefined();
});

test('lambda should cache credentials from secrets manager', async () => {
    AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
        cb(null, SECRET)
    });

    const result1 = await executeLambda(lambdaFunc, EVENT_SCHEDULED);
    expect(result1).toBeUndefined();

    AWS.restore();

    const result2 = await executeLambda(lambdaFunc, EVENT_SCHEDULED);
    expect(result2).toBeUndefined();
});