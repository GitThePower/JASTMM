const robinhood = require('../../../src/rh/api');
const { config } = require('../../../local-config');

const sleep = (seconds) => new Promise(resolve => setTimeout(resolve, seconds * 1000))

// Only used for integration testing
test.skip('Testing the Un-Mocked Robinhood Api', async () => {
    try {
        new robinhood({
            username: config.rhUsername,
            password: config.rhPassword,
            // mfa_code: '123456'
        });
        await sleep(3);
    } catch (e) {
        console.error(JSON.stringify(e));
    }
});