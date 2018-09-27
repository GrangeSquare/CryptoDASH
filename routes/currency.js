'use strict';

const currencyService = require('../services/currency/index.js');
const utils = require('../utils/utils');

module.exports = {
  getCurrencyTape
};

async function getCurrencyTape (req, res, next) {
  try {
    const pricesInfirstPeriod = await currencyService.getPricesCurrenciesByDay(req.params.day);
    const pricesInsecondPeriod = await currencyService.getPricesCurrenciesByDay(req.params.day * 2, req.params.day);
    const currencyPercentageChange = utils.calculatePercentage(pricesInfirstPeriod, pricesInsecondPeriod);

    res.send(currencyPercentageChange).end();
  } catch (err) {
    next(err);
  }
}
