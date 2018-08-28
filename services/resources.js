'use strict';

const db = require('../models');

module.exports = {
  getTickers
};

async function getTickers (pagination) {
  const data = await db.NewestTicker.findAndCountAll({
    limit: pagination.limit,
    offset: pagination.offset
  });
  return data;
}
