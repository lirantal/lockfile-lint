'use strict'

const semver = require('semver')

module.exports = class ValidatePackageVersions {
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
        const versionAndExt = path.split('-').pop()
        const versionFromResolved = versionAndExt.slice(0, versionAndExt.lastIndexOf('.'))

        // Remove versioning info from packageName. The @ sign is the delimiter, but could also be the
        // first character of a scoped package name. We handle this edge-case here.
        const versionDelimiter = packageName.lastIndexOf('@')
        const [nameOnly, versionRange] = [
          packageName.slice(0, versionDelimiter),
          packageName.slice(versionDelimiter + 1)
        ]

        const isPassing = semver.satisfies(versionFromResolved, versionRange)
        if (!isPassing) {
          validationResult.errors.push({
            message: `detected resolved URL for package with a different version: ${nameOnly}\n    expected: ${versionRange}\n    actual: ${versionFromResolved}\n`,
            package: nameOnly
          })
        }
      } catch (error) {
        // swallow error
      }
    }

    if (validationResult.errors.length !== 0) {
      validationResult.type = 'error'
    }

    return validationResult
  }
}
