const utils = require('../utils');
const usersService = require('../services/users');
const { AuthenticationError } = require('../utils/errors');
const authc = require('./authc');
const Response = require('../utils/response');

module.exports = {
  register,
  login,
  login1,
  logout,
  registerUserCredentials,
  setUserAccountBalance
};

async function register (req, res, next) {
  try {
    const request = utils.getSubset([
      'email', 'first_name', 'last_name', 'address'
    ], req.body);

    const context = {
      totpToken: req.body.token
    };

    await usersService.register(context, request, req.body.password, req.body.secret);

    res.status(201).end();
  } catch (err) {
    next(err);
  }
}

async function login (req, res, next) {
  try {
    const sessionProperties = await usersService.login(req.body.email, req.body.password);

    if (sessionProperties) {
      authc.setAuthenticated(req, sessionProperties);
      res.end();
    } else {
      next(new AuthenticationError());
    }
  } catch (err) {
    next(new AuthenticationError(err));
  }
}

async function registerUserCredentials (req, res, next) {
  try {
    const params = utils.getSubset([
      'apiKey', 'apiKeySecret'
    ], req.body);

    await usersService.registerUserCredentials(req.params.id, req.params.exchangeId, params);
    res.status(200).end();
  } catch (err) {
    next(new AuthenticationError(err));
  }
}

async function setUserAccountBalance (req, res, next) {
  try {
    await usersService.setUserAccountBalance(req.params.id);
    res.status(200).end();
  } catch (err) {
    console.log(err);
    next(new AuthenticationError(err));
  }
}

async function login1 (req, res, next) {
  authc.setTotpValidated(req);
  res.status(200).send(Response.success(null));
  res.end();
}

async function logout (req, res, next) {
  authc.destroy(req);
  res.status(200);
  res.send(Response.success(null));
  res.end();
}
