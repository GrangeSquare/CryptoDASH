'use strict';

const { query } = require('express-validator/check');
const { vk } = require('../resources');

const checkHashtag = [
  query('hashtag')
    .not().isEmpty().withMessage(vk('hashtag_req'))
    .isInt([ {min: 1} ]).withMessage(vk('num'))
];

const checkDay = [
  query('day')
    .not().isEmpty().withMessage(vk('day_req'))
    .isInt([ {min: 1} ]).withMessage(vk('num'))
];

module.exports = {
  checkHashtag,
  checkDay
};
