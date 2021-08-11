const rh = require('robinhood');

let authToken = null;
const credentials = {
    username: process.env.RH_USERNAME,
    password: process.env.RH_PASSWORD
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