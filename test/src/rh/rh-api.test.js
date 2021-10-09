const robinhood = require('../../../src/rh/api');
const { config } = require('../../../local-config');

const sleep = (seconds) => new Promise(resolve => setTimeout(resolve, seconds * 1000));
const credentials = {
    username: config.rhUsername,
    password: config.rhPassword,
    // mfa_code: '123456'
};

test('first login request multi factor authentication', async () => {
    const creds = JSON.parse(JSON.stringify(credentials));

    try {
        const rh = new robinhood(creds);
        await sleep(3);
        console.log('ACCESS TOKEN: ', rh.access_token);
        console.log('ACCOUNT: ', rh.account);
    } catch (e) {
        console.error(JSON.stringify(e));
    }
});