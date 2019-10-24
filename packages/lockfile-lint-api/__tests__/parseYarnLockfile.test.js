/* eslint-disable no-new */
'use strict'

const ParseLockfile = require('../src/ParseLockfile')
const path = require('path')

describe('ParseLockfile Yarn', () => {
  it('parsing a yarn lockfile returns an object with packages', () => {
    const mockYarnLockfilePath = path.join(__dirname, './__fixtures__/yarn.lock')
    const options = {
      lockfilePath: mockYarnLockfilePath
    }
    const parser = new ParseLockfile(options)
    const lockfile = parser.parseSync()

    // console.log(lockfile)

    expect(lockfile.type).toEqual('success')
    expect(lockfile.object).toEqual(
      expect.objectContaining({
        'debug@^4.1.1': expect.any(Object),
        'ms@^2.1.1': expect.any(Object)
      })
    )
  })

  it('parsing a yarn lockfile with invalid content throws an error', () => {
    const mockYarnLockfilePath = path.join(__dirname, './__fixtures__/bad-yarn.lock')
    const options = {
      lockfilePath: mockYarnLockfilePath,
      lockfileType: 'yarn'
    }
    const parser = new ParseLockfile(options)
    expect(() => parser.parseSync()).toThrowError(
      `Unable to parse yarn lockfile "${mockYarnLockfilePath}"`
    )
  })
})
