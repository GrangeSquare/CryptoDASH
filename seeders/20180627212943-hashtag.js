'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const currencySource = require('../utils/currency_union')();
    const currencyList = require('../utils/full_coin_list');
    const sourceFile = require('../utils/currency_list');
    const bulkInsertArr = [];
    let counter = 0;

    for (let i in currencySource) {
      if (counter++ === 100) {
        break;
      }

      if (sourceFile[currencyList[i].symbol]) {
        bulkInsertArr.push({
          name: currencyList[i].symbol,
          currency_id: currencyList[i].id,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    return queryInterface.bulkInsert('hashtag', bulkInsertArr, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('hashtag', null, {});
  }
};
