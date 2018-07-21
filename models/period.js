'use strict';

module.exports = (sequelize, DataTypes) => {
  var Period = sequelize.define('Period', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    period: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'period_repetition',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  Period.associate = function (models) {
    models.Period.hasOne(models.Repetition, { foreignKey: { allowNull: false } });
  };

  return Period;
};
