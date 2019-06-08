'use strict'

const {URL} = require('url')

const REGISTRY = {
  npm: 'https://registry.npmjs.org',
  yarn: 'https://registry.yarnpkg.com',
  verdaccio: 'https://registry.verdaccio.org'
}

module.exports = class ValidateHost {
  constructor ({packages} = {}) {
    if (typeof packages !== 'object') {
      throw new Error('expecting an object passed to validator constructor')
    }

    this.packages = packages
  }

  validate (hosts) {
    if (!Array.isArray(hosts)) {
      throw new Error('validate method requires an array')
    }

    for (const [packageName, packageMetadata] of Object.entries(this.packages)) {
      const packageResolvedURL = new URL(packageMetadata.resolved)

      const allowedHosts = hosts.map(hostValue => {
        // eslint-disable-next-line security/detect-object-injection
        return REGISTRY[hostValue] ? REGISTRY[hostValue] : hostValue
      })

      if (allowedHosts.indexOf(packageResolvedURL.origin) === -1) {
        throw new Error(`detected invalid origin for package: ${packageName}`)
      }
    }

    return true
  }
}
