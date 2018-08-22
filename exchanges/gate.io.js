'use strict';

const GateIo = require('gate.io');
const BigNumber = require('bignumber.js');

const getUserBalance = async (context) => {
  if (!context.apiKey || !context.apiSecret) {
    throw new Error();
  }

  const gateIoClient = new GateIo(context.apiKey, context.apiSecret);

  // B6E11016-87D2-49B3-8C7C-6910419D74FD
  // 2302dc03d85de936c10ee284ee05843844d317421b161910e312a700572e04c2

  const nonEmptyBalances = {};

  gateIoClient.getBalances(function (err, res) {
    if (err) {
      // console.log(err);
      // console.log('rrrrrrrrrr');
    } else {
      console.log(res.body);
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
