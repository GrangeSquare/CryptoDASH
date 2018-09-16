const coinMarketList = require('./full_coin_list');
const cryptoChartList = require('./coins').coinsArr;
const currencyList = require('./currency_list');

let currencyUnion = null;
const marked = {};

function getCurrencyUnion () {
  if (!currencyUnion) {
    calculateCurrencyUnion();
  }

  return currencyUnion;
}

function calculateCurrencyUnion () {
  currencyUnion = {};

  for (let i in coinMarketList) {
    const symbol = coinMarketList[i].symbol;

    if (marked[symbol]) {
      continue;
    }

    if (currencyList[symbol]) {
      currencyUnion[symbol] = {
        id: currencyList[symbol],
        name: coinMarketList[i].name,
        symbol: symbol
      };
    } else {
      currencyUnion[symbol] = {
        id: coinMarketList[i].id,
        name: coinMarketList[i].name,
        symbol: symbol

      };
    }

    marked[symbol] = true;
  }

  for (let i in cryptoChartList) {
    const symbol = cryptoChartList[i].symbol;
    if (marked[symbol]) {
      continue;
    }

    if (currencyList[symbol]) {
      currencyUnion[symbol] = {
        id: currencyList[symbol],
        name: cryptoChartList[i].name,
        symbol: symbol
      };
    } else {
      currencyUnion[symbol] = {
        id: cryptoChartList[i].id,
        name: cryptoChartList[i].name,
        symbol: symbol

      };
    }

    marked[symbol] = true;
  }
}

module.exports = getCurrencyUnion;
