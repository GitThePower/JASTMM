const AWS = require('aws-sdk-mock');
const lambdaFunc = require('../../../src/rh/index');
const rhApi = require('../../../src/rh/api');
const rhConfig = require('../../../src/rh/config');
const { copy, executeLambda } = require('../test-helpers');
const { EVENT_SCHEDULED, EVENT_SNS, SECRET } = require('./test-constants');

process.env.RH_CREDENTIALS_ARN = 'someArn';

afterEach(() => {
  AWS.restore();
  jest.clearAllMocks();
});

/**
 * ERRORS
 */
test('lambda should throw error for malformed sns event', async () => {
  const sns_event_malformed = copy(EVENT_SNS);
  AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
    cb(null, SECRET)
  });
  let connectSpy = jest.spyOn(rhApi, 'connect').mockImplementation(jest.fn(() => { }));

  sns_event_malformed.Records[0].Sns.Message = 'some string message';
  try { await executeLambda(lambdaFunc, sns_event_malformed); }
  catch (e) { expect(e.errorMessage).toEqual(rhConfig.INVALID_SNS_MESSAGE); }

  sns_event_malformed.Records[0].Sns.Message = '{"messageBody": "some non-numerical message"}';
  try { await executeLambda(lambdaFunc, sns_event_malformed); }
  catch (e) { expect(e.errorMessage).toEqual(rhConfig.INVALID_SNS_MESSAGE); }

  sns_event_malformed.Records[0].Sns.Message = '{"messageBody": "12345"}';
  try { await executeLambda(lambdaFunc, sns_event_malformed); }
  catch (e) { expect(e.errorMessage).toEqual(rhConfig.INVALID_SNS_MESSAGE); }

  sns_event_malformed.Records[0].Sns.Message = '{"messageBody": "1234567"}';
  try { await executeLambda(lambdaFunc, sns_event_malformed); }
  catch (e) { expect(e.errorMessage).toEqual(rhConfig.INVALID_SNS_MESSAGE); }

  expect(connectSpy).toHaveBeenCalledTimes(0);
});

test('lambda should throw error when unable to get secret', async () => {
  AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
    cb('Secret Unvailable.', null)
  });
  let connectSpy = jest.spyOn(rhApi, 'connect').mockImplementation(jest.fn(() => { }));

  try {
    await executeLambda(lambdaFunc, EVENT_SCHEDULED);
  } catch (e) {
    expect(e.errorMessage).toEqual(rhConfig.SECRETS_MANANGER_ERROR);
    expect(connectSpy).toHaveBeenCalledTimes(0);
  }
});

/**
 * SUCCESSES
 */
test('lambda return should not be defined', async () => {
  AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
    cb(null, SECRET)
  });
  let connectSpy = jest.spyOn(rhApi, 'connect').mockImplementation(jest.fn(() => { }));

  const result = await executeLambda(lambdaFunc, EVENT_SCHEDULED);
  expect(result).toBeUndefined();
  expect(connectSpy).toHaveBeenCalledTimes(1);
});

test('lambda should succeed for sns event', async () => {
  AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
    cb(null, SECRET)
  });
  let connectSpy = jest.spyOn(rhApi, 'connect').mockImplementation(jest.fn(() => { }));

  await executeLambda(lambdaFunc, EVENT_SNS);
  expect(connectSpy).toHaveBeenCalledTimes(1);
});

test('lambda should cache credentials from secrets manager', async () => {
  AWS.mock('SecretsManager', 'getSecretValue', (params, cb) => {
    cb(null, SECRET)
  });
  let connectSpy = jest.spyOn(rhApi, 'connect').mockImplementation(jest.fn(() => { }));

  await executeLambda(lambdaFunc, EVENT_SCHEDULED);
  AWS.restore();
  await executeLambda(lambdaFunc, EVENT_SCHEDULED);
  expect(connectSpy).toHaveBeenCalledTimes(2);
});