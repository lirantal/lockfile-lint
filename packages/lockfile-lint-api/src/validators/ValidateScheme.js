'use strict'

const {URL} = require('url')

module.exports = class ValidateProtocol {
  constructor ({packages} = {}) {
    if (typeof packages !== 'object') {
      throw new Error('expecting an object passed to validator constructor')
    }

    this.packages = packages
  }

  validate (schemes) {
    if (!Array.isArray(schemes)) {
      throw new Error('validate method requires an array')
    }

    let validationResult = {
      type: 'success',
      errors: []
    }

    for (const [packageName, packageMetadata] of Object.entries(this.packages)) {
      if (!('resolved' in packageMetadata)) {
        continue
      }

      let packageResolvedURL = {}

      try {
        packageResolvedURL = new URL(packageMetadata.resolved)

        if (packageResolvedURL.protocol && !schemes.includes(packageResolvedURL.protocol)) {
          validationResult.errors.push({
            message: `detected invalid scheme(s) for package: ${packageName}\n    expected: ${schemes}\n    actual: ${
              packageResolvedURL.protocol
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
}
