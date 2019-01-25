const ROUTER = require('express').Router()

module.exports = (db, logger) => {
  ROUTER.use('/videos', require('./videos')(db, logger))


  return ROUTER
}
