'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user_auth', [{
      hash: 'asdasdasdasd',
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user', null, {});
  }
};
