'use strict'

const {URL} = require('url')
const debug = require('debug')('lockfile-lint-api')
const {REGISTRY} = require('../common/constants')

module.exports = class ValidateHost {
  constructor ({packages} = {}) {
    if (typeof packages !== 'object') {
      throw new Error('expecting an object passed to validator constructor')
    }

    this.packages = packages
  }

  validate (hosts, options) {
    if (!Array.isArray(hosts)) {
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

        const allowedHosts = hosts.map(hostValue => {
          // eslint-disable-next-line security/detect-object-injection
          return REGISTRY[hostValue] ? REGISTRY[hostValue] : hostValue
        })

        if (!allowedHosts.includes(packageResolvedURL.host)) {
          if (!packageResolvedURL.host && options && options.emptyHostname) {
            debug(`detected empty hostname but allowing because emptyHostname is not false`)
          } else {
            validationResult.errors.push({
              message: `detected invalid host(s) for package: ${packageName}\n    expected: ${allowedHosts}\n    actual: ${
                packageResolvedURL.host
              }\n`,
              package: packageName
            })
          }
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
