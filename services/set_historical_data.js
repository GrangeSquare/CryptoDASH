const axios = require('axios');
const coins = require('./coins').coinsArr;
const db = require('../models');
const BigNumber = require('bignumber.js');
const currency = require('../utils/currency_list');
const { formatDate } = require('../utils/date_format');

const years = [
  '2016-01-01',
  '2017-01-01',
  '2018-01-01',
  formatDate()
];
// yy:mm:dd

const type = {
  price: {
    columnName: 'price',
    urlName: 'price'
  },
  marketCap: {
    columnName: 'market_cap',
    urlName: 'marketCap'
  },
  tradeVolume: {
    columnName: 'trade_volume_usd',
    urlName: 'tradeVolume'
  }
};

const mapper = {
  price: calculateAndInsertPrice,
  marketCap: insertMarketCap,
  tradeVolume: insertDailyVolume

};
/* var j = 0;
var matched = 0;
const objects = {};

for (let i in coins) {
  const symbol = coins[i].symbol;
  if (currency[symbol]) {
    // console.log(symbol);
    matched++;

    if (objects[symbol]) objects[symbol]++;
    else objects[symbol] = 1;
  }
  j++;
}

var br = 0;
for (let i in objects) {
  if (objects[i] > 1) {
    console.log('duplikati', i, objects[i]);
  }
  br++;
}
console.log(br);
console.log(matched);

process.exit();
console.log('cryptocurrency chart: ', j);
j = 0;
for (let i in currency) {
  j++;
}

console.log('coinmarketcap: ', j);
process.exit(); */

const dailyPriceETH = {}; // daily prices for ETH in USD
const dailyPriceBTC = {}; // daily prices for BTC in USD

let alreadyCollected = {};

async function initDailyPriceVals (coinId, objectToFill) {
  await getCoinsHistoricData({'id': 364, 'name': 'Ethereum', 'symbol': 'ETH', 'code': 'ETH'}, true);
  await getCoinsHistoricData({'id': 363, 'name': 'Bitcoin', 'symbol': 'BTC', 'code': 'BTC'}, true);
  alreadyCollected = {};
}

let coinsInserted = 0;
let sumOfCoinValuesInDays = 0;
let requestsMade = 0;

async function getCoinsHistoricData (coin, initPhase = false) {
  if (currency[coin.symbol] && !alreadyCollected[coin.symbol]) {
    alreadyCollected[coin.symbol] = true;

    let coinData = {};

    for (let j = 1; j < years.length; j++) {
      for (let valueType in type) {
        try {
          const url = 'https://www.cryptocurrencychart.com/api/coin/history/' + coin.id + '/' + years[j - 1] + '/' + years[j] + '/' + type[valueType].urlName + '/USD';

          const response = await axios.get(url, {
            headers: {
              Key: '777dd072501580a53436a8a550e21cc2',
              Secret: 'f05ea4394eaef7d1a456f426e79c47e0'
            }
          });

          requestsMade++;

          const data = response.data.data;
          // console.log(data);
          /// process.exit();
          for (let valuePerDay in data) {
            const value = data[valuePerDay][type[valueType].urlName];
            const date = data[valuePerDay].date;

            if (!value || !date) continue;

            if (valueType === 'price' && (coin.symbol === 'ETH' || coin.symbol === 'BTC')) {
              save(value, date, coin.symbol);
            }

            if (!initPhase) {
              if (!coinData[date]) {
                coinData[date] = {};
              }

              await mapper[valueType](coinData, value, date, coin.symbol);
            }
          }
        } catch (err) {
          console.log(err);
          process.exit();
        }
      }
    }
    coinsInserted++;
    if (!initPhase) {
      await db.CoinData.bulkCreate(Object.values(coinData));
    }

    console.log('\n');
    console.log(`${coin.symbol} is inserted.`);
    console.log(`There is ${coinsInserted} coins so far.`);
    console.log(`Total requests made to API is ${requestsMade} so far.`);
    console.log('\n');
  } else {
    console.log(`${coin.symbol} is duplicate or doesnt exist in coinmarketcap.`);
  }
}

async function startCrawl () {
  coinsInserted = 0;
  sumOfCoinValuesInDays = 0;

  for (let index in coins) {
    await getCoinsHistoricData(coins[index]);
  }

  console.log(`The average number of values of inserted coins is ${sumOfCoinValuesInDays / coinsInserted}`);
}

initDailyPriceVals().then(() => {
  console.log('init finished');

  startCrawl();
});

async function calculateAndInsertPrice (coinData, coinValueInUSD, date, coinSymbol) {
  const BTCValueOnDate = dailyPriceBTC[date];
  const ETHValueOnDate = dailyPriceETH[date];
  if (!BTCValueOnDate || !ETHValueOnDate) {
    console.log("BTCValueOnDate || ETHValueOnDate MISSING!!!!");
    return;
  }
  coinValueInUSD = new BigNumber(coinValueInUSD);

  const coinValueInETH = coinValueInUSD.dividedBy(ETHValueOnDate);
  const coinValueInBTC = coinValueInUSD.dividedBy(BTCValueOnDate);

  if (!currency[coinSymbol]) {
    console.log(coinSymbol);
    throw new Error();
  }

  coinData[date].price_usd = coinValueInUSD;
  coinData[date].price_eth = coinValueInETH.toString();
  coinData[date].price_btc = coinValueInBTC.toString();
  coinData[date].currency_id = currency[coinSymbol];
  coinData[date].date = date;
}

async function insertMarketCap (coinData, marketCap, date, coinSymbol) {
  coinData[date].market_cap = marketCap;
  coinData[date].currency_id = currency[coinSymbol];
  coinData[date].date = date;
}

async function insertDailyVolume (coinData, dailyVolumeUSD, date, coinSymbol) {
  coinData[date].daily_volume = dailyVolumeUSD;
  coinData[date].currency_id = currency[coinSymbol];
  coinData[date].date = date;
}

function save (value, date, coinSymbol) {
  if (coinSymbol === 'ETH') {
    dailyPriceETH[date] = new BigNumber(value);
  } else if (coinSymbol === 'BTC') {
    dailyPriceBTC[date] = new BigNumber(value);
  } else {
    throw new Error();
  }
}
// 'https://www.cryptocurrencychart.com/api/coin/history/363/2016-01-01/2017-01-01/marketCap/USD'
module.exports = startCrawl;
