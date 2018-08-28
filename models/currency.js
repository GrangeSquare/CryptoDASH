'use strict';

module.exports = (sequelize, DataTypes) => {
  var Currency = sequelize.define('Currency', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    symbol: {
      type: DataTypes.STRING(128),
      unique: true,
      allowNull: false
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'currency',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  Currency.associate = function (models) {
    models.Currency.hasMany(models.CurrencyAmount);
    models.Currency.hasMany(models.Hashtag);
    models.Currency.hasMany(models.CoinTicker);
    models.Currency.hasMany(models.NewestTicker);
  };

  return Currency;
};
