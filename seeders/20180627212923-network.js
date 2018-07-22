'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('network', [{
      name: 'INSTAGRAM',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'TWITTER',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'LINKEDIN',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('network', null, {});
  }
};
