'use strict';

module.exports = (sequelize, dataTypes) => {
  var CoinData = sequelize.define('CoinData', {
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
    tableName: 'coin_data',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  CoinData.associate = function (models) {
    models.CoinData.belongsTo(models.Currency, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return CoinData;
};
