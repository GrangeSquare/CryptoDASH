'use strict';

module.exports = (sequelize, dataTypes) => {
  var Comment = sequelize.define('Comment', {
    id: {
      type: dataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    reply_id: {
      type: dataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    title: {
      type: dataTypes.STRING(64),
      allowNull: true
    },
    text: {
      type: dataTypes.STRING(64),
      allowNull: false
    },
    hashtag_id: {
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
    models.Comment.hasMany(models.Like, { foreignKey: { allowNull: false } });
  };
  return Comment;
};
