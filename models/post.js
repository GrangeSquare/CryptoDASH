'use strict';

module.exports = (sequelize, dataTypes) => {
  var Post = sequelize.define('Post', {
    id: {
      type: dataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    id_post: {
      type: dataTypes.STRING(64),
      allowNull: false
    },
    text: {
      type: dataTypes.STRING(64),
      allowNull: true
    },
    type: {
      type: dataTypes.STRING(64),
      allowNull: false
    },
    url: {
      type: dataTypes.STRING(64),
      allowNull: false
    },
    network_id: {
      type: dataTypes.BIGINT.UNSIGNED,
      allowNull: false
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'post',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  Post.associate = function (models) {
    models.Post.belongsTo(models.Network, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Post;
};
