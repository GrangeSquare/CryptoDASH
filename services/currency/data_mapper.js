'use strict';

module.exports = {
  mapPriceAndCurrecny
};

function mapPriceAndCurrecny (data) {
  const dataObj = {};

  data.forEach(element => {
    let key = element.dataValues.Currency.dataValues.symbol;
    if (!dataObj[key]) {
      dataObj[key] = +element.dataValues.price_usd;
    } else {
      dataObj[key] += +element.dataValues.price_usd;
    }
  });

  return dataObj;
}
