const { body, param } = require('express-validator/check');
const custom = require('./custom');
const { vk } = require('../resources');

const idParamValidation = function (idName = 'id') {
  return [ param(idName)
    .trim()
    .not().isEmpty().withMessage(vk('req'))
    .isInt([ {min: 1} ]).withMessage(vk('num'))
  ];
};

const register = [
  body('email')
    .trim()
    .isEmail().withMessage(vk('mail_req'))
    .isLength({ max: 128 }).withMessage(vk('mail_long'))
    .custom(custom.validateUserEmail).withMessage(vk('mail_already_use')),
  body('password')
    .not().isEmpty().withMessage(vk('pass_req'))
    .isLength({ min: 8 }).withMessage(vk('pass_min')),
  body('password_repeat')
    .not().isEmpty().withMessage(vk('pass_req'))
    .isLength({ min: 8 }).withMessage(vk('pass_min'))
    .custom(custom.isEqual('password')).withMessage(vk('pass_equal'))
    .custom(custom.hasDigits).withMessage(vk('pass_digits')),
  body('first_name')
    .trim()
    .not().isEmpty().withMessage(vk('fn_req'))
    .isLength({ max: 64 }).withMessage(vk('fn_long')),
  body('last_name')
    .trim()
    .not().isEmpty().withMessage(vk('ln_req'))
    .isLength({ max: 64 }).withMessage(vk('ln_long'))

];

function validateTotpToken (tokenName, secretName) {
  return [
    body(tokenName)
      .trim()
      .not().isEmpty().withMessage(vk('token_req'))
      .custom(custom.validateTotpToken(secretName)).withMessage(vk('token_auth')),
    body(secretName)
      .not().isEmpty().withMessage(vk('token_secret'))
  ];
}

const register2 = validateTotpToken('token', 'secret');

const login = [
  body('email')
    .trim()
    .isEmail().withMessage(vk('mail_valid'))
    .isLength({ max: 128 }).withMessage(vk('mail_long')),
  body('password')
    .not().isEmpty().withMessage(vk('pass_req'))
    .isLength({ min: 8 }).withMessage(vk('pass_min'))
];

const login1 = validateToken('token');

function validateToken (tokenName) {
  return [
    body(tokenName)
      .trim()
      .not().isEmpty().withMessage(vk('token_req'))
      .custom(custom.validateTotp).withMessage(vk('token_auth'))
  ];
}

const registerUserCredentials = [
  body('apiKey')
    .trim()
    .not().isEmpty().withMessage(vk('api_key_invalid'))
    .isLength({ max: 128 }).withMessage(vk('api_key_invalid')),
  body('apiKeySecret')
    .not().isEmpty().withMessage(vk('api_key_secret_invalid'))
    .isLength({ max: 128 }).withMessage(vk('api_key_secret_invalid')),
  param('id')
    .trim()
    .not().isEmpty().withMessage(vk('req'))
    .isInt([ {min: 1} ]).withMessage(vk('num'))
    .custom(custom.checkWalletNotExist).withMessage(vk('wallet_exists')),
  idParamValidation('exchangeId')
];
const getBalance = [
  idParamValidation('id')
];

module.exports = {
  register,
  login,
  registerUserCredentials,
  getBalance,
  register2,
  login1
};
