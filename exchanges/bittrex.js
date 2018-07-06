const BigNumber = require('bignumber.js');
const Bittrex = require('bittrex-api-node');

const getUserBalance = async (context) => {
  if (!context.apiKey || !context.apiSecret) {
    throw new Error();
  }

  const client = Bittrex({
    publicKey: context.apiKey, // d84410ba29114b9281141c1457331702
    secretKey: context.apiSecret // 384ecd4e2af948b6a6f66c788c9890f8
  });

  const nonEmptyBalances = {};

  await client.getBalances().then((response) => {
    response.result.forEach(element => {
      const BigNum = new BigNumber(element.Balance.Balance);

      if (BigNum.gt(new BigNumber(0))) {
        nonEmptyBalances[element.Currency.Currency] = BigNum;
      }
    });
  }).catch(console.error);

  return nonEmptyBalances;
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
