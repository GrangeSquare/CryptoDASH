'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const currencySource = require('../utils/currency_union')();
    const bulkInsertArr = [];
    let counter = 0;

    for (let i in currencySource) {
      if (counter++ === 100) {
        break;
      }

      bulkInsertArr.push({
        name: i,
        currency_id: currencySource[i].id,
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
