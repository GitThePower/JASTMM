const handleFailure = (msg) => {
  console.error(msg);
  return new Error(msg);
}

const handleResult = (msg, res) => {
  console.log(msg);
  return res;
}

const sleep = (seconds) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

module.exports = {
  handleFailure,
  handleResult,
  sleep
}