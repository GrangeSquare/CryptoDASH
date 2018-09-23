'use strict';

const likeService = require('../services/like');
const utils = require('../utils/utils');

module.exports = {
  setLike
};

async function setLike (req, res, next) {
  try {
    const params = utils.getSubset([
      'comment_id', 'user_id'
    ], req.body);

    await likeService.setLike(params);

    res.status(201).end();
  } catch (err) {
    next(err);
  }
}
