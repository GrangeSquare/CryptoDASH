'use strict';

const Kucoin = require('kucoin-api');
const BigNumber = require('bignumber.js');

const getUserBalance = async (context) => {
  if (!context.apiKey || !context.apiSecret) {
    throw new Error();
  }

  const accountBalance = new Kucoin(context.apiKey, context.apiSecret);
  // 5b374093cbdbf73e65d3f65d
  // 58968302-6658-44a4-879a-e360b47f2187

  if (!accountBalance) {
    throw new Error();
  }

  const balance = await accountBalance.getBalance();
  let nonEmptyBalances = {};

  if (!balance) {
    throw new Error();
  }

  balance.data.forEach(element => {
    const BigNum = new BigNumber(element.balance);

    if (BigNum.gt(new BigNumber(0))) {
      nonEmptyBalances[element.coinType] = BigNum;
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
