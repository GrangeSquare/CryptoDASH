'use strict';

module.exports = (sequelize, DataTypes) => {
  var Repetition = sequelize.define('Repetition', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    repetition: {
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

  Repetition.associate = function (models) {
    models.Repetition.belongsTo(models.Period, {
      onDelete: 'CASCADE', // todo: FK is on delete 'set null', and column is null
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Repetition;
};
