'use strict';

const db = require('../models');
const passwords = require('../utils/passwords');
const auth = require('./auth');
const utils = require('../utils');
const exchanges = require('../exchanges');
const currencyList = require('../utils/currencyList');

module.exports = {
  register,
  login,
  checkIfUserExists,
  registerUserCredentials,
  getWallet,
  getUserAccountBalance
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
  if (!userId || !exchangeId || !params.apiKey || !params.apiKeySecret) {
    throw new Error();
  }

  const ExchangeWallet = await db.sequelize.transaction(async t => {
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
    return ExchangeWallet;
  });

  await getUserAccountBalance(userId, ExchangeWallet.get('id'));
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

async function getUserAccountBalance (userId, walletId = undefined) {
  const queryObj = {
    user_id: userId
  };

  if (walletId) {
    queryObj.id = walletId;
  }

  const UserWallets = await db.ExchangeWallet.findAll({
    where: queryObj,
    include: [{
      model: db.ExchangeWalletKey,
      required: true
    }, {
      model: db.Exchange,
      required: true
    }
    ]
  });

  if (!UserWallets) {
    throw new Error();
  }

  UserWallets.forEach(async element => {
    const exchangeName = element.get('Exchange').get('name');

    const context = {
      apiKey: element.get('ExchangeWalletKey').get('public_key'),
      apiSecret: element.get('ExchangeWalletKey').get('private_key')
    };

    const balance = await exchanges[exchangeName.toLowerCase()].getUserBalanceDummy(context);

    const walletId = element.get('id');

    await removeWalletBalance(walletId);
    const bulkInsert = [];

    for (let i in balance) {
      const currencyAmount = {
        amount: balance[i].toString(),
        currency_id: currencyList[i],
        exchange_wallet_id: walletId
      };

      bulkInsert.push(currencyAmount);
    }

    await db.CurrencyAmount.bulkCreate(bulkInsert); // todo: perfomance issue
  });
}

async function removeWalletBalance (walletId) {
  const ok = await db.CurrencyAmount.destroy({
    where: {
      exchange_wallet_id: walletId
    }
  });

  return ok;
}
