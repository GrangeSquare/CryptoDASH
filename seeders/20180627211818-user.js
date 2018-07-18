'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user', [{
      email: 'jjovanovic224@hotmail.com',
      first_name: 'nikola',
      last_name: 'narkovic',
      email_confirmed: 0,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user', null, {});
  }
};
