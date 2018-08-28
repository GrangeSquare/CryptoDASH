'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'currency',
        'name',
        {
          type: Sequelize.STRING(64),
          allowNull: true
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('currency', 'name')
    ]);
  }
};
