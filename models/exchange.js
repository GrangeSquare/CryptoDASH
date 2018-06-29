'use strict';

module.exports = (sequelize, dataTypes) => {
  var Exchange = sequelize.define('Exchange', {
    id: {
      type: dataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: dataTypes.STRING(64),
      allowNull: false
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'exchange',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  Exchange.associate = function (models) {
    models.Exchange.hasMany(models.ExchangeWallet, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Exchange;
};
