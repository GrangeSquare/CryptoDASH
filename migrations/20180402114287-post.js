'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Post', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      id_post: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      text: {
        type: Sequelize.STRING(512),
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      url: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      network_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'network',
          key: 'id'
        }
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
    return queryInterface.dropTable('Post');
  }
};
