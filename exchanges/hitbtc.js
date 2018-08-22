'use strict';

const HitBTC = require('hitbtc-js');
const BigNumber = require('bignumber.js');

const getUserBalance = async (context) => {
  if (!context.apiKey || !context.apiSecret) {
    throw new Error();
  }

  var client = new HitBTC(context.apiKey, context.apiSecret, 'live');

  // a35c3db8b8aa80844a639342560340f6
  // 3a9494f62f744297398ba8d189c2c716

  const nonEmptyBalances = {};

  client.paymentBalance((err, data) => {
    if (err) {
      console.log(err);
    }
    console.log(data);
  });

  return nonEmptyBalances;
};

const getUserBalanceDummy = async (context) => {
  return {
    'BTC': new BigNumber('2.234')
  };
};

module.exports = {
  getUserBalance: getUserBalance,
  getUserBalanceDummy
};
