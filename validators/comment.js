'use strict';

const { body, query } = require('express-validator/check');
const { vk } = require('../resources');
const custom = require('./custom');

const setComment = [
  body('reply_id')
    .custom(custom.checkReplyId).withMessage(vk('reqly_req')),
  body('title')
    .not().isEmpty().withMessage(vk('title_req'))
    .isLength({ max: 128 }).withMessage(vk('mail_long')),
  body('text')
    .not().isEmpty().withMessage(vk('pass_req'))
    .isLength({ max: 512 }).withMessage(vk('mail_long')),
  body('hashtag_id')
    .not().isEmpty().withMessage(vk('hashtag_req'))
    .isInt([ {min: 1} ]).withMessage(vk('num')),
  body('user_id')
    .not().isEmpty().withMessage(vk('user_req'))
    .isInt([ {min: 1} ]).withMessage(vk('num'))
];

const checkHashtag = [
  query('hashtag')
    .not().isEmpty().withMessage(vk('hashtag_req'))
    .isInt([ {min: 1} ]).withMessage(vk('num'))
];

module.exports = {
  setComment,
  checkHashtag
};
