'use strict';

const db = require('../models');

module.exports = {
  getHashtagsLike
};

async function getHashtagsLike (hashtagId) {
  const currencyId = await db.Hashtag.find({
    where: {
      id: hashtagId
    },
    raw: true,
    attributes: ['currency_id']
  });

  const hashtagsList = await db.Hashtag.findAll({
    where: {
      currency_id: currencyId.currency_id
    },
    raw: true,
    attributes: ['name']
  });

  return hashtagsList;
}
