'user strict';

const periodServices = require('../services/periodRepetition');

async function getRepetition (req, res, next) {
  const response = periodServices.getRepetitionByName(req.query.name);
  res.send(response).end();
}

module.exports = {
  getRepetition
};
