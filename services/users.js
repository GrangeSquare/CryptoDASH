'use strict';

const db = require('../models');
const passwords = require('../utils/passwords');
const auth = require('./auth');
const utils = require('../utils');

module.exports = {
  register,
  login,
  checkIfUserExists,
  registerUserCredentials,
  getWallet
};

const sessionProperties = ['id', 'email'];

async function register (request) {
  try {
    await db.sequelize.transaction(async t => {
      const User = await db.User.create(request, {transaction: t});

      if (!User) {
        throw new Error('Failed to create a user');
      }

      const hash = await passwords.createHashHex(request.password);
      await db.UserAuth.create({'user_id': User.id, 'hash': hash}, {transaction: t});

      return User;
    });
  } catch (err) {
    throw err;
  }
}

async function login (email, password) {
  const User = await getUserByEmail(email);
  if (!User) {
    return false;
  }

  const ok = await auth.checkPassword(User.get('id'), password);

  if (!ok) {
    return false;
  }

  return getSessionProperties(User.dataValues);
}

async function getUserByEmail (userEmail) {
  const User = await db.User.findOne({
    where: {
      email: userEmail
    }
  });

  return User;
}

async function registerUserCredentials (userId, exchangeId, params) {
  console.log(userId);
  if (!userId || !exchangeId || !params.apiKey || !params.apiKeySecret) {
    throw new Error();
  }

  await db.sequelize.transaction(async t => {
    const exchangeWallet = {
      user_id: userId,
      exchange_id: exchangeId
    };

    const ExchangeWallet = await db.ExchangeWallet.create(exchangeWallet, {transaction: t});

    const exchangeWalletKey = {
      exchange_wallet_id: ExchangeWallet.get('id'),
      public_key: params.apiKey,
      private_key: params.apiKeySecret
    };

    await db.ExchangeWalletKey.create(exchangeWalletKey, {transaction: t});
  });
}

async function checkIfUserExists (email) {
  const found = await db.User.findOne({ where: { email: email }, attributes: ['email'], raw: true });
  return found != null;
}

function getSessionProperties (User) {
  const obj = utils.getSubset(sessionProperties, User);
  return obj;
}

async function getWallet (userId, exchangeId) {
  const Wallet = await db.ExchangeWallet.findOne({
    where: {
      user_id: userId,
      exchange_id: exchangeId
    }
  });

  return Wallet;
}
