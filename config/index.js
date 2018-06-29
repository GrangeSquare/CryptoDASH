'use strict';

require('dotenv').config();

const config = {
  [process.env.NODE_ENV]: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql'
  },

  sequelizeOptions: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  sessionStoreOtions: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  },
  constants: { // todo: authOptions?
    passwordMissesAllowed: 10,
    totpMissesAllowed: 10
  }
};

module.exports = config;
