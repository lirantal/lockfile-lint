'use strict'

function isSha512 (packageMetadata) {
  return packageMetadata.integrity.split('-')[0] === 'sha512'
}

function isHttpsGitRemote (source) {
  try {
    const url = new URL(source)
    const parts = url.pathname.split('/').filter(Boolean)
    return url.protocol === 'https:' &&
      ['github.com', 'gitlab.com', 'bitbucket.org'].includes(url.hostname) &&
      parts.length === 2 && !/\.(tgz|tar|gz|zip)$/i.test(parts[1]) &&
      !url.search && /^#[a-f0-9]{7,40}$/i.test(url.hash)
  } catch (error) {
    return false
  }
}

function isIntegrityExempt (packageMetadata) {
  if (
    packageMetadata.link === true ||
    packageMetadata.bundled === true ||
    packageMetadata.inBundle === true
  ) {
    return true
  }

  const source = packageMetadata.resolved || packageMetadata.version
  if (typeof source !== 'string') return false
  if (
    ['git:', 'github:', 'gitlab:', 'bitbucket:', 'ssh:', 'git@'].some(prefix =>
      source.startsWith(prefix)
    ) ||
    /^git\+[^:]+:/.test(source) || isHttpsGitRemote(source)
  ) {
    return true
  }

  // Local tarballs have integrity; local directories do not.
  return source.startsWith('file:') && !/\.(tgz|tar\.gz)([?#]|$)/i.test(source)
}

function hasStrictIntegrity (packageMetadata) {
  if (typeof packageMetadata.integrity !== 'string') return false
  return packageMetadata.integrity
    .trim()
    .split(/\s+/)
    .some(value => {
      if (!value.startsWith('sha512-')) return false
      const digest = value.slice('sha512-'.length)
      const decoded = Buffer.from(digest, 'base64')
      return decoded.length === 64 && decoded.toString('base64').replace(/=+$/, '') === digest.replace(/={1,2}$/, '')
    })
}

module.exports = class ValidateIntegrity {
  constructor ({packages} = {}) {
    if (typeof packages !== 'object') {
      throw new Error('expecting an object passed to validator constructor')
    }

    this.packages = packages
  }

  validate (options) {
    const excludedPackages = options && options.integrityExclude ? options.integrityExclude : []
    if (!Array.isArray(excludedPackages)) {
      throw new Error('excluded packages must be an array')
    }

    const validationResult = {
      type: 'success',
      errors: []
    }

    for (const [packageName, packageMetadata] of Object.entries(this.packages)) {
      if (options && options.integrityStrict) {
        if (
          excludedPackages.some(name => packageName.startsWith(`${name}@`)) ||
          isIntegrityExempt(packageMetadata)
        ) {
          continue
        }
        if (!hasStrictIntegrity(packageMetadata)) {
          const reason =
            packageMetadata.integrity == null || packageMetadata.integrity === ''
              ? 'missing integrity'
              : 'invalid integrity'
          validationResult.errors.push({
            message: `detected ${reason} for package: ${packageName}\n    expected: a complete sha512 integrity hash\n`,
            package: packageName
          })
        }
        continue
      }

      if (!('integrity' in packageMetadata)) {
        continue
      }

      if (excludedPackages.find(name => packageName.startsWith(`${name}@`))) {
        continue
      }

      try {
        if (!isSha512(packageMetadata)) {
          validationResult.errors.push({
            message: `detected invalid integrity hash type for package: ${packageName}\n    expected: sha512\n    actual: ${packageMetadata.integrity}\n`,
            package: packageName
          })
        }
      } catch (error) {
        // swallow error (assume that the integrity is valid)
      }
    }

    if (validationResult.errors.length !== 0) {
      validationResult.type = 'error'
    }

    return validationResult
  }

  validateSingle (packageName, options) {
    // eslint-disable-next-line security/detect-object-injection
    const packageMetadata = this.packages[packageName]
    if (options && options.integrityStrict) {
      return isIntegrityExempt(packageMetadata) || hasStrictIntegrity(packageMetadata)
    }
    if (!('integrity' in packageMetadata)) {
      return true
    }

    return isSha512(packageMetadata)
  }
}
