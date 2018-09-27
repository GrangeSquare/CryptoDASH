'use strict';

const db = require('../../models');
const currencyDataMapper = require('./data_mapper');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  getPricesCurrenciesByDay
};

async function getPricesCurrenciesByDay (toDay, fromDay = 0) {
  const fromPeriod = moment().subtract(fromDay, 'day');
  const toPeriod = moment().subtract(toDay, 'day');

  const pricesCarenncies = await db.CoinData.findAll({
    row: true,
    where: {
      created_at: {
        [Op.and]: {
          $lte: fromPeriod,
          $gte: toPeriod
        }
      }
    },
    include: [{
      model: db.Currency,
      attributes: ['symbol']
    }],
    attributes: ['price_usd']
  });

  return pricesCarenncies && currencyDataMapper.mapPriceAndCurrecny(pricesCarenncies);
}
