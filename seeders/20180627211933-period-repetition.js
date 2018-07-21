'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('period', [{
      name: 'BTC',
      period: 7,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'BTC',
      period: 30,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('period', null, {});
  }
};
