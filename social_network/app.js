'use strict';

const express = require('express');
const app = express();
const listener = require('./listener');

app.get('/', listener.lisenerEvents);

app.listen(8081, () => console.log('Listening on port 8081!'));
