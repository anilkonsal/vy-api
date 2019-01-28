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

  const Video = require('../../../classes/Video');
  /** Handlers */
  function uploadVideo(req, res, next) {
    // validation rules
    const validationConstraints = {
      video: { presence: { allowEmpty: false } },
      thumb: { presence: { allowEmpty: false } },
      name: { presence: { allowEmpty: false } }
    }

    // validation checking
    const errors = VALIDATE(req.body, validationConstraints)

    if (errors) return res.status(400).json(errors)

    const attributes = VALIDATE.cleanAttributes(req.body, validationConstraints)
    const videoData = attributes.video.replace(/^data:([A-Za-z0-9-+/]+);base64,/, '');
    const thumbData = attributes.thumb.replace(/^data:([A-Za-z0-9-+/]+);base64,/, '');

    const videoObj = new Video;

    const params = {
      video: videoData,
      thumb: thumbData,
      name: attributes.name,
      userId: 1
    }

    // save video
    videoObj.save(params)
      .then(file => {
        res.json(file)
      }).catch(next)

  }

  function getVideos(req, res, next) {
    Video.getAll()
      .then(videos => {
        res.json(videos)
      }).catch(next)
  }

  function getVideo(req, res, next) {
    Video.get(req.params.id)
      .then(video => {
        res.json(video)
      }).catch(next)
  }

  return ROUTER
}
