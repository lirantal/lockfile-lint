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
    return lockfileParser.call(this, file)
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

  parseYarnLockfile (lockfileBuffer) {
    return yarnLockfileParser.parse(lockfileBuffer)
  }

  parseNpmLockfile (lockfileBuffer) {
    const packageJsonParsed = JSON.parse(lockfileBuffer)

    // transform original format of npm's package-json
    // to match yarns so we have a unified format to validate
    // against
    const npmDepsTree = packageJsonParsed.dependencies
    const flattenedDepTree = this._flattenNpmDepsTree(npmDepsTree)

    return {
      type: 'success',
      object: flattenedDepTree
    }
  }

  _flattenNpmDepsTree (npmDepsTree) {
    let flattenedDepTree = {}
    let flattenedNestedDepsTree = {}
    for (const [depName, depMetadata] of Object.entries(npmDepsTree)) {
      const depMetadataShortend = {
        version: depMetadata.version,
        resolved: depMetadata.resolved ? depMetadata.resolved : depMetadata.version,
        integrity: depMetadata.integrity,
        requires: depMetadata.requires
      }

      flattenedDepTree[`${depName}@${depMetadata.version}`] = depMetadataShortend

      const nestedDepsTree = depMetadata.dependencies
      if (nestedDepsTree && Object.keys(nestedDepsTree).length !== 0) {
        flattenedNestedDepsTree = this._flattenNpmDepsTree(nestedDepsTree)
      }
    }

    return Object.assign({}, flattenedDepTree, flattenedNestedDepsTree)
  }
}

module.exports = ParseLockfile
