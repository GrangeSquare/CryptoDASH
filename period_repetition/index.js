'use strict';

const config = require('./config');
const HashtagCount = require('hashtag-count');
const hashtags = ['superbowl', 'pizza', 'beer'];
// const {PERIOD_SEVEN_DAY, PERIOD_THIRTY_DAT} = process.env;

const hashtagCount = new HashtagCount(config);

async function lisenOnSevenDay () {
  var interval = '1 seconds';
  var limit = '5 seconds';
  hashtagCount.start({
    hashtags: hashtags, // required
    interval: interval, // required
    limit: limit,
    finishedCb: finishedCb
  });
}

async function lisenOnThirtyDay () {
  var interval = '2 seconds';
  var limit = '10 seconds';
  hashtagCount.start({
    hashtags: hashtags, // required
    interval: interval, // required
    limit: limit,
    finishedCb: finishedCb
  });
}

const finishedCb = function (err, results) {
  if (err) {
    console.error(err);
  } else {
    console.log(results);
  }
};

lisenOnSevenDay();

lisenOnThirtyDay();
