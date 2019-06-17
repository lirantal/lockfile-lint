'use strict'

const {URL} = require('url')

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
      const packageResolvedURL = new URL(packageMetadata.resolved)

      if (packageResolvedURL.protocol !== HTTPS_PROTOCOL) {
        validationResult.errors.push({
          message: `detected non-https protocol used for package: ${packageName}`,
          package: packageName
        })
      }
    }

    if (validationResult.errors.length !== 0) {
      validationResult.type = 'error'
    }

    return validationResult
  }
}
