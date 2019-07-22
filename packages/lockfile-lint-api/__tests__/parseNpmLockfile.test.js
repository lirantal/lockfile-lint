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
        'debug@4.1.1': expect.any(Object),
        'ms@2.1.2': expect.any(Object)
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
        'debug@4.1.1': expect.any(Object),
        'ms@2.1.2': expect.any(Object),
        'ms@2.0.0': expect.any(Object),
        'escape-html@1.0.3': expect.any(Object)
      })
    )
  })
})
