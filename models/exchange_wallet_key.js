'use strict';

module.exports = (sequelize, dataTypes) => {
  var ExchangeWalletKey = sequelize.define('ExchangeWalletKey', {
    id: {
      type: dataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    public_key: {
      type: dataTypes.STRING(512),
      allowNull: false
    },
    private_key: {
      type: dataTypes.STRING(512),
      allowNull: false
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'exchange_wallet_key',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  ExchangeWalletKey.associate = function (models) {
    models.ExchangeWalletKey.belongsTo(models.ExchangeWallet, { foreignKey: {allowNull: false} });
  };

  return ExchangeWalletKey;
};
