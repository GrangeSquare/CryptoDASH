'use strict';

const { body } = require('express-validator/check');
const { vk } = require('../resources');
const custom = require('./custom');

const setLike = [
  body('type')
    .not().isEmpty().withMessage(vk('pass_req'))
    .custom(custom.checkTypeOfComment),
  body('comment_id')
    .not().isEmpty().withMessage(vk('pass_req'))
    .isInt([ {min: 1} ]).withMessage(vk('num')),
  body('user_id')
    .not().isEmpty().withMessage(vk('pass_req'))
    .isInt([ {min: 1} ]).withMessage(vk('num'))
];

module.exports = {
  setLike
};
