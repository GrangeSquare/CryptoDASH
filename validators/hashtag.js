'use strict';

const { param } = require('express-validator/check');
const { vk } = require('../resources');

const checkHashtag = [
  param('hashtag')
    .not().isEmpty().withMessage(vk('hashtag_req'))
    .isInt([ {min: 1} ]).withMessage(vk('num'))
];

const checkDay = [
  param('day')
    .not().isEmpty().withMessage(vk('day_req'))
    .isInt([ {min: 1} ]).withMessage(vk('num'))
];

module.exports = {
  checkHashtag,
  checkDay
};
