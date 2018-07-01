'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./users');
const h = require('./handlers');
const val = require('../validators');
const session = require('./session');
const authc = require('./authc');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(session);

const baseUrl = '/api/v1';

router.post(`${baseUrl}/users/register`, val.users.register, userRoutes.register);
router.post(`${baseUrl}/users/login`, val.users.login, userRoutes.login);
router.post(`${baseUrl}/users/login1`, authc.service, val.user.login1, userRoutes.login1);
router.post(`${baseUrl}/users/logout`, userRoutes.logout);

router.post(`${baseUrl}/users/:id/exchange/:exchangeId`, val.users.registerUserCredentials, authc.service, authc.user, userRoutes.registerUserCredentials);

router.post(`${baseUrl}/users/:id/set_balance`, val.users.getBalance, authc.service, authc.user, userRoutes.setUserAccountBalance);
router.use(h.error);

module.exports = router;
