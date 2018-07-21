'use strict';

const db = require('../../models');

async function getTags () {
  const tags = await db.PeriodRepetition.findAll({
    limit: 50
  });
  console.log(tags);
}

module.exports = {
  getTags
};
