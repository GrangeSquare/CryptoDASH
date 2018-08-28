'use strict';

const listenerDB = require('./services/post');

async function listenerEvents (req, res, next) {
  try {
    // const data = JSON.parse(req.query.json);
    console.log(req.query.json);
    await listenerDB.putInDatabase(req.query.json);
    res.end();
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  listenerEvents
};
