'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const currencySource = require('../utils/currency_union')();
    const bulkInsertArr = [];

    for (let i in currencySource) {
      bulkInsertArr.push({
        id: currencySource[i].id,
        symbol: currencySource[i].symbol,
        name: currencySource[i].name,
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
