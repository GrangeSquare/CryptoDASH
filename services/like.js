'use strict';

const db = require('../models');

module.exports = {
  setLike
};

async function setLike (data) {
  const like = db.Like.create(data);

  if (!like) {
    throw new Error();
  }
}
