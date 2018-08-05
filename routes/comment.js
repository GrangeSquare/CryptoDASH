'use strict';

const commentService = require('../services/comment');
const utils = require('../utils/utils');

async function setComment (req, res, next) {
  try {
    const params = utils.getSubset([
      'title', 'text', 'hashtag_id', 'user_id', 'reply_id'
    ], req.body);

    await commentService.setComment(params);

    res.status(201).end();
  } catch (err) {
    next(err);
  }
}

async function getCommentsByHashtag (req, res, next) {
  try {
    const comments = await commentService.getCommentsByHashtag(req.params.hashtag);
    res.send(comments).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  setComment,
  getCommentsByHashtag
};
