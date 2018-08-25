'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('exchange', [{
      name: 'BINANCE',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'KUCOIN',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'BITTREX',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'CRYPTOPIA',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'GATE_IO',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'HITBTC',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'OKEX',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'POLONIEX',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'LIQUI',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('exchange', null, {});
  }
};
