/* eslint-disable no-new */
'use strict'

const ParseLockfile = require('../src/ParseLockfile')
const path = require('path')

describe('ParseLockfile Npm', () => {
  it('parsing an npm lockfile returns an object with packages', () => {
    const mockNpmLockfilePath = path.join(__dirname, './__fixtures__/package-lock.json')
    const options = {
      lockfilePath: mockNpmLockfilePath,
      lockfileType: 'npm'
    }
    const parser = new ParseLockfile(options)
    const lockfile = parser.parseSync()

    expect(lockfile.type).toEqual('success')
    expect(lockfile.object).toEqual(
      expect.objectContaining({
        'debug@4.1.1-031b0fadad70d901aa76ca1028682c7fc8ed370c': expect.any(Object),
        'ms@2.1.2-d6934ce87f6e568c4f5d6d9f6e5c5697992e7b91': expect.any(Object)
      })
    )
  })

  it('parsing an npm lockfile with nested deps returns an object with packages', () => {
    const mockNpmLockfilePath = path.join(__dirname, './__fixtures__/nested-package-lock.json')
    const options = {
      lockfilePath: mockNpmLockfilePath,
      lockfileType: 'npm'
    }
    const parser = new ParseLockfile(options)
    const lockfile = parser.parseSync()

    expect(lockfile.type).toEqual('success')
    expect(lockfile.object).toEqual(
      expect.objectContaining({
        'debug@4.1.1-031b0fadad70d901aa76ca1028682c7fc8ed370c': expect.any(Object),
        'ms@2.1.2-d6934ce87f6e568c4f5d6d9f6e5c5697992e7b91': expect.any(Object),
        'ms@2.0.0-e3988f0b9b049286d39bee2b87cda1737adf1ba7': expect.any(Object),
        'escape-html@1.0.3-541618a9ecf9b6e94c9131aec4590d01a5b0e720': expect.any(Object)
      })
    )
  })

  it('parsing an npm lockfile with invalid content throws an error', () => {
    const mockNpmLockfilePath = path.join(__dirname, './__fixtures__/bad-package-lock.json')
    const options = {
      lockfilePath: mockNpmLockfilePath,
      lockfileType: 'npm'
    }
    const parser = new ParseLockfile(options)
    expect(() => parser.parseSync()).toThrowError(
      `Unable to parse npm lockfile "${mockNpmLockfilePath}"`
    )
  })
})
