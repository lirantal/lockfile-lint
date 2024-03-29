/* eslint-disable no-new */
'use strict'

const ParseLockfile = require('../src/ParseLockfile')
const path = require('path')

describe('ParseLockfile v3 Npm', () => {
  it('parsing an npm lockfile returns an object with packages', () => {
    const mockNpmLockfilePath = path.join(__dirname, './__fixtures__/package-lock-v3.json')
    const options = {
      lockfilePath: mockNpmLockfilePath,
      lockfileType: 'npm'
    }
    const parser = new ParseLockfile(options)
    const lockfile = parser.parseSync()

    expect(lockfile.type).toEqual('success')
    expect(lockfile.object).toEqual(
      expect.objectContaining({
        '@ampproject/remapping@2.2.1-6896846cb1525fe356a0a09c28e387a034d364ab': expect.any(Object),
        'argparse@2.0.1-d71b6b43bc0d034f7b86d6d1149d6a43be13f2ed': expect.any(Object),
        'cliui@7.0.4-a26e875b912c887d1429fe2e16ed66bcbe362d61': expect.any(Object),
        'debug@4.3.4-c15d73814bfc58727435c213e23203e48f036cd9': expect.any(Object),
        'ms@2.1.2-d6934ce87f6e568c4f5d6d9f6e5c5697992e7b91': expect.any(Object)
      })
    )
  })

  it('parsing an npm lockfile with invalid content throws an error', () => {
    const mockNpmLockfilePath = path.join(__dirname, './__fixtures__/bad-package-lock-v3.json')
    const options = {
      lockfilePath: mockNpmLockfilePath,
      lockfileType: 'npm'
    }
    const parser = new ParseLockfile(options)
    expect(() => parser.parseSync()).toThrowError(
      `Unable to parse npm lockfile "${mockNpmLockfilePath}"`
    )
  })

  it('parsing an npm lockfile with no packages doesnt trigger an error', () => {
    const mockNpmLockfilePath = path.join(__dirname, './__fixtures__/package-lock-v3-empty.json')
    const options = {
      lockfilePath: mockNpmLockfilePath,
      lockfileType: 'npm'
    }
    const parser = new ParseLockfile(options)
    const lockfile = parser.parseSync()

    expect(lockfile.type).toEqual('success')
    expect(lockfile.object).toEqual({})
  })
})
