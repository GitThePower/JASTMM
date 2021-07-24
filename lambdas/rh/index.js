const rh = require('robinhood');
const { config } = require('../../local-config');

let authToken = null;
const credentials = {
    username: config.rhUsername,
    password: config.rhPassword
};

exports.handler = async () => {
    if (authToken) {
        credentials.token = authToken;
        delete credentials.username;
        delete credentials.password;
    }

    let Robinhood = rh(credentials, (data) => {
        if (data && data.mfa_required) {
            let mfa_code = '';
            Robinhood.set_mfa_code(mfa_code, () => {
                console.log(Robinhood.auth_token());
            })
        } else {
            Robinhood.get_crypto('BTC', (err, res, body) => {
                console.log(body);
            });
        }
    })

    return {
        message: 'Success'
    };
}