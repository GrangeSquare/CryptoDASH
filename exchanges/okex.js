'use strict';

const OKEX = require('okex-rest');
const BigNumber = require('bignumber.js');

const getUserBalance = async (context) => {
  if (!context.apiKey || !context.apiSecret) {
    throw new Error();
  }

  const privateClient = new OKEX(context.apiKey, context.apiSecret);

  // d4f89965-1292-417a-8be8-f38c4b2a60b6
  // 358D143C7C6CA489FE376B34D030D2EE

  const nonEmptyBalances = {};

  privateClient.getUserInfo((data, data2) => {
    console.log(data2.info.funds.free); // todo: freezed
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
