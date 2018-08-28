'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.changeColumn('post', 'text', {
      type: Sequelize.STRING(512) + ' CHARACTER SET utf8mb4 COLLATE utf8mb4_bin',
      allowNull: true
    });

    queryInterface.changeColumn('post', 'id_post', {
      type: Sequelize.STRING(64)
    });

    queryInterface.changeColumn('post', 'url', {
      type: Sequelize.STRING(256)
    });
  },

  down: (queryInterface, Sequelize) => {
  }
};
