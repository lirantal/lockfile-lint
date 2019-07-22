'use strict'

const fs = require('fs')
const path = require('path')
const app = require('../index')

describe('Validators', () => {
  describe('library should export available validators', () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const files = fs.readdirSync(path.join(__dirname, '../src/validators'))

    files.forEach(fileName => {
      it(`validator ${fileName} should be available in index.js`, () => {
        const className = path.basename(fileName, '.js')
        expect(app).toHaveProperty(className)
      })
    })
  })
})

describe('Utils', () => {
  it('library should export ParseLockFile util', () => {
    expect(app).toHaveProperty('ParseLockfile')
  })
})
