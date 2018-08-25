'use strict';

const Cryptopia = require('cryptopia-api')();
const BigNumber = require('bignumber.js');

const getUserBalance = async (context) => {
  if (!context.apiKey || !context.apiSecret) {
    throw new Error();
  }

  Cryptopia.setOptions({
    API_KEY: context.apiKey, // 'd5ebfdcf3e534511b996ed81a573b9bd'
    API_SECRET: context.apiSecret // 'N/dpq1pQ6M4ymT4QKFkHBXEXZaBI2ydx/GtBss/Ut7g='
  });

  const nonEmptyBalances = {};

  const accountBalance = await Cryptopia.getBalance();

  if (!accountBalance) {
    throw new Error();
  }

  accountBalance.Data.forEach((balance) => {
    const BigNum = new BigNumber(balance.Total);

    if (BigNum.gt(new BigNumber(0))) {
      nonEmptyBalances[balance.Symbol] = BigNum;
    }
  });

  return nonEmptyBalances;
};

const getUserBalanceDummy = async (context) => {
  return {
    'BTC': new BigNumber('3.234')
  };
};

module.exports = {
  getUserBalance: getUserBalance,
  getUserBalanceDummy
};
