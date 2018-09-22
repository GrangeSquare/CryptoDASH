'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./users');
const h = require('./handlers');
const val = require('../validators');
const session = require('./session');
const authc = require('./authc');
const resources = require('./resources');
const email = require('./email');
const post = require('./post');
const hashtagCounter = require('./hashtag_counter');
const hashtag = require('./hashtag');
const comment = require('./comment');
const like = require('./like');
const auth = require('./auth');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(session);

const baseUrl = '/api/v1';

router.get(`${baseUrl}/users/me`, h.sendCsurfHeader, authc.service, userRoutes.me);
router.post(`${baseUrl}/users/register`, val.users.register, userRoutes.register);
router.post(`${baseUrl}/users/login`, val.users.login, userRoutes.login);
router.post(`${baseUrl}/users/login1`, authc.service, val.users.login1, userRoutes.login1);
router.post(`${baseUrl}/users/logout`, userRoutes.logout);

router.post(`${baseUrl}/users/:id/exchange/:exchangeId`, val.users.registerUserCredentials, authc.service, authc.user, userRoutes.registerUserCredentials);

// action endpoints
router.get(`${baseUrl}/users/:id/get_balance`, authc.service, authc.user, val.users.getBalance, userRoutes.getUserAccountBalance);
router.get(`${baseUrl}/get_comments/:hashtag`, val.hashtags.checkHashtag, comment.getCommentsByHashtag);
router.post(`${baseUrl}/users/:id/set_balance`, authc.service, authc.user, val.users.setBalance, userRoutes.setUserAccountBalance);
router.post(`${baseUrl}/users/:id/actions/init_password_change`, authc.service, userRoutes.initPasswordChange);
router.post(`${baseUrl}/users/actions/change_password`, val.users.passChangeForgotten, userRoutes.changePassForgotten);
router.post(`${baseUrl}/users/:id/actions/init_totp_change`, authc.service, userRoutes.initTotpChange);
router.post(`${baseUrl}/users/actions/change_totp`, val.users.totpChangeForgotten, userRoutes.changeTotpForgotten);
router.post(`${baseUrl}/set_comment`, val.comments.setComment, comment.setComment);
router.get(`${baseUrl}/get_hashtags_by_day/:day`, val.hashtags.checkDay, hashtagCounter.getStatusByDay);
router.get(`${baseUrl}/get_count_hashtags/:day`, val.hashtags.checkDay, hashtagCounter.getCountByDay);
router.post(`${baseUrl}/create_hashtag`, val.hashtags.creteHashtag, hashtag.createHashtag);

router.post(`${baseUrl}/set_like`, val.likes.setLike, like.setLike);

// utility endpoints
router.get(`${baseUrl}/utils/email_verification/`, email.verify);

// resourses for front
router.get(`${baseUrl}/resources/`, resources.getResources);
router.get(`${baseUrl}/get_posts`, post.getPosts);
router.get(`${baseUrl}/resources/ticker_list`, h.table, resources.getTickers);
router.get(`${baseUrl}/resources/currency_list`, h.table, resources.getCurrencyList);

// auth servise for checking if totp is right
router.post(`${baseUrl}/totp`, auth.checkTotp);

router.use(h.error);

module.exports = router;
