'use strict';

const { body } = require('express-validator/check');
const custom = require('./custom');
const { vk } = require('../resources');

const setComment = [
  body('title'),
  body('text')
    .not().isEmpty().withMessage(vk('pass_req')),
  body('hashtag')
    .not().isEmpty().withMessage(vk('pass_req'))
    .custom(custom.checkHashtag).withMessage(vk('hashtag_exist')),
  body('user_id')
    .not().isEmpty().withMessage(vk('pass_req'))
    .isInt([ {min: 1} ]).withMessage(vk('num'))
];

const setCommentReply = [
  body('title'),
  body('text')
    .not().isEmpty().withMessage(vk('pass_req')),
  body('user_id')
    .not().isEmpty().withMessage(vk('pass_req'))
    .isInt([ {min: 1} ]).withMessage(vk('num')),
  body('comment_id')
    .not().isEmpty().withMessage(vk('pass_req'))
    .isInt([ {min: 1} ]).withMessage(vk('num'))
];

module.exports = {
  setComment,
  setCommentReply
};
