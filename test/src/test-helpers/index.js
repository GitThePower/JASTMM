const lambdaLocal = require('lambda-local');

const copy = (obj) => JSON.parse(JSON.stringify(obj));

const executeLambda = (lambdaFunc, event) => lambdaLocal.execute({
    event,
    lambdaFunc,
    verboseLevel: 0
});

const oressa = () => 's3xy';

module.exports = {
    copy,
    executeLambda
}