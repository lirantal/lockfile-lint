'use strict'

module.exports = class ValidateResolved {
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
        // Remove versioning info from packageName.
        // The @ sign is the delimiter, but could also be the
        // first character of a scoped package name.
        // We handle this edge-case here.
        const nameOnly = packageName.startsWith('@')
          ? `@${packageName.slice(1).split('@')[0]}`
          : packageName.split('@')[0]

        validationResult.errors.push({
          message: `missing resolved field for package: ${nameOnly}\n`,
          package: nameOnly
        })
        continue
      }
    }

    if (validationResult.errors.length > 0) {
      validationResult.type = 'error'
    }

    return validationResult
  }
}
