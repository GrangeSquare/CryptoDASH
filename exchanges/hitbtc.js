'use strict';

const hitbtc = require('node-hitbtc');
const BigNumber = require('bignumber.js');

const getUserBalance = async (context) => {
  if (!context.apiKey || !context.apiSecret) {
    throw new Error();
  }

  var api2 = hitbtc.privateApi('a35c3db8b8aa80844a639342560340f6', '3a9494f62f744297398ba8d189c2c716');
  // a35c3db8b8aa80844a639342560340f6
  // 3a9494f62f744297398ba8d189c2c716

  if (!api2) {
    throw new Error();
  }

  const accountBalance = await api2.getAsset();
  const nonEmptyBalances = {};

  if (!accountBalance) {
    throw new Error();
  }

  accountBalance.forEach(element => {
    const BigNum = new BigNumber(element.available);

    if (BigNum.gt(new BigNumber(0))) {
      nonEmptyBalances[element.currency] = BigNum;
    }
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
