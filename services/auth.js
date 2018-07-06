'use strict';

const db = require('../models');
const passwords = require('../utils/passwords');
const totp = require('./totp');

module.exports = {
  checkPassword,
  getUserAuth,
  checkTotpToken
};
async function checkPassword (userId, password) {
  const UserAuth = await getUserAuth(userId);

  const ok = await passwords.check(password, UserAuth.hash);

  if (!ok) {
    return false;
  }

  return true;
}

async function getUserAuth (userId) {
  const result = await db.UserAuth.findOne({
    where: {
      user_id: userId
    }
  });

  return result;
}

async function checkTotpToken (userId, token) {
  const userTotp = await getUserTotp(userId);

  if (!userTotp) {
    return false;
  }

  const secret = userTotp.get('secret');

  const ok = await totp.validateToken(secret, token);

  if (!ok) {
    return false;
  }

  return true;
}

async function getUserTotp (userId) {
  const totp = await db.UserTotp.findOne({
    where: {
      user_id: userId
    }
  });

  return totp;
}
