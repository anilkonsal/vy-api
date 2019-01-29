const db = require('../../models')
const FS = require('fs')
const Video = require('../../classes/Video')




describe('Video Class', () => {
  describe('save', () => {
    let mockFsWriteFile;

    beforeAll(() => {
      FS.existsSync = jest.fn().mockReturnValue(true);
    })
    beforeEach(() => {
      mockFsWriteFile = jest.spyOn(FS, 'writeFile');
    });
    afterEach(() => {
      mockFsWriteFile.mockReset();
    });


    test('should resolve file when success', () => {
      mockFsWriteFile.mockImplementation((p, d, callBack) => callBack());
      const expected = [{ name: 'test', path: 'test', userId: 1 }]
      db.Video.create = jest.fn().mockResolvedValue(expected)
      const video = new Video();
      const params = {
        name: 'test',
        video: 'test',
        thumb: 'test',
        userId: 1
      };
      video.save(params)
        .then(video => {
          expect(mockFsWriteFile).toHaveBeenCalledTimes(1)

        }).catch(e => {
          console.error(e)
        })
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
