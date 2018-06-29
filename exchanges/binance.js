const db = require('../models');
const Binance = require('node-binance-api');

const getExchange = (apiKey, apiSecret) => {
  const binanceInit = {
    APIKEY: 'VITNQxnBW5hY1s6iC4XFT693BeN4SXpbCUMMYmgI7nXusywW02qUlDb6fMkdc0g8',
    APISECRET: 'fshnXgWD8v52vL5EP3W8cvPSiLm0rzB5ZwjiqMhv6w652DvQPoPejZK3bKHAbQCI',
    useServerTime: true,
    test: true
  };

  return new Binance().options(binanceInit);
};

const getUserBalance = async (context) => {
  if (!context.apiKey || !context.apiSecret) {
    throw new Error();
  }

  const binance = getExchange(context.apiKey, context.apiSecret);

  binance.account((error, account) => {
    try {
      if (error) {
        console.log(error);
      }
      account.balances.forEach(async element => {
        const obj = {
          symbol: element.asset
        };

        await db.Currency.create(obj);
      });
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = {
  getUserBalance
};
