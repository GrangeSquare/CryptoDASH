'use strict';

module.exports = (sequelize, dataTypes) => {
  var CountHashtag = sequelize.define('CountHashtag', {
    id: {
      type: dataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    count: {
      type: dataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    hashtag_id: {
      type: dataTypes.BIGINT.UNSIGNED,
      allowNull: true
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'count_hashtag',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  CountHashtag.associate = function (models) {
    models.CountHashtag.belongsTo(models.Hashtag, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
  };
  return CountHashtag;
};
