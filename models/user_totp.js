'use strict';

module.exports = (sequelize, dataTypes) => {
  var UserTotp = sequelize.define('UserTotp', {
    id: {
      type: dataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    secret: {
      type: dataTypes.STRING(512),
      allowNull: false
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'user_totp',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  UserTotp.associate = function (models) {
    models.UserTotp.belongsTo(models.User, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
  };
  return UserTotp;
};
