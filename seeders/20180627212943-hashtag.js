'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const currencyList = require('../utils/currency_union')();
    const bulkInsertArr = [];
    let counter = 0;

    for (let i in currencyList) {
      if (counter++ === 100) {
        break;
      }

      bulkInsertArr.push({
        name: currencyList[i].symbol,
        currency_id: currencyList[i].id,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    return queryInterface.bulkInsert('hashtag', bulkInsertArr, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('hashtag', null, {});
  }
};
