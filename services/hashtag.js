'use strict';

const db = require('../models');

async function getHashtagByName (name) {
  const hashtag = await db.Hashtag.findOne({
    where: {
      name: name
    }
  });
  return hashtag;
}

async function getIdByName (name) {
  const hashtagId = await db.Hashtag.findOne({
    where: {
      name: name
    },
    attributes: ['id']
  });
  return hashtagId;
}

module.exports = {
  getHashtagByName,
  getIdByName
};
