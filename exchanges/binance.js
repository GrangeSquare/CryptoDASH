'use strict';

const Binance = require('binance-api-node').default;
const BigNumber = require('bignumber.js');

const getUserBalance = async (context) => {
  if (!context.apiKey || !context.apiSecret) {
    throw new Error();
  }

  const client = Binance({ // todo: check contructor
    apiKey: context.apiKey, // 'VITNQxnBW5hY1s6iC4XFT693BeN4SXpbCUMMYmgI7nXusywW02qUlDb6fMkdc0g8',
    apiSecret: context.apiSecret // 'fshnXgWD8v52vL5EP3W8cvPSiLm0rzB5ZwjiqMhv6w652DvQPoPejZK3bKHAbQCI'
  });

  const nonEmptyBalances = {};

  const accountBalance = await client.accountInfo();
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
