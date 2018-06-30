'use strict';

const userServices = require('../services/users');
module.exports = {
  isEqual,
  hasDigits,
  validateUserEmail,
  checkWalletNotExist
};

const digitsRegexp = new RegExp('[0-9]');

function isEqual (paramName) {
  async function equal (value, {req}) {
    if (value !== req.body[paramName]) {
      throw new Error();
    }
  }
  return equal;
}

async function hasDigits (value) {
  if (!digitsRegexp.test(value)) {
    throw new Error();
  }
}

async function validateUserEmail (email) {
  const ok = await userServices.checkIfUserExists(email);

  if (ok) {
    throw new Error();
  }
}

async function checkWalletNotExist (userId, {req}) {
  if (!userId || !req.params.exchangeId) {
    throw new Error();
  }

  const walletAlreadyExists = await userServices.getWallet(userId, req.params.exchangeId);
  console.log(walletAlreadyExists);
  if (walletAlreadyExists) {
    throw new Error();
  }
}
