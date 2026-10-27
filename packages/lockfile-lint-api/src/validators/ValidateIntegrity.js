'use strict'

const YARN_BERRY_STRICT_ERROR =
  '--validate-integrity-strict does not support Yarn Berry lockfiles (which use "checksum" instead of "integrity").'

function isSha512 (packageMetadata) {
  return packageMetadata.integrity.split('-')[0] === 'sha512'
}

const {isIntegrityExempt, hasStrictIntegrity} = require('../common/IntegrityPolicy')

module.exports = class ValidateIntegrity {
  constructor ({packages, format} = {}) {
    if (typeof packages !== 'object') {
      throw new Error('expecting an object passed to validator constructor')
    }

    this.packages = packages
    this.format = format
  }

  validate (options) {
    if (options && options.integrityStrict && this.format === 'yarn-berry') {
      return {
        type: 'error',
        errors: [{message: YARN_BERRY_STRICT_ERROR, unsupportedFormat: true}]
      }
    }
    const excludedPackages = options && options.integrityExclude ? options.integrityExclude : []
    if (!Array.isArray(excludedPackages)) {
      throw new Error('excluded packages must be an array')
    }

    const validationResult = {
      type: 'success',
      errors: []
    }

    for (const [packageName, packageMetadata] of Object.entries(this.packages)) {
      if (options && options.integrityStrict) {
        if (
          excludedPackages.some(name => packageName.startsWith(`${name}@`)) ||
          isIntegrityExempt(packageMetadata)
        ) {
          continue
        }
        if (!hasStrictIntegrity(packageMetadata)) {
          const reason =
            packageMetadata.integrity == null || packageMetadata.integrity === ''
              ? 'missing integrity'
              : 'invalid integrity'
          validationResult.errors.push({
            message: `detected ${reason} for package: ${packageName}\n    expected: a complete sha512 integrity hash\n`,
            package: packageName
          })
        }
        continue
      }

      if (!('integrity' in packageMetadata)) {
        continue
      }

      if (excludedPackages.find(name => packageName.startsWith(`${name}@`))) {
        continue
      }

      try {
        if (!isSha512(packageMetadata)) {
          validationResult.errors.push({
            message: `detected invalid integrity hash type for package: ${packageName}\n    expected: sha512\n    actual: ${packageMetadata.integrity}\n`,
            package: packageName
          })
        }
      } catch (error) {
        // swallow error (assume that the integrity is valid)
      }
    }

    if (validationResult.errors.length !== 0) {
      validationResult.type = 'error'
    }

    return validationResult
  }

  validateSingle (packageName, options) {
    // eslint-disable-next-line security/detect-object-injection
    const packageMetadata = this.packages[packageName]
    if (options && options.integrityStrict) {
      if (this.format === 'yarn-berry') {
        throw Object.assign(new Error(YARN_BERRY_STRICT_ERROR), {unsupportedFormat: true})
      }
      return isIntegrityExempt(packageMetadata) || hasStrictIntegrity(packageMetadata)
    }
    if (!('integrity' in packageMetadata)) {
      return true
    }

    return isSha512(packageMetadata)
  }
}
