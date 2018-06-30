'use strict';

const fs = require('fs');
const path = require('path');

let data = {};

try {
  let files = fs.readdirSync(__dirname);

  files.forEach(file => {
    if (file.indexOf('index') === -1) {
      let exchange = require(path.resolve(__dirname, './', file), 'utf8');
      let withoutSuffix = file.substr(0, file.indexOf('.'));
      data[withoutSuffix] = exchange;
    }
  });
} catch (err) {
  console.log(err);
}

module.exports = data;
