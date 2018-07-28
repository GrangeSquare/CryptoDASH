'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const currencyList = require('../utils/currency_list');
    const bulkInsertArr = [];
    let counter = 0;

    for (let i in currencyList) {
      if (counter++ === 100) {
        break;
      }

      bulkInsertArr.push({
        name: i,
        currency_id: currencyList[i],
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
