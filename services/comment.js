'use strict';

const db = require('../models');
const hashtag = require('./hashtag');

async function setComment (data) {
  const hashId = await hashtag.getIdByName(data.hashtag);

  if (!hashId) {
    throw new Error();
  }
  console.log(data.title)
  const createObj = {
    title: data.title,
    text: data.text,
    user_id: data.user_id,
    hashtag_id: hashId.get('id')
  };

  const comment = await db.Comment.create(createObj);

  if (!comment) {
    throw new Error();
  }
}

async function setCommentReply (data) {
  const createObj = {
    title: data.title,
    text: data.text,
    user_id: data.user_id,
    comment_id: data.comment_id
  };

  const commentReply = await db.CommentReply.create(createObj);

  if (!commentReply) {
    throw new Error();
  }
}

async function getCommentsByHashtag (name) {
  const hashId = await hashtag.getIdByName(name);

  const comments = await db.Comment.findAll({
    where: {
      hashtag_id: hashId.get('id')
    },
    include: [{
      model: db.CommentReply,
      attributes: ['user_id', 'text', 'title', 'likes', 'created_at']
    }],
    attributes: ['user_id', 'text', 'title', 'likes', 'created_at']
  });

  return comments;
}

module.exports = {
  setComment,
  setCommentReply,
  getCommentsByHashtag
};
