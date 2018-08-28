'use strict';

const express = require('express');
const app = express();
const listener = require('./listener');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/listener', listener.listenerEvents);

app.listen(8081, () => console.log('Listening on port 8081!'));
