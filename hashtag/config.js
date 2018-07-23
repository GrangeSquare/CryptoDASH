'use strict';

const axios = require('axios').create();

axios.defaults.baseURL = 'https://api.ritekit.com/v1/stats/';

module.exports = axios;
