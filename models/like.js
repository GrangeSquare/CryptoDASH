'use strict';

module.exports = (sequelize, DataTypes) => {
  var Like = sequelize.define('Like', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    comment_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(64),
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
    models.Like.belongsTo(models.User, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
    models.Like.belongsTo(models.Comment || models.CommentReply, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Like;
};
