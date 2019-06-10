'use strict'

const fs = require('fs')
const yarnLockFileParser = require('@yarnpkg/lockfile')

class ParseLockFile {
  constructor (options) {
    if (!options || typeof options !== 'object') {
      throw new Error('expecting options object')
    }

    this.lockFilePath = options.lockFilePath
  }

  parseSync () {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const file = fs.readFileSync(this.lockFilePath, 'utf8')
    return yarnLockFileParser.parse(file)
  }
}

module.exports = ParseLockFile
