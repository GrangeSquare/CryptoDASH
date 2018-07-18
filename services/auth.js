'use strict';

const db = require('../models');
const passwords = require('../utils/passwords');
const totp = require('./totp');
const { AuthorizationError } = require('../utils/errors');
const ctx = require('../utils/ctx');

module.exports = {
  checkPassword,
  getUserAuth,
  checkTotpToken,
  changePassForgotten
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

async function changePassForgotten (userId, receivedPassChangeToken, newPassword) {
  if (!userId) {
    throw new AuthorizationError();
  }

  const userAuth = await getUserAuth(userId);

  if (!userAuth) {
    throw new AuthorizationError();
  }

  const changeToken = userAuth.get('change_token');
  const changeTimeframe = userAuth.get('change_timeframe');

  if (!changeToken || !changeTimeframe || (receivedPassChangeToken !== changeToken)) {
    throw new AuthorizationError();
  }

  const timeframe = +changeTimeframe;
  if (Date.now() > timeframe) {
    throw new AuthorizationError();
  }

  await db.sequelize.transaction(async t => {
    const context = {
      tx: t
    };

    await Promise.all([
      ctx.wrapInTx(context, resetPassword, userId, newPassword),
      ctx.wrapInTx(context, disablePassChange, userId),
      ctx.wrapInTx(context, resetPasswordAttempts, userAuth)
    ]);
  });
}

async function resetPassword (context, userId, newPassword) {
  const newHash = await passwords.createHashHex(newPassword);
  const result = await db.UserAuth.update({
    hash: newHash
  }, {
    where: {
      user_id: userId
    },
    transaction: context.tx
  });

  if (!result[0]) {
    throw new Error();
  }
}

async function disablePassChange (context, userId) {
  const resetInfo = {
    change_token: null,
    change_timeframe: null,
    change_counter: null
  };

  const result = await db.UserAuth.update(resetInfo, {
    where: {
      user_id: userId
    },
    transaction: context.tx
  });

  if (!result[0]) {
    throw new Error();
  }
}

function resetPasswordAttempts (context, UserAuth) {
  UserAuth.set('attempt_counter', 0);
  UserAuth.set('last_attempt_time', 0);

  const options = {
    transaction: context.tx
  };

  UserAuth.save(options);
}
