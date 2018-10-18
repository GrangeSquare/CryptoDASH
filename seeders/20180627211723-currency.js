'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const union = require('../utils/currency_union')();
    const bulkInsertArr = [];

    for (let i in union) {
      bulkInsertArr.push({
        id: union[i].id,
        symbol: union[i].symbol,
        name: union[i].name,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    return queryInterface.bulkInsert('currency', bulkInsertArr, {
      updateOnDuplicate: ['name']
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('currency', null, {});
  }
};
