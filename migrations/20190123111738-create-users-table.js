'use strict'

module.exports = {
  up: function(queryInterface, Sequelize) {
    const db = require('../models')
    return db.User.sync().then(() => {
      return db.User.create({
        first_name: 'System',
        last_name: 'Admin',
        email: 'sysadmin@example.com',
        role: 'SYSADMIN'
      })
    }).catch(e => {
      throw new Error(e)
    })
  },
  down: function(queryInterface, Sequelize) {
    const db = require('../models')
    return queryInterface.dropTable(db.User.tableName)
  }
}
