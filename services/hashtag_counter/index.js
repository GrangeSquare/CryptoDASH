'use strict';

const db = require('../../models');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const dataMapper = require('./data_mapper');

module.exports = {
  setCountOfHashtags,
  getCountByDay
};

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
    return;
  }

  await db.HashtagCounter.create({count: count, hashtag_id: hashtagId.get('id')});
}

async function getCountByDay (toDay, fromDay) {
  const fromPeriod = moment().subtract(fromDay, 'day');
  const toPeriod = moment().subtract(toDay, 'day');

  const status = await db.HashtagCounter.findAll({
    row: true,
    where: {
      created_at: {
        [Op.and]: {
          $lte: fromPeriod,
          $gte: toPeriod
        }
      }
    },
    include: [{
      model: db.Hashtag,
      required: true,
      attributes: ['name']
    }],
    attributes: ['count']
  });

  return dataMapper.mapNameAndCount(status);
}
