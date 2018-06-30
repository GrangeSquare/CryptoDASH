'use strict';

module.exports = (sequelize, dataTypes) => {
  var CurrencyAmount = sequelize.define('CurrencyAmount', {
    id: {
      type: dataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    amount: {
      type: dataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'currency_amount',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  CurrencyAmount.associate = function (models) {
    models.CurrencyAmount.belongsTo(models.Currency, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
    models.CurrencyAmount.belongsTo(models.ExchangeWallet, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
  };

  return CurrencyAmount;
};
