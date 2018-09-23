'use strict';

module.exports = {
  mapPriceAndCurrecny
};

async function mapPriceAndCurrecny (data) {
  const dataObj = {};

  data.forEach(element => {
    let key = element.dataValues.currency_id;
    if (!dataObj[key]) {
      dataObj[key] = +element.dataValues.price_usd;
    } else {
      dataObj[key] += +element.dataValues.price_usd;
    }
  });

  return dataObj;
}
