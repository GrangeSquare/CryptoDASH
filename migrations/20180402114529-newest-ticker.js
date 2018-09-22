'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('newest_ticker', {
      price_usd: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      price_eth: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      price_btc: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      market_cap: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      },
      daily_volume: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      },
      change_24h: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      currency_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        references: {
          model: 'currency',
          key: 'id'
        }
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('newest_ticker');
  }
};
