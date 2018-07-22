'use strict';

const listenerDB = require('./services/post');

async function lisenerEvents (req, res, next) {
  try {
    const data = JSON.parse(req.query.json);
    await listenerDB.putInDatabase(data);
    res.end();
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  lisenerEvents
};
