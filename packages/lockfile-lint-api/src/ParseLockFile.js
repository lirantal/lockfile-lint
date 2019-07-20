/* eslint-disable security/detect-object-injection */
'use strict'

const fs = require('fs')
const path = require('path')
const yarnLockfileParser = require('@yarnpkg/lockfile')

class ParseLockfile {
  /**
   * constructor
   * @param {string} options.lockfilePath - path to the lockfile
   * @param {string} options.lockfileType - the package manager type
   * for lockfile
   */
  constructor (options) {
    if (!options || typeof options !== 'object') {
      throw new Error('expecting options object')
    }

    this.options = {}
    this.options.lockfilePath = options.lockfilePath
    this.options.lockfileType = options.lockfileType
  }

  /**
   * Synchronously parses a lockfile
   * @return {object} parsed file
   */
  parseSync () {
    const lockfileParser = this.resolvePkgMgrForLockfile()
    if (!lockfileParser) {
      throw new Error('unable to find relevant lockfile parser')
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const file = fs.readFileSync(this.options.lockfilePath, 'utf8')
    return lockfileParser(file)
  }

  resolvePkgMgrForLockfile () {
    const lockfileResolversByPackageManager = {
      npm: this.parseNpmLockfile,
      npmjs: this.parseNpmLockfile,
      yarn: this.parseYarnLockfile,
      yarnpkg: this.parseYarnLockfile
    }

    let resolver
    if (typeof this.options.lockfileType === 'string' && this.options.lockfileType) {
      resolver = lockfileResolversByPackageManager[this.options.lockfileType]
    }

    if (!resolver) {
      resolver = this.resolvePkgMgrByFilename()
    }

    return resolver
  }

  resolvePkgMgrByFilename () {
    const lockfileResolverByFilename = {
      'package-lock.json': this.parseNpmLockfile,
      'yarn.lock': this.parseYarnLockfile
    }

    const pathInfo = path.parse(this.options.lockfilePath)
    const baseFilename = pathInfo.base

    return lockfileResolverByFilename[baseFilename]
  }

  parseYarnLockfile (file) {
    return yarnLockfileParser.parse(file)
  }

  // @TODO
  parseNpmLockfile () {}
}

module.exports = ParseLockfile
