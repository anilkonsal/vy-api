'use strict'

module.exports = function(sequelize, DataTypes) {
  var Video = sequelize.define('Video', {
    path: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false }
  },
    {
      underscored: true,
      tableName: 'videos',
      paranoid: true
    })

  Video.associate = (models) => {
    Video.belongsTo(models.User)
  }
  return Video
}
