'use strict';

const Binance = require('binance-api-node').default;
const BigNumber = require('bignumber.js');

const getUserBalance = async (context) => {
  if (!context.apiKey || !context.apiSecret) {
    throw new Error();
  }

  const client = Binance({ // todo: check contructor
    apiKey: context.apiKey, // 'Wk3N8MFVLdiFNaLzFWWcSdIroYSjvuZURpV7h2VTftNVcDb1obkwsPPr9rEH81oo',
    apiSecret: context.apiSecret // 'tjsm7JpRpzFp0J1OT3au5UxB7JnRQ5n3IjFrKrfFvpvsJqAwK5qh7SrgU3oWvn68'
  });

  if (!client) {
    throw new Error();
  }

  const accountBalance = await client.accountInfo();
  let nonEmptyBalances = {};

  if (!accountBalance) {
    throw new Error();
  }

  accountBalance.balances.forEach((balance) => {
    const BigNum = new BigNumber(balance.free);

    if (BigNum.gt(new BigNumber(0))) {
      nonEmptyBalances[balance.asset] = BigNum;
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
