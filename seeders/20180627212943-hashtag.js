'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('hashtag', [{
      name: 'btc',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'eth',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'nmc',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'ltc',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('hashtag', null, {});
  }
};
