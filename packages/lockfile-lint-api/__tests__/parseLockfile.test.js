/* eslint-disable no-new */
'use strict'

const ParseLockfile = require('../src/ParseLockfile')

describe('ParseLockfile', () => {
  it('instantiating a parser with invalid object throws an error', () => {
    expect(() => {
      new ParseLockfile()
    }).toThrowError('expecting options object')
  })

  it('instantiating a parser with string type throws an error', () => {
    expect(() => {
      new ParseLockfile('/path/to/file')
    }).toThrowError('expecting options object')
  })
})
