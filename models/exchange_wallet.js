'use strict';

module.exports = (sequelize, dataTypes) => {
  var ExchangeWallet = sequelize.define('ExchangeWallet', {
    id: {
      type: dataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'exchange_wallet',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  ExchangeWallet.associate = function (models) {
    models.ExchangeWallet.belongsTo(models.User, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
    models.ExchangeWallet.belongsTo(models.Exchange, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
    models.ExchangeWallet.hasMany(models.CurrencyAmount, { foreignKey: {allowNull: false} });
    models.ExchangeWallet.hasOne(models.ExchangeWalletKey, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
  };

  return ExchangeWallet;
};
