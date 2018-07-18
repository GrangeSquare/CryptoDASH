'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('currency_amount', [{
      amount: 23.557,
      exchange_wallet_id: 1,
      currency_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      amount: 53.557,
      exchange_wallet_id: 1,
      currency_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      amount: 2543.557,
      exchange_wallet_id: 2,
      currency_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('currency_amount', null, {});
  }
};
