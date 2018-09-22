'use strict';

const db = require('../models');

module.exports = {
  getHashtagsLike,
  createHashtag
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

async function createHashtag (data) {
  db.Hashtag.create(data); // to do create validation
}
