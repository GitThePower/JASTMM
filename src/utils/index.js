const handleFailure = (msg) => {
  console.error(`func=${config.FUNCTION_NAME},msg=${msg}`);
  return new Error(msg);
}

const handleResult = (msg, res) => {
  console.log(`func=${config.FUNCTION_NAME},msg=${msg}`);
  return res;
}

const sleep = (seconds) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

module.exports = {
  handleFailure,
  handleResult,
  sleep
}