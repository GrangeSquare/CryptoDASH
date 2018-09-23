'use strict';

const db = require('../models');

module.exports = {
  setComment,
  getCommentsByHashtag
};

async function setComment (data) {
  const comment = db.Comment.create(data);

  if (!comment) {
    throw new Error();
  }
}

async function getCommentsByHashtag (hashtagId) {
  const comments = await db.Comment.findAll({
    where: {
      hashtag_id: hashtagId
    },
    include: [{
      model: db.Like
    }]
  });

  return comments;
}
