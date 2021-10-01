const AWS = require('aws-sdk');
const robinhood = require('robinhood');

const logIn = (credentials) => {
    let rh = robinhood(credentials, (data) => {
        if (data && data.mfa_required) {
            let mfa_code = '';
            rh.set_mfa_code(mfa_code, () => {
                credentials.token = rh.auth_token();
            })
        }
    })

    return credentials;
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