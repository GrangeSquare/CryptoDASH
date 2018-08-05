'use strict';

const db = require('../models');

async function setLike (data) {
  const like = db.Like.create(data);

  if (!like) {
    throw new Error();
  }
}

module.exports = {
  setLike
};
