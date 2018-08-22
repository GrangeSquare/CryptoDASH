'use strict';

const Liqui = require('oaex-liqui');
const BigNumber = require('bignumber.js');

const getUserBalance = async (context) => {
  if (!context.apiKey || !context.apiSecret) {
    throw new Error();
  }

  const liqui = new Liqui({
    key: context.apiKey,
    secret: context.apiSecret
  });

  // R88F8Y22-PIZ3MHDM-76OA34NL-CDLUV2J7-UT7IFJ41
  // 5d9952d7170b47379e238089415675dd4dc906f3bcae075cf0e11b0999e2dc2e

  const nonEmptyBalances = {};

  const accountInfo = await liqui.getInfo();
  console.log(accountInfo);

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
