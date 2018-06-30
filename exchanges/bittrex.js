const BigNumber = require('bignumber.js');

const getUserBalance = async (context) => {
  return {};
};

const getUserBalanceDummy = async (context) => {
  return {
    'BTC': new BigNumber('1.234')
  };
};

module.exports = {
  getUserBalance: getUserBalance,
  getUserBalanceDummy
};
