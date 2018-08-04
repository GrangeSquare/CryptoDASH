'use strict';

module.exports = (sequelize, DataTypes) => {
  var CommentReply = sequelize.define('CommentReply', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    text: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    likes: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: 0
    },
    comment_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'comment_reply',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  CommentReply.associate = function (models) {
    models.Comment.belongsTo(models.User, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
    models.CommentReply.belongsTo(models.Comment, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
    models.CommentReply.hasMany(models.Like, { foreignKey: { allowNull: false } });
  };

  return CommentReply;
};
