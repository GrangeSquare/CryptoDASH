'use strict';

const db = require('../models');
const passwords = require('../utils/passwords');
const auth = require('./auth');
const utils = require('../utils/utils');
const exchanges = require('../exchanges');
const currencyList = require('../utils/currency_list');
const hmac = require('../utils/hmac');
const emailSender = require('./email');
const config = require('../config');
const url = require('url');
const querystring = require('querystring');

module.exports = {
  register,
  login,
  checkIfUserExists,
  registerUserCredentials,
  getWallet,
  setUserAccountBalance,
  getUserAccountBalance,
  verifyEmail,
  initPasswordChange,
  sendPasswordResetEmail,
  getPasswordResetEmailHash,
  initTotpChange,
  sendTotpResetEmail,
  getTotpResetEmailHash
};

const sessionProperties = ['id', 'email'];
const {EMAIL_SECRET, WEB_APP_BASE_URL, PASS_CHANGE_PATH, TOTP_CHANGE_PATH} = process.env;

async function register (context, request, password, totpSecret) {
  try {
    await db.sequelize.transaction(async t => {
      const User = await db.User.create(request, {transaction: t});

      if (!User) {
        throw new Error('Failed to create a user');
      }

      const hash = await passwords.createHashHex(password);

      await Promise.all([
        db.UserAuth.create({'user_id': User.id, 'hash': hash}, {transaction: t}),
        db.UserTotp.create({'user_id': User.id, 'secret': totpSecret}, {transaction: t}),
        sendConfirmationEmail(request.email, request)
      ]);

      return User;
    });
  } catch (err) {
    throw err;
  }
}

async function sendConfirmationEmail (email, data) {
  const hmacKey = hmac.digestHex(EMAIL_SECRET, email);

  const dataObj = {
    first_name: data.first_name,
    last_name: data.last_name,
    company_name: 'Cryptodash' // todo: check & externalize
  };

  const ok = await emailSender.sendConfirmationEmail(email, hmacKey, dataObj);
  return ok;
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

  await setUserAccountBalance(userId, ExchangeWallet.get('id'));
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

async function setUserAccountBalance (userId, walletId = undefined) {
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

async function getUserAccountBalance (userId) {
  const queryObj = {
    id: userId
  };

  const user = await db.User.findOne({
    where: queryObj,
    include: [{
      model: db.ExchangeWallet,
      required: true,
      include: [{
        model: db.Exchange,
        required: true,
        attributes: ['name']
      }, {
        model: db.CurrencyAmount,
        required: true,
        include: [{
          model: db.Currency,
          required: true,
          attributes: ['symbol']
        }],
        attributes: ['amount']
      }],
      attributes: {
        exclude: ['created_at', 'updated_at', 'exchange_id', 'user_id']
      }
    }],
    attributes: {
      exclude: ['email_confirmed', 'created_at', 'updated_at']
    }
  });
  return user;
}

async function removeWalletBalance (walletId) {
  const ok = await db.CurrencyAmount.destroy({
    where: {
      exchange_wallet_id: walletId
    }
  });

  return ok;
}

async function verifyEmail (data) {
  const newHash = hmac.digestHex(EMAIL_SECRET, data.email);

  if (newHash !== data.hash) {
    throw new Error();
  }

  await db.User.update({email_confirmed: true}, {
    where: {
      email: data.email
    }
  });
}

async function initPasswordChange (userId) {
  const resetInfo = {
    change_token: utils.getPasswordChangeSecret(),
    change_timeframe: Date.now() + (config.constants.passwordChangeWindowMins * 60 * 1000)
  };

  const result = await db.UserAuth.update(resetInfo, {
    where: {
      user_id: userId
    }
  });

  if (!result[0]) {
    throw new Error();
  }
}

async function sendPasswordResetEmail (userId) {
  const user = await getUserWithAuth(userId);
  const auth = user.get('UserAuth');

  const changeUrl = url.resolve(WEB_APP_BASE_URL, PASS_CHANGE_PATH);

  const changeQuery = querystring.stringify({
    user_id: userId,
    secret: auth.change_token,
    hash: getPasswordResetEmailHash(userId)
  });

  const emailData = {
    link: [changeUrl, changeQuery].join('?'),
    toAddress: user.get('email')
  };

  await emailSender.sendEmail(emailData);
}

async function getUserWithAuth (id) {
  const user = await db.User.findOne({
    where: {
      id: id
    },
    include: [{
      model: db.UserAuth,
      required: true
    }]
  });

  return user;
}

function getPasswordResetEmailHash (userId) {
  return hmac.digestHex(EMAIL_SECRET, Buffer.from('' + userId));
}

function getTotpResetEmailHash (userId) {
  return hmac.digestHex(EMAIL_SECRET, Buffer.from('' + userId));
}

async function initTotpChange (userId) {
  const resetInfo = {
    change_token: utils.getTotpChangeSecret(),
    change_timeframe: Date.now() + (config.constants.totpChangeWindowMins * 60 * 1000)
  };

  const result = await db.UserTotp.update(resetInfo, {
    where: {
      user_id: userId
    }
  });

  if (!result[0]) {
    throw new Error();
  }
}

async function sendTotpResetEmail (userId) {
  const user = await getUserWithTotp(userId);

  const totp = user.get('UserTotp');

  var changeUrl = url.resolve(WEB_APP_BASE_URL, TOTP_CHANGE_PATH);
  const changeQuery = querystring.stringify({
    user_id: userId,
    secret: totp.change_token,
    hash: getTotpResetEmailHash(userId)
  });

  const emailOptions = {
    firstName: user.get('first_name'),
    lastName: user.get('last_name')
  };

  const emailData = {
    toAddress: user.get('email'),
    link: [changeUrl, changeQuery].join('?')
  };

  emailSender.sendEmail(emailData, emailOptions);
}

async function getUserWithTotp (id, attributes = undefined) {
  const user = await db.User.findOne({
    where: {
      id: id
    },
    attributes: attributes,
    include: [{
      model: db.UserTotp,
      required: true
    }]
  });
  return user;
}
