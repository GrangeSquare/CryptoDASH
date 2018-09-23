'use strict';

const db = require('../../models');
const currencyDataMapper = require('./data_mapper');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  getPricesCurrenciesByDay
};

async function getPricesCurrenciesByDay (toDay, fromDay = 1) {
  const fromPeriod = moment().add(-(fromDay - 1), 'day');
  const toPeriod = moment().add(-toDay, 'day');

  const pricesCarenncies = await db.CoinData.findAll({
    row: true,
    where: {
      created_at: {
        [Op.and]: {
          $lte: fromPeriod,
          $gte: toPeriod
        }
      }
    }
  });

  return pricesCarenncies && currencyDataMapper.mapPriceAndCurrecny(pricesCarenncies);
}
