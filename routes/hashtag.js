'use strict';

const hashtagService = require('../services/hashtag');
const utils = require('../utils/utils');

module.exports = {
  createHashtag
};

async function createHashtag (req, res, next) {
  try {
    const data = utils.getSubset([
      'name', 'currency_id'
    ], req.body);

    await hashtagService.createHashtag(data);
    res.status(201).end();
  } catch (err) {
    next(err);
  }
}
