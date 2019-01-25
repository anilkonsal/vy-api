'use strict'

module.exports = {
  up: function(queryInterface, Sequelize) {
    const db = require('../models')
    return db.Video.sync()

  },
  down: function(queryInterface, Sequelize) {
    const db = require('../models')
    return queryInterface.dropTable(db.Video.tableName)
  }
}
