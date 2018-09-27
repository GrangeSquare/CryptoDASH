'use strict';

const hashtagCounter = require('../services/hashtag_counter/index');
const utils = require('../utils/utils');

module.exports = {
  getStatusByDay,
  getPercentageChangeByDay
};

async function getStatusByDay (req, res, next) {
  const status = await hashtagCounter.getStatusByDay(req.params.day);
  res.send(status).end();
}

async function getPercentageChangeByDay (req, res, next) {
  const numberOfHashtagsFirst = await hashtagCounter.getCountByDay(req.params.day);
  const numberOfHashtagsSecond = await hashtagCounter.getCountByDay(req.params.day * 2, req.params.day);
  const numberInPercentage = utils.calculatePercentage(numberOfHashtagsFirst, numberOfHashtagsSecond);

  res.send(numberInPercentage).end();
}
