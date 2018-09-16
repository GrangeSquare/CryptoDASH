'use strict';

const axios = require('axios').create({
  timeout: 3000
});

const { constants } = require('../config');
const currency = require('../utils/currency_union')();
const BigNumber = require('bignumber.js');
const { formatDate } = require('../utils/date_format');
const db = require('../models');

const coinObj = {};
const dateToCheckNewDay = new Date();
const cooldown = 2000;

async function getAPIData (start) {
  const coinsData = await axios.get(constants.coinMarketCapUrl + '?start=' + start);

  return coinsData.data.data;
}

const amountPerCall = 100;

async function getAPICount () {
  const resp = await axios.get('https://api.coinmarketcap.com/v2/listings/');
  return resp.data.metadata.num_cryptocurrencies;
}

async function main (start = 1, coinAPICount, coins, baseValues) {
  try {
    console.log(start, coinAPICount, baseValues);

    if (start > coinAPICount) {
      reCall();
      return;
    }

    coins = await getAPIData(start);

    for (let i in coins) {
      if (!currency[coins[i].symbol]) {
        continue;
      }

      const coinId = currency[coins[i].symbol].id;
      const calculatedCoin = calculateCoin(coins[i], baseValues, coinId);

      if (!calculatedCoin) {
        console.log('Coin value is null');
        continue;
      }

      coinObj[coinId] = calculatedCoin;
    }

    const coinToArray = Object.values(coinObj);

    await Promise.all([
      saveToDatabase(coinToArray),
      saveToNewestTicker(coinToArray)
    ]);

    start += amountPerCall;

    callAfterCooldown(main, cooldown, start, coinAPICount, coins, baseValues);
  } catch (err) {
    console.log(err);
    callAfterCooldown(main, cooldown, start, coinAPICount, coins, baseValues);
  }
}

function callAfterCooldown (func, cooldownMS) {
  const args = Object.values(arguments);

  setTimeout(function () {
    args.splice(0, 2);

    func(...args);
  }, cooldownMS);
}

async function saveToDatabase (coinArr) {
  await db.CoinTicker.bulkCreate(coinArr);
}

async function saveToNewestTicker (coinArr) {
  await db.NewestTicker.bulkCreate(coinArr, {
    updateOnDuplicate: true
  });
}

function calculateBaseCoins (coins) {
  const idEth = currency['ETH'].id;
  const idBtc = currency['BTC'].id;

  const ethPrice = coins[idEth].quotes.USD.price;
  const btcPrice = coins[idBtc].quotes.USD.price;

  return {
    'ETH': ethPrice,
    'BTC': btcPrice
  };
}

function calculateCoin (coinData, baseCoinData, coinId) {
  const neededCoinData = coinData.quotes.USD;

  if (!neededCoinData.price) {
    return null;
  }

  const coinPriceUSD = new BigNumber(neededCoinData.price);
  const priceInEth = coinPriceUSD.dividedBy(baseCoinData['ETH']);
  const priceInBtc = coinPriceUSD.dividedBy(baseCoinData['BTC']);

  return {
    date: formatDate(),
    currency_id: coinId,
    daily_volume: neededCoinData.volume_24h,
    market_cap: neededCoinData.market_cap,
    price_btc: priceInBtc.toString(),
    price_eth: priceInEth.toString(),
    price_usd: coinPriceUSD.toString(),
    change_24h: coinData.quotes.USD.percent_change_24h
  };
}

async function reCall () {
  try {
    const coinAPICount = await getAPICount();

    let coins = await getAPIData(1);
    const baseValues = calculateBaseCoins(coins);

    setTimeout(function () {
      main(undefined, coinAPICount, coins, baseValues);
    }, constants.coinCapTTL);
  } catch (err) {
    console.log(err);
    setTimeout(reCall, constants.coinCapTTL);
  }
}

reCall();
