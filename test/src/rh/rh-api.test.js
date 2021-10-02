const AWS = require('aws-sdk-mock');
const { logIn } = require('../../../src/rh/api');
const { config } = require('../../../local-config');

const credentials = {
    username: config.rhUsername,
    password: config.rhPassword
};

afterEach(() => {
    AWS.restore();
});

test('login should return a valid auth token to access the robinhood api', async () => {
    const result = await logIn(credentials);

    console.log(result);
});