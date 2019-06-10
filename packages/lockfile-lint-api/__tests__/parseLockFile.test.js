/* eslint-disable no-new */
'use strict'

const ParseLockFile = require('../src/ParseLockFile')
const path = require('path')

describe('ParseLockFile', () => {
  it('instantiating a parser with invalid object throws an error', () => {
    expect(() => {
      new ParseLockFile()
    }).toThrowError('expecting options object')
  })

  it('instantiating a parser with string type throws an error', () => {
    expect(() => {
      new ParseLockFile('/path/to/file')
    }).toThrowError('expecting options object')
  })

  it('parsing a yarn lockfile returns an object with packages', () => {
    const mockYarnLockFilePath = path.join(__dirname, './__fixtures__/yarn.lock')
    const options = {
      lockFilePath: mockYarnLockFilePath
    }
    const parser = new ParseLockFile(options)
    const lockfile = parser.parseSync()

    expect(lockfile.type).toEqual('success')
    expect(lockfile.object).toEqual(
      expect.objectContaining({
        'debug@^4.1.1': expect.any(Object),
        'ms@^2.1.1': expect.any(Object)
      })
    )
  })
})
