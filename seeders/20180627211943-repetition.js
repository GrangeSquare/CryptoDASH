'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('repetition', [{
      repetition: 23,
      period_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      repetition: 175,
      period_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('repetition', null, {});
  }
};
