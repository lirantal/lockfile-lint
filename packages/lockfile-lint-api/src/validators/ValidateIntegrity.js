'use strict'

function isSha512 (packageMetadata) {
  return packageMetadata.integrity.split('-')[0] === 'sha512'
}

module.exports = class ValidateIntegrity {
  constructor ({packages} = {}) {
    if (typeof packages !== 'object') {
      throw new Error('expecting an object passed to validator constructor')
    }

    this.packages = packages
  }

  validate () {
    let validationResult = {
      type: 'success',
      errors: []
    }

    for (const [packageName, packageMetadata] of Object.entries(this.packages)) {
      if (!('integrity' in packageMetadata)) {
        continue
      }

      try {
        if (!isSha512(packageMetadata)) {
          validationResult.errors.push({
            message: `detected invalid integrity hash type for package: ${packageName}\n    expected: sha512\n    actual: ${
              packageMetadata.integrity
            }\n`,
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

  validateSingle (packageName) {
    // eslint-disable-next-line security/detect-object-injection
    const packageMetadata = this.packages[packageName]
    if (!('integrity' in packageMetadata)) {
      return true
    }

    return isSha512(packageMetadata)
  }
}
