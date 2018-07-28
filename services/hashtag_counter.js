'use strict';

const db = require('../models');
var moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function setCountOfHashtags (dataFromAxios) {
  try {
    dataFromAxios.data.stats.forEach(async element => {
      await setCountHashtag(element.tweets, element.hashtag);
    });
  } catch (err) {
    console.log(err);
  }
}

async function setCountHashtag (count, name) {
  const hashtagId = await db.Hashtag.findOne({
    where: {
      name: name.toUpperCase()
    },
    attributes: ['id']
  });

  if (!hashtagId) {
    throw new Error();
  }

  const hashtagCounter = await db.HashtagCounter.create({count: count, hashtag_id: hashtagId.get('id')});

  if (!hashtagCounter) {
    throw new Error();
  }
}

async function getStatusByDay (day) {
  let now = moment().add(-day, 'day');

  const status = await getStatus(now);

  if (!status) {
    throw new Error();
  }

  return status;
}

async function getCountByDay (day) {
  const status = await getStatusByDay(day);
  let countTags = {};

  await status.forEach(element => {
    var key = element.dataValues.Hashtag.dataValues.name;
    if (!countTags[key]) {
      countTags[key] = +element.dataValues.count;
    } else {
      countTags[key] += +element.dataValues.count;
    }
  });

  return countTags;
}

async function getStatus (time) {
  const status = await db.HashtagCounter.findAll({
    row: true,
    where: {
      created_at: {
        [Op.gte]: time
      }
    },
    include: [{
      model: db.Hashtag,
      required: true,
      attributes: ['name']
    }],
    attributes: ['count']
  });
  return status;
}

module.exports = {
  setCountOfHashtags,
  getStatusByDay,
  getCountByDay
};
