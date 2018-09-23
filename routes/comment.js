'use strict';

const commentService = require('../services/comment');
const hashtagService = require('../services/hashtag');
const utils = require('../utils/utils');

module.exports = {
  setComment,
  getCommentsByHashtag
};

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
    const response = {};
    response.hashtagsList = await hashtagService.getHashtagsLike(req.params.hashtag);
    response.comments = await commentService.getCommentsByHashtag(req.params.hashtag);
    res.send(response).end();
  } catch (err) {
    next(err);
  }
}
