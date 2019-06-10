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
    for (const [packageName, packageMetadata] of Object.entries(this.packages)) {
      const packageResolvedURL = new URL(packageMetadata.resolved)

      if (packageResolvedURL.protocol !== HTTPS_PROTOCOL) {
        throw new Error(`detected non-https protocol used for package: ${packageName}`)
      }
    }

    return true
  }
}
