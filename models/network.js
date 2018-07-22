'use strict';

module.exports = (sequelize, DataTypes) => {
  var Network = sequelize.define('Network', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'network',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  Network.associate = function (models) {
    models.Network.hasMany(models.Post, { foreignKey: { allowNull: false } });
  };

  return Network;
};
