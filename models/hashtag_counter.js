'use strict';

module.exports = (sequelize, dataTypes) => {
  var HashtagCounter = sequelize.define('HashtagCounter', {
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
      allowNull: false
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'hashtag_counter',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  HashtagCounter.associate = function (models) {
    models.HashtagCounter.belongsTo(models.Hashtag, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
  };

  return HashtagCounter;
};
