'use strict';

const listenerDB = require('./services/post');

async function listenerEvents (req, res, next) {
  try {
    await listenerDB.putInDatabase(req.body);
    res.end();
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  listenerEvents
};
