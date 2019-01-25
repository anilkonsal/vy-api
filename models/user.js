'use strict'

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM,
      values: ['SYSADMIN', 'USER'],
      allowNull: false,
      defaultValue: 'USER'
    },
  },
    {
      underscored: true,
      tableName: 'users',
      paranoid: true
    })

  return User
}
