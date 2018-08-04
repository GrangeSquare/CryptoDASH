'use strict';

module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define('Comment', {
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
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    hashtag_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'comment',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  Comment.associate = function (models) {
    models.Comment.belongsTo(models.Hashtag, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
    models.Comment.belongsTo(models.User, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
    models.Comment.hasMany(models.CommentReply, { foreignKey: { allowNull: false } });
    models.Comment.hasMany(models.Like, { foreignKey: { allowNull: false } });
  };

  return Comment;
};
