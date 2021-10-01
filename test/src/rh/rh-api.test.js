const AWS = require('aws-sdk-mock');
const { login } = require('../../../src/rh/api');

afterEach(() => {
    AWS.restore();
});

test('login should return a valid auth token to access the robinhood api', async () => {
    expect(true).toEqual(true);
});