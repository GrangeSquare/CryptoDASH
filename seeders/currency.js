'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const currencyList = require('../utils/currency_list');
    const bulkInsertArr = [];

    for (let i in currencyList) {
      bulkInsertArr.push({
        id: currencyList[i],
        symbol: i,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    return queryInterface.bulkInsert('currency', bulkInsertArr, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('currency', null, {});
  }
};
