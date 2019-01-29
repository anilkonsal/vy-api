const FS = require('fs')
const PATH = require('path');
const db = require('../models')

class Video {
  constructor() {
    this.path = PATH.resolve(__dirname, '../public/uploads');
  }

  /**
   * 
   * @param name string 
   * @param data base64 
   * @param userId integer
   * @returns Promise 
   */
  save({ name, video, thumb, userId }) {
    return new Promise((resolve, reject) => {

      if (!FS.existsSync(this.path)) {
        reject('ERROR_PATH: Path does not exist')
      }

      FS.writeFile(PATH.resolve(this.path, name), video, 'base64', (err) => {

        if (err) {
          reject(`ERROR_FWRITE: ${err}`)
        }

        FS.writeFile(PATH.resolve(this.path, `${name}.jpg`), thumb, 'base64', (err) => {

          if (err) {
            reject(`ERROR_FWRITE: ${err}`)
          }

          return db.Video.create({
            path: name,
            user_id: userId,
            name: name,
          }).then(video => {
            resolve(video)
          }).catch(e => {
            reject(e)
          })
        })
      })
    })
  }



  /**
   * 
   * @returns Array
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      db.Video.findAll({
        where: { user_id: 1 },
        order: [['id', 'desc']]
      }).then(videos => {
        resolve(videos)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * @param id integer
   * @returns object
   */
  static get(id) {
    return new Promise((resolve, reject) => {
      db.Video.findByPk(id).then(video => {

        if (!video) {
          reject('404 | Video not found')
        }

        resolve(video)
      }).catch(e => {
        reject(e)
      })
    })
  }
}

module.exports = Video