const axios = require('axios');
const coins = require('../utils/coins').coinsArr;
const db = require('../models');
const BigNumber = require('bignumber.js');
const currency = require('../utils/currency_list');
const { formatDate } = require('../utils/date_format');
const config = require('../config');
const { timeIntervalMS } = config.constants;
let ENVIRONMENT = 'INIT';

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

function fillCoinGaps (coinData, symbol, startStr) {
  const startDate = new Date(startStr);
  const endDate = new Date(years[years.length - 1]);
  console.log(years[years.length - 1]);
  console.log(startStr);
  const filledData = {};
  let yesterdayValue = null;

  while (startDate <= endDate) {
    const dateStr = formatDate(startDate);

    if (!coinData[dateStr] && yesterdayValue) {
      filledData[dateStr] = yesterdayValue;
    } else if (!coinData[dateStr] && !yesterdayValue) {
      filledData[dateStr] = {
        price_usd: '0',
        price_eth: '0',
        price_btc: '0',
        currency_id: currency[symbol],
        date: dateStr,
        market_cap: '0',
        daily_volume: '0'
      };
    }

    if (coinData[dateStr]) {
      filledData[dateStr] = coinData[dateStr];
      yesterdayValue = coinData[dateStr];
    }

    startDate.setDate(startDate.getDate() + 1);
  }
  // console.log(filledData); process.exit();
  return filledData;
}

async function calculateAndInsertPrice (coinData, coinValueInUSD, date, coinSymbol) {
  const BTCValueOnDate = dailyPriceBTC[date];
  const ETHValueOnDate = dailyPriceETH[date];
  if (!BTCValueOnDate || !ETHValueOnDate) {
    console.log('BTCValueOnDate || ETHValueOnDate MISSING!!!!');
    return;
  }
  coinValueInUSD = new BigNumber(coinValueInUSD);

  const coinValueInETH = coinValueInUSD.dividedBy(ETHValueOnDate);
  const coinValueInBTC = coinValueInUSD.dividedBy(BTCValueOnDate);

  if (!currency[coinSymbol]) {
    console.log(coinSymbol);
    throw new Error();
  }

  if (!coinData[date]) {
    coinData[date] = {};
  }

  coinData[date].price_usd = coinValueInUSD;
  coinData[date].price_eth = coinValueInETH.toString();
  coinData[date].price_btc = coinValueInBTC.toString();
  coinData[date].currency_id = currency[coinSymbol];
  coinData[date].date = date;
}

async function insertMarketCap (coinData, marketCap, date, coinSymbol) {
  if (!coinData[date]) {
    coinData[date] = {};
  }

  coinData[date].market_cap = marketCap;
  coinData[date].currency_id = currency[coinSymbol];
  coinData[date].date = date;
}

async function insertDailyVolume (coinData, dailyVolumeUSD, date, coinSymbol) {
  if (!coinData[date]) {
    coinData[date] = {};
  }

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

async function startCrawling () {
  await mainInit();

  ENVIRONMENT = 'START';

  await main();

  db.sequelize.close();
}

let totalCount = 0;

async function mainInit () {
  const intervalEachCoin = {
    'ETH': '2016-01-01',
    'BTC': '2016-01-01'
  };

  for (let i in intervalEachCoin) {
    intervalEachCoin[i] = splitToIntervals(intervalEachCoin[i], formatDate(), timeIntervalMS);
  }

  console.log('All coins have successfully loaded.');

  const currencyChartData = [{'id': 363, 'name': 'Bitcoin', 'symbol': 'BTC', 'code': 'BTC'}, {'id': 364, 'name': 'Ethereum', 'symbol': 'ETH', 'code': 'ETH'}];

  for (let i in currencyChartData) {
    const intervalForCoin = intervalEachCoin[coins[i].symbol];
    const coin = await getCoinFromAPI(coins[i], intervalForCoin);
    const calculatedCoinData = {};
    calculateValues(coin['price'], coins[i].symbol, 'price', calculatedCoinData);
  }
}

async function main (marketCapData = currency, currencyChartData = coins) {
  const intervalEachCoin = await getInterval(marketCapData);
  for (let i in intervalEachCoin) {
    intervalEachCoin[i] = splitToIntervals(intervalEachCoin[i], formatDate(), timeIntervalMS);
  }

  // console.log(intervalEachCoin);process.exit();
  console.log('All coins have successfully loaded.');

  for (let i in currencyChartData) {
    if (!marketCapData[currencyChartData[i].symbol]) {
      console.log(`\nCoin: ${currencyChartData[i].symbol} doesnt exist in market cap api\n`);
      continue;
    }

    if (alreadyCollected[currencyChartData[i].symbol]) {
      console.log(`\nAlready collected coin: ${currencyChartData[i].symbol}\n`);
      continue;
    }

    const intervalForCoin = intervalEachCoin[coins[i].symbol];
    const coin = await getCoinFromAPI(coins[i], intervalForCoin);

    const calculatedCoinData = {};

    for (let valueType in coin) {
      calculateValues(coin[valueType], coins[i].symbol, valueType, calculatedCoinData);
    }

    const filledCoinData = fillCoinGaps(calculatedCoinData, coins[i].symbol, intervalEachCoin[currencyChartData[i].symbol][0]);

    const coinArr = Object.values(filledCoinData);

    if (ENVIRONMENT !== 'INIT') {
      await db.CoinData.bulkCreate(coinArr);
      alreadyCollected[currencyChartData[i].symbol] = 1;

      console.log(`${coins[i].symbol} has successfully inserted, total days: ${coinArr.length}, count: ${++totalCount}, requests made: ${requestsMade}`);
    }
  }
}

async function getCoinFromAPI (coin, timeInterval) {
  const apiCoinData = {};

  for (let j = 1; j < timeInterval.length; j++) {
    for (let valueType in type) {
      try {
        const coinData = await getCoin(coin, timeInterval[j - 1], timeInterval[j], valueType);

        if (!apiCoinData[valueType]) {
          apiCoinData[valueType] = {};
        }

        for (let i in coinData) {
          apiCoinData[valueType][coinData[i].date] = coinData[i];
        }
      } catch (err) {
        console.log(err);
        process.exit();
      }
    }
  }

  return apiCoinData;
}

async function calculateValues (coinData, symbol, valueType, formattedData) {
  for (let valuePerDay in coinData) {
    const value = coinData[valuePerDay][type[valueType].urlName];
    const date = coinData[valuePerDay].date;

    if (ENVIRONMENT === 'INIT' && valueType === 'price' && (symbol === 'ETH' || symbol === 'BTC')) {
      save(value, date, symbol);
    }

    if (ENVIRONMENT !== 'INIT') {
      mapper[valueType](formattedData, value, date, symbol);
    }
  }
}

async function getCoin (coin, fromYear, toYear, valueType) {
  const url = 'https://www.cryptocurrencychart.com/api/coin/history/' + coin.id + '/' + fromYear + '/' + toYear + '/' + type[valueType].urlName + '/USD';

  const response = await axios.get(url, {
    headers: {
      Key: '777dd072501580a53436a8a550e21cc2',
      Secret: 'f05ea4394eaef7d1a456f426e79c47e0'
    }
  });

  requestsMade++;

  const data = response.data.data;
  return data;
}

async function getInterval (currencyList) {
  const intervalEachCoin = {};
  let coinsProcessed = 0;

  for (const i in currencyList) {
    const Currency = await getCurrency(currencyList[i]);

    console.log(`${++coinsProcessed} coins are processed`);

    if (!Currency) {
      intervalEachCoin[i] = '2016-01-01';
      continue;
    }

    intervalEachCoin[i] = formatDate(Currency.get('date'));
  }

  return intervalEachCoin;
}

async function getCurrency (currencyId) {
  const Coin = db.CoinData.findOne({
    where: {
      currency_id: currencyId
    },
    order: [['date', 'DESC']],
    limit: 1
  });

  return Coin;
}

function splitToIntervals (startDate, endDate, timeIntervalMS) {
  const startDateInMS = new Date(startDate).getTime();
  const endDateInMS = new Date(endDate).getTime();

  const diff = endDateInMS - startDateInMS;
  let counter = 0;
  const splittedIntervalArr = [];

  while (counter < diff) {
    splittedIntervalArr.push(formatDate(startDateInMS + counter));
    counter += timeIntervalMS;
  }

  splittedIntervalArr.push(formatDate());

  return splittedIntervalArr;
}

startCrawling();
