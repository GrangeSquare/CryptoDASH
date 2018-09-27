'use strict';

const axios = require('./config');
const hashtagCounterService = require('../services/hashtag_counter/index');
const hashtags = require('./resources');
const clientId = process.env.CLIENT_ID;

async function setCountOfHashtags () {
  const dataFromAxios = await axios.get('multiple-hashtags?tags=' + hashtags + '&client_id=' + clientId);
  hashtagCounterService.setCountOfHashtags(dataFromAxios);
  console.log('END!');
}

setInterval(setCountOfHashtags, 3600000);
