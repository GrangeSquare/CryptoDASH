'use strict';

const db = require('../models');

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
      name: name
    }
  });

  if (!hashtagId) {
    throw new Error();
  }

  const countHashtag = await db.CountHashtag.create({count: count, hashtag_id: hashtagId.dataValues.id});

  if (!countHashtag) {
    throw new Error();
  }
}

module.exports = {
  setCountOfHashtags
};
