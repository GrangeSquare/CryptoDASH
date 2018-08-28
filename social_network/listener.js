'use strict';

const listenerDB = require('./services/post');

async function listenerEvents (req, res, next) {
  try {
    console.log(req.body.json);
    await listenerDB.putInDatabase(req.body.json);
    res.end();
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  listenerEvents
};
