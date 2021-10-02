const AWS = require('aws-sdk');
const robinhood = require('robinhood');

const logIn = async (credentials) => {
    let rh = robinhood(credentials, async (data) => {
        if (data && data.mfa_required) {
            let mfa_code = '';
            await rh.set_mfa_code(mfa_code, () => {
                credentials.token = rh.auth_token();
            })
            return credentials;
        } else {
            return credentials;
        }
    });
};

const getCryptoData = (credentials, ticker) => {
    let rh = robinhood(credentials, () => {
        rh.get_crypto(ticker, (err, res, body) => {
            console.log(body);
        });
    })
};

module.exports = {
    logIn,
    getCryptoData
}