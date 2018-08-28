'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const currencyList = require('../utils/full_coin_list');
    const sourceFile = require('../utils/currency_list');
    const bulkInsertArr = [];

    for (let i in currencyList) {
      if (sourceFile[currencyList[i].symbol]) {
        bulkInsertArr.push({
          id: currencyList[i].id,
          symbol: currencyList[i].symbol,
          name: currencyList[i].name,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    console.log(bulkInsertArr);

    return queryInterface.bulkInsert('currency', bulkInsertArr, {
      updateOnDuplicate: ['name']
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('currency', null, {});
  }
};
