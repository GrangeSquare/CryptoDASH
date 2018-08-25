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

  if (!privateClient) {
    throw new Error();
  }

  let nonEmptyBalances = {};

  let promise = new Promise(function (resolve, reject) {
    privateClient.getUserInfo((err, data2) => {
      if (err) {
        return reject(err);
      } else {
        Object.keys(data2.info.funds.free).forEach(element => {
          const BigNum = new BigNumber(data2.info.funds.free[element]);

          if (BigNum.gt(new BigNumber(0))) {
            nonEmptyBalances[element] = BigNum;
          }
        });
        resolve();
      }
    });
  });
  await promise;

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
