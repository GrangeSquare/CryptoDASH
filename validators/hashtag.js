'use strict';

const { body, param } = require('express-validator/check');
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

const creteHashtag = [
  body('name')
    .not().isEmpty().withMessage(vk('hashtag_name_req'))
    .isLength({ max: 64 }).withMessage(vk('hashtag_long')),
  body('currency_id')
    .not().isEmpty().withMessage(vk('currency_id_req'))
    .isInt([ {min: 1} ]).withMessage(vk('num'))
];

module.exports = {
  checkHashtag,
  checkDay,
  creteHashtag
};
