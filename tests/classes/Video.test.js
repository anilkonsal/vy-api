const db = require('../../models')
const FS = require('fs')
const Video = require('../../classes/Video')

jest.mock('../../models', () => {
  return {
    Video: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn()
    }
  }
});


describe('Video Class', () => {
  describe('save', () => {
    let mockFsWriteFile;
    const params = {
      name: 'test',
      video: 'test',
      thumb: 'test',
      userId: 1
    };
    beforeAll(() => {
      FS.existsSync = jest.fn().mockReturnValue(true);
    })
    beforeEach(() => {
      mockFsWriteFile = jest.spyOn(FS, 'writeFile');
      mockFsWriteFile.mockImplementation((p, d, e, callBack) => callBack());
    });
    afterEach(() => {
      mockFsWriteFile.mockReset();
    });


    test('should resolve file when success', () => {
      const expected = [{ name: 'test', path: 'test', userId: 10 }]
      db.Video.create = jest.fn().mockResolvedValue(expected)
      const video = new Video();
      video.save(params)
        .then(video => {
          expect(mockFsWriteFile).toHaveBeenCalledTimes(2)
          expect(db.Video.create).toHaveBeenCalledTimes(1)
          expect(video).toEqual(expected)
        }).catch(e => {
          console.error(e)
        })
    })

    test('should reject with "error"', () => {
      const expected = 'error'
      db.Video.create = jest.fn().mockRejectedValue(expected)
      const video = new Video();
      video.save(params)
        .catch(e => {
          expect(mockFsWriteFile).toHaveBeenCalledTimes(2)
          expect(db.Video.create).toHaveBeenCalledTimes(1)
          expect(e).toEqual(expected)
        })
    })

    test('should reject with "ERROR_PATH: Path does not exist"', () => {
      FS.existsSync = jest.fn().mockReturnValue(false);
      const expected = 'ERROR_PATH: Path does not exist'
      db.Video.create = jest.fn().mockRejectedValue('error')
      const video = new Video();
      video.save(params)
        .catch(e => {
          expect(e).toEqual(expected)
        })
    })

    test('should reject with "ERROR_FWRITE: error"', () => {
      FS.existsSync = jest.fn().mockReturnValue(true);
      mockFsWriteFile.mockImplementation((p, d, e, callBack) => callBack('error'));
      const expected = 'ERROR_FWRITE: error'
      db.Video.create = jest.fn().mockRejectedValue('error')
      const video = new Video();
      video.save(params)
        .catch(e => {
          expect(e).toEqual(expected)
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
