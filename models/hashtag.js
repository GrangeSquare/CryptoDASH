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
      allowNull: true
    },
    currency_id: {
      type: dataTypes.BIGINT.UNSIGNED,
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
    models.Hashtag.belongsTo(models.Currency, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
    models.Hashtag.hasMany(models.HashtagCounter, { foreignKey: { allowNull: false } });
  };

  return Hashtag;
};
