'use strict';

module.exports = (sequelize, dataTypes) => {
  var UserAuth = sequelize.define('UserAuth', {
    id: {
      type: dataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    hash: {
      type: dataTypes.STRING(512),
      allowNull: false
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'user_auth',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  UserAuth.associate = function (models) {
    models.UserAuth.belongsTo(models.User, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
  };

  return UserAuth;
};
