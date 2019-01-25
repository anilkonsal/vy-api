const ROUTER = require('express').Router()
const FS = require('fs')
const PATH = require('path');

module.exports = (db, logger) => {
  /** Routes */
  ROUTER.post('/', uploadVideo)
  ROUTER.get('/:id', getVideo)
  ROUTER.get('/', getVideos)

  /** Additional packages */
  const CRYPTO = require('crypto');
  const VALIDATE = require('validate.js')


  /** Handlers */
  function uploadVideo(req, res, next) {
    const validationConstraints = {
      file: { presence: { allowEmpty: false } },
      name: { presence: { allowEmpty: false } }
    }

    const errors = VALIDATE(req.body, validationConstraints)
    if (errors) return res.status(400).json(errors)

    const attributes = VALIDATE.cleanAttributes(req.body, validationConstraints)

    const base64Data = req.body.file.replace(/^data:([A-Za-z-+/]+);base64,/, '');

    FS.writeFile(`/Users/anilkonsal/code/personal/vt/api/public/uploads/${attributes.name}`, base64Data, 'base64', (err) => {

      if (err) {
        return next({ status: 500, message: 'Something broke' })
      }

      return db.Video.create({
        path: attributes.name,
        user_id: 1,
        name: attributes.name,
      }).then(file => {
        res.json(file)
      })
    })


  }

  function getVideos(req, res, next) {
    db.Video.findAll({
      where: { user_id: 1 },
      order: [['id', 'desc']]
    }).then(videos => {
      res.json(videos)
    })
  }

  function getVideo(req, res, next) {
    logger.info('hello')
    res.json({ 'msg': 'get video' })
  }

  return ROUTER
}
