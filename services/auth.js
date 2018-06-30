'use strict';

const db = require('../models');
const passwords = require('../utils/passwords');

module.exports = {
  checkPassword,
  getUserAuth
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
