'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('exchange_wallet', [{
      user_id: 1,
      exchange_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      user_id: 1,
      exchange_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('exchange_wallet', null, {});
  }
};
