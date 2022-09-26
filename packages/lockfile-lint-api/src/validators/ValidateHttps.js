'use strict'

const HTTPS_PROTOCOL = 'https:'

module.exports = class ValidateHttps {
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
      if (!('resolved' in packageMetadata)) {
        continue
      }

      let packageResolvedURL = {}

      try {
        packageResolvedURL = new URL(packageMetadata.resolved)

        if (packageResolvedURL.protocol !== HTTPS_PROTOCOL) {
          validationResult.errors.push({
            message: `detected invalid protocol for package: ${packageName}\n    expected: ${HTTPS_PROTOCOL}\n    actual: ${
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
