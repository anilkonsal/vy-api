const db = require('../../models')
const FS = require('fs')
const Video = require('../../classes/Video')




describe('Video Class', () => {
  describe('save', () => {
    beforeAll(() => {
      FS.writeFile = jest.fn()
    })

    test('should resolve file when success', () => {

    })

    test('should reject when failure', () => {

    })

  })

  describe('getAll', () => {
    test('should return an array of objects', () => {
      const expected = [{ name: 'test', path: 'test' }]
      db.Video.findAll = jest.fn().mockResolvedValue(expected)
      return Video.getAll().then(v => {
        expect(v).toEqual(expected)
      })
    })
    test('should return an error', () => {
      const error = 'Hello Error'
      db.Video.findAll = jest.fn().mockRejectedValue(error)
      return Video.getAll().catch(e => {
        expect(e).toEqual(error)
      })
    })
  })

  describe('get', () => {
    test('should return an one object', () => {
      const expected = { name: 'test', path: 'test' }
      db.Video.findByPk = jest.fn().mockResolvedValue(expected)
      return Video.get(1).then(v => {
        expect(v).toEqual(expected)
      })
    })
    test('should return an error', () => {
      const error = 'Hello Error'
      db.Video.findByPk = jest.fn().mockRejectedValue(error)
      return Video.get(1).catch(e => {
        expect(e).toEqual(error)
      })
    })
  })

})
