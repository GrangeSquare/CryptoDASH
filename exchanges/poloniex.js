'use strict';

const Poloniex = require('poloniex-api-node');
const BigNumber = require('bignumber.js');

const getUserBalance = async (context) => {
  if (!context.apiKey || !context.apiSecret) {
    throw new Error();
  }

  let poloniex = new Poloniex(context.apiKey, context.apiSecret, { socketTimeout: 15000 });

  // HIXFGFOT-Y6W7Z8A7-TO22J92T-XTPMU8O1
  // 2d539adfe034e3b5c991760c51d6c2c19bd42f796ce83953c37c297596a519a71485f7f3e0d58256882d2442902a71aef6b41a4709e0a1de91ddef15e903786c

  const nonEmptyBalances = {};

  poloniex.returnBalances(function (err, balances) {
    if (err) {
      console.log(err.message);
    } else {
      console.log(balances);
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
