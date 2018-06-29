'use strict';

require('dotenv').config();

const http = require('http');
const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const { PORT, WEB_APP_BASE_URL } = process.env;

const app = express();

app.use('/', routes);
app.disable('x-powered-by');
app.use(cors({
  'origin': WEB_APP_BASE_URL,
  'credentials': true,
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
}));

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
