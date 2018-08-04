'use strict';

const likeService = require('../services/like');
const utils = require('../utils/utils');

async function setLike (req, res, next) {
  const params = utils.getSubset([
    'type', 'comment_id', 'user_id'
  ], req.body);

  const like = likeService.setLike(params);

  if (!like) {
    res.send(500).end();
  }

  res.send(201).end();
}

module.exports = {
  setLike
};
