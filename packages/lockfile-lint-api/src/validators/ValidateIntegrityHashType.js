'use strict'

module.exports = class ValidateIntegrityHashType {
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
        const isPassing = packageMetadata.integrity.split('-')[0] === 'sha512'
        if (!isPassing) {
          validationResult.errors.push({
            message: `detected invalid integrity hash type for package: ${packageName}\n    expected: sha512\n    actual: ${
              packageMetadata.integrity
            }\n`,
            package: packageName
          })
        }
      } catch (error) {
        // swallow error (assume that the version is correct)
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

    return packageMetadata.integrity.split('-')[0] === 'sha512'
  }
}
