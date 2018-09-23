'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('post', {
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
        type: Sequelize.STRING(512) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
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
    return queryInterface.dropTable('post');
  }
};
