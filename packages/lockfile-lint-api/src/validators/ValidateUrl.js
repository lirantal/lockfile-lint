'use strict'

module.exports = class ValidateUrl {
  constructor ({packages} = {}) {
    if (typeof packages !== 'object') {
      throw new Error('expecting an object passed to validator constructor')
    }

    this.packages = packages
  }

  validate (allowedUrls, options) {
    if (!Array.isArray(allowedUrls)) {
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

      try {
        const isPassing = allowedUrls.includes(packageMetadata.resolved)
        if (!isPassing) {
          validationResult.errors.push({
            message: `detected invalid url(s) for package: ${packageName}\n    expected: ${allowedUrls}\n    actual: ${
              packageMetadata.resolved
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

  validateSingle (packageName, allowedUrls) {
    // eslint-disable-next-line security/detect-object-injection
    const packageMetadata = this.packages[packageName]
    if (!('resolved' in packageMetadata)) {
      return true
    }

    const resolvedUrl = packageMetadata.resolved

    return allowedUrls.includes(resolvedUrl)
  }
}
