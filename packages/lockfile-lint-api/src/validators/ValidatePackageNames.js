'use strict'

module.exports = class ValidatePackageNames {
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

      try {
        const packageResolvedURL = new URL(packageMetadata.resolved)
        const path = packageResolvedURL.pathname
        const packageNameFromResolved = path.split('/-/')[0].slice(1)

        // Remove versioning info from packageName. The @ sign is the delimiter, but could also be the
        // first character of a scoped package name. We handle this edge-case here.
        const nameOnly = packageName.startsWith('@')
          ? `@${packageName.slice(1).split('@')[0]}`
          : packageName.split('@')[0]

        const expectedURLBeginning = `${packageResolvedURL.origin}/${nameOnly}`

        const isPassing = packageMetadata.resolved.startsWith(expectedURLBeginning)
        if (!isPassing) {
          validationResult.errors.push({
            message: `detected resolved URL for package with a different name: ${nameOnly}\n    expected: ${nameOnly}\n    actual: ${packageNameFromResolved}\n`,
            package: nameOnly
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
