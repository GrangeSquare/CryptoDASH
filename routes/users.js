const utils = require('../utils');
const usersService = require('../services/users');
const Response = require('../utils/response');
const { AuthenticationError } = require('../utils/errors');
const authc = require('./authc');

module.exports = {
  register,
  login,
  registerUserCredentials
};

async function register (req, res, next) {
  try {
    const request = utils.getSubset([
      'email', 'first_name', 'last_name', 'address', 'password'
    ], req.body);

    await usersService.register(request);

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
