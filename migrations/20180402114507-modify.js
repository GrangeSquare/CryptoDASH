'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([queryInterface.addColumn(
      'exchange_wallet',
      'ipfs_hash',
      Sequelize.STRING
    ),
    queryInterface.dropTable('currency_amount')
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn(
      'exchange_wallet',
      'ipfs_hash'
    )]);
  }
};
