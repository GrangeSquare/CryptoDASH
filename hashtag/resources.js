'use strict';

const currencyList = require('../utils/currency_list');
let hashtags = '';
let counter = 0;

for (let i in currencyList) {
  if (counter++ === 100) {
    hashtags = hashtags.substr(0, hashtags.length - 1);
    break;
  }
  hashtags += i + ',';
}

module.exports = hashtags;
