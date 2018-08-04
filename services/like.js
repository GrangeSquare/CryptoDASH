'use strict';

const db = require('../models');

async function setLike (params) {
  const like = db.Like.create(params);
  return like;
}

module.exports = {
  setLike
};
