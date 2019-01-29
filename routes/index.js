const ROUTER = require('express').Router();

module.exports = (db, logger) => {
  ROUTER.use('/v1', require('./v1')(db, logger));

  return ROUTER;
}
