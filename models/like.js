'use strict';

module.exports = (sequelize, dataTypes) => {
  var Like = sequelize.define('Like', {
    id: {
      type: dataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    comment_id: {
      type: dataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    user_id: {
      type: dataTypes.BIGINT.UNSIGNED,
      allowNull: false
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'like',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  Like.associate = function (models) {
    models.Like.belongsTo(models.Comment, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
    models.Like.belongsTo(models.User, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Like;
};
