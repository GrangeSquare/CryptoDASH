'use strict';

const utils = require('../utils/utils');
const db = require('../../models');

async function putInDatabase (data) {
  const dataForDB = await utils.prepareData(data);
  await db.Post.create(dataForDB);
}

module.exports = {
  putInDatabase
};
