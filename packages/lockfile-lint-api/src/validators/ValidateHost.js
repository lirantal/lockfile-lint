'use strict'

const {REGISTRY} = require('../common/constants')

const noop = () => {}
module.exports = class ValidateHost {
  constructor ({packages, debug = noop} = {}) {
    if (typeof packages !== 'object') {
      throw new Error('expecting an object passed to validator constructor')
    }

    this.packages = packages
    this.debug = debug
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

      try {
        const packageResolvedURL = new URL(packageMetadata.resolved)
        const allowedHosts = hosts.map(allowedHost => {
          // eslint-disable-next-line security/detect-object-injection
          const host = REGISTRY[allowedHost] ? REGISTRY[allowedHost] : allowedHost
          let hostValue = host

          try {
            const parsedHost = new URL(host)
            if (parsedHost.host) {
              hostValue = parsedHost.host
            }
          } catch (error) {
            this.debug(`failed parsing a URL object from given host value so using as is: ${host}`)
          }

          return hostValue
        })

        const isPassing = allowedHosts.includes(packageResolvedURL.host)
        if (!isPassing) {
          if (!packageResolvedURL.host && options && options.emptyHostname) {
            this.debug(`detected empty hostname but allowing because emptyHostname is not false`)
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

  validateSingle (packageName, hosts) {
    // eslint-disable-next-line security/detect-object-injection
    const packageMetadata = this.packages[packageName]

    if (!('resolved' in packageMetadata)) {
      return true
    }

    const packageResolvedURL = new URL(packageMetadata.resolved)
    const allowedHosts = hosts.map(hostValue => {
      // eslint-disable-next-line security/detect-object-injection
      return REGISTRY[hostValue] ? REGISTRY[hostValue] : hostValue
    })

    return allowedHosts.includes(packageResolvedURL.host)
  }
}
