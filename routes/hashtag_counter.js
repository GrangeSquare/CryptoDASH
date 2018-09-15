'use strict';

const hashtagCounter = require('../services/hashtag_counter');
const utils = require('../utils/utils');

module.exports = {
  getStatusByDay,
  getCountByDay
};

async function getStatusByDay (req, res, next) {
  const status = await hashtagCounter.getStatusByDay(req.params.day);
  res.send(status).end();
}

async function getCountByDay (req, res, next) {
  const numberOfHashtagsFirst = await hashtagCounter.getCountByDay(req.params.day);
  const numberOfHashtagsSecond = await hashtagCounter.getCountByDay(req.params.day + req.params.day);
  const numberInPercentage = utils.calculatePercentage(numberOfHashtagsFirst, numberOfHashtagsSecond - numberOfHashtagsSecond);

  res.send(numberInPercentage).end();
}
