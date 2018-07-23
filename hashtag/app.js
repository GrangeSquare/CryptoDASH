'use strict';

const axios = require('./config');
const countHashtagService = require('../services/count_hashtag');

// setInterval(setCountOfHashtags, 5000);

async function setCountOfHashtags () {
  const dataFromAxios = await axios.get('multiple-hashtags?tags=btc,eth,ltc,nmc&client_id=23caa092a902a76400b6f833dac753f2b20a2e18761e');
  countHashtagService.setCountOfHashtags(dataFromAxios);
}

setCountOfHashtags();
