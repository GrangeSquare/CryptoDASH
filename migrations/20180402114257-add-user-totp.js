'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'user_totp',
        'change_token',
        {
          type: Sequelize.STRING(64),
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'user_totp',
        'change_timeframe',
        {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('user_totp', 'change_token'),
      queryInterface.removeColumn('user_totp', 'change_timeframe')
    ]);
  }
};
