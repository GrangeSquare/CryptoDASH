'use strict';

module.exports = (sequelize, dataTypes) => {
  var Hashtag = sequelize.define('Hashtag', {
    id: {
      type: dataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: dataTypes.STRING(64),
      allowNull: false
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'hashtag',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  Hashtag.associate = function (models) {
    models.Hashtag.hasMany(models.CountHashtag, { foreignKey: { allowNull: false } });
  };
  return Hashtag;
};
