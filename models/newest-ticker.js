'use strict';

module.exports = (sequelize, dataTypes) => {
  var CoinTicker = sequelize.define('NewestTicker', {
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
    change_24h: {
      type: dataTypes.DOUBLE,
      allowNull: true
    },
    currency_id: {
      type: dataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    date: {
      allowNull: false,
      type: dataTypes.DATE
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'newest_ticker',
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
