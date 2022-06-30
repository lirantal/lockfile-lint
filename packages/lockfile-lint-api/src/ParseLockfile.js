// @ts-check
/* eslint-disable security/detect-object-injection */
'use strict'

const path = require('path')
const yarnParseSyml = require('@yarnpkg/parsers').parseSyml
const hash = require('object-hash')
const {ParsingError, ERROR_MESSAGES} = require('./common/ParsingError')
const {
  NO_OPTIONS,
  NO_LOCKFILE,
  NO_PARSER_FOR_PATH,
  NO_PARSER_FOR_TYPE,
  READ_FAILED,
  PARSE_NPMLOCKFILE_FAILED,
  PARSE_YARNLOCKFILE_FAILED
} = ERROR_MESSAGES

/**
 * Checks if a sample object is a valid dependency structure
 * @return boolean
 */
function checkSampleContent (lockfile) {
  const [sampleKey, sampleValue] = Object.entries(lockfile)[0]
  return (
    sampleKey.match(/.*@.*/) &&
    (sampleValue &&
      typeof sampleValue === 'object' &&
      sampleValue.hasOwnProperty('version') &&
      sampleValue.hasOwnProperty('resolved'))
  )
}
/**
 * @param {string|Buffer} lockfileBuffer - the lockfile contents
 * @return {{ type: string, object: any }}
 */
function yarnParseAndVerify (lockfileBuffer) {
  const lockfile = yarnParseSyml(lockfileBuffer.toString())
  const hasSensibleContent =
    lockfile && typeof lockfile === 'object' && checkSampleContent(lockfile)
  if (!hasSensibleContent) {
    throw Error('Lockfile does not seem to contain a valid dependency list')
  }
  return {type: 'success', object: lockfile}
}
class ParseLockfile {
  /**
   * constructor
   * @param {object} options
   * @param {string} [options.lockfilePath] - path to the lockfile
   * @param {string} [options.lockfileText] - utf-8 string content of the lockfile
   * @param {string} options.lockfileType - the package manager type
   * for lockfile
   */
  constructor (options) {
    if (!options || typeof options !== 'object') {
      throw new ParsingError(NO_OPTIONS)
    }
    if (!options.lockfilePath && !options.lockfileText) {
      throw new ParsingError(NO_LOCKFILE)
    }

    this.options = {}
    this.options.lockfilePath = options.lockfilePath
    this.options.lockfileText = options.lockfileText
    this.options.lockfileType = options.lockfileType
  }

  /**
   * Checks if lockfile type option was provided
   * @return boolean
   */
  isLockfileTypeGiven () {
    return typeof this.options.lockfileType === 'string' && this.options.lockfileType
  }

  /**
   * Synchronously parses a lockfile
   * @return {object} parsed file
   */
  parseSync () {
    const lockfileParser = this.resolvePkgMgrForLockfile()
    if (!lockfileParser) {
      if (this.isLockfileTypeGiven()) {
        throw new ParsingError(NO_PARSER_FOR_TYPE, this.options.lockfileType)
      }
      throw new ParsingError(NO_PARSER_FOR_PATH, this.options.lockfilePath)
    }

    let file
    if (this.options.lockfileText) {
      file = this.options.lockfileText
    } else {
      try {
        const fs = require('fs')
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        file = fs.readFileSync(this.options.lockfilePath, 'utf-8')
      } catch (error) {
        throw new ParsingError(READ_FAILED, this.options.lockfilePath, error)
      }
    }

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
    if (this.isLockfileTypeGiven()) {
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
    let parsedFile
    try {
      parsedFile = yarnParseAndVerify(lockfileBuffer)
    } catch (error) {
      throw new ParsingError(PARSE_YARNLOCKFILE_FAILED, this.options.lockfilePath, error)
    }
    return parsedFile
  }

  parseNpmLockfile (lockfileBuffer) {
    let flattenedDepTree
    try {
      const packageJsonParsed = JSON.parse(lockfileBuffer)

      // transform original format of npm's package-json to match yarns
      // so we have a unified format to validate against
      const npmDepsTree = packageJsonParsed.dependencies
      flattenedDepTree = npmDepsTree ? this._flattenNpmDepsTree(npmDepsTree) : {}
    } catch (error) {
      throw new ParsingError(PARSE_NPMLOCKFILE_FAILED, this.options.lockfilePath, error)
    }

    return {
      type: 'success',
      object: flattenedDepTree
    }
  }

  _flattenNpmDepsTree (npmDepsTree, npmDepMap = {}) {
    for (const [depName, depMetadata] of Object.entries(npmDepsTree)) {
      const depMetadataShortend = {
        version: depMetadata.version,
        resolved: depMetadata.resolved ? depMetadata.resolved : depMetadata.version,
        integrity: depMetadata.integrity,
        requires: depMetadata.requires
      }
      const hashedDepValues = hash(depMetadataShortend)

      npmDepMap[`${depName}@${depMetadata.version}-${hashedDepValues}`] = depMetadataShortend

      const nestedDepsTree = depMetadata.dependencies

      if (nestedDepsTree && Object.keys(nestedDepsTree).length !== 0) {
        this._flattenNpmDepsTree(nestedDepsTree, npmDepMap)
      }
    }

    return npmDepMap
  }
}

module.exports = ParseLockfile
