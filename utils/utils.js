const axios = require('axios');
const crypto = require('crypto');
const percentDiff = require('percentage-difference');

const getSubset = (keys, obj) => keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {});
const invert = (data) => Object.entries(data).reduce((obj, [key, value]) => ({ ...obj, [value]: key }), {});

async function coinList () {
  let response = await axios.get('https://api.coinmarketcap.com/v2/listings/');
  const data = response.data.data;

  const coinListStructure = {};
  for (let i in data) {
    coinListStructure[data[i].symbol] = data[i].id;
  }
  return coinListStructure;
}

function getPasswordChangeSecret () {
  return getRandomString(64);
}

function getTotpChangeSecret () {
  return getRandomString(64);
}

function getRandomString (length) {
  return crypto.randomBytes(length).toString('hex');
}

function calculatePercentage (numberOne, numberTwo) {
  return percentDiff(numberOne, numberTwo);
}

module.exports = {
  coinList,
  getPasswordChangeSecret,
  getSubset,
  invert,
  getTotpChangeSecret,
  calculatePercentage
};
