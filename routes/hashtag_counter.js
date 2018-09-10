'use strict';

const hashtagCounter = require('../services/hashtag_counter');

module.exports = {
  getStatusByDay,
  getCountByDay
};

async function getStatusByDay (req, res, next) {
  const status = await hashtagCounter.getStatusByDay(req.params.day);
  res.send(status).end();
}

async function getCountByDay (req, res, next) {
  const numberOfHashtags = await hashtagCounter.getCountByDay(req.params.day);
  res.send(numberOfHashtags).end();
}
