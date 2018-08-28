'use strict';

module.exports = (sequelize, dataTypes) => {
  var CoinTicker = sequelize.define('CoinTicker', {
    id: {
      type: dataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    price_usd: {
      type: dataTypes.DOUBLE,
      allowNull: true
    },
    price_eth: {
      type: dataTypes.DOUBLE,
      allowNull: true
    },
    price_btc: {
      type: dataTypes.DOUBLE,
      allowNull: true
    },
    market_cap: {
      type: dataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    daily_volume: {
      type: dataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    currency_id: {
      type: dataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    date: {
      allowNull: false,
      type: dataTypes.DATE
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'coin_ticker',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  CoinTicker.associate = function (models) {
    models.CoinTicker.belongsTo(models.Currency, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return CoinTicker;
};
