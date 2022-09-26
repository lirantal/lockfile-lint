/* eslint-disable no-new */
'use strict'

const ParseLockfile = require('../src/ParseLockfile')

describe('ParseLockfile', () => {
  it('instantiating a parser correctly works', () => {
    expect(() => {
      new ParseLockfile({lockfilePath: '/path/to/file', lockfileType: 'npm'})
    }).not.toThrowError()
  })

  it('instantiating a parser with invalid object throws an error', () => {
    expect(() => {
      new ParseLockfile()
    }).toThrowError('Did not receive options for lockfile or type')
  })

  it('instantiating a parser with string type throws an error', () => {
    expect(() => {
      new ParseLockfile('/path/to/file')
    }).toThrowError('Did not receive options for lockfile or type')
  })

  it('instantiating a parser with inadequate options object throws an error', () => {
    expect(() => {
      new ParseLockfile({})
    }).toThrowError('Did not receive lockfile path or text')
  })

  it('using a parser with an invalid option type throws an error', () => {
    const parser = new ParseLockfile({lockfilePath: '/path/to/file', lockfileType: 'meow'})
    expect(() => {
      parser.parseSync()
    }).toThrowError(
      'Unable to find relevant lockfile parser for type "meow", the currently available options are npm,yarn.'
    )
  })

  it('using a parser with a path option for a lockfile of unknown type throws an error', () => {
    const parser = new ParseLockfile({lockfilePath: '/path/to/file'})
    expect(() => {
      parser.parseSync()
    }).toThrowError(
      'Unable to find relevant lockfile parser for "/path/to/file", consider passing the --type option.'
    )
  })

  it('using a parser with a path option for a lockfile that does not exist throws an error', () => {
    const parser = new ParseLockfile({lockfilePath: '/path/to/file', lockfileType: 'yarn'})
    expect(() => {
      parser.parseSync()
    }).toThrowError('Unable to read lockfile "/path/to/file"')
  })
})
