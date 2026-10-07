'use strict'

const YARN_BERRY_STRICT_ERROR =
  '--validate-integrity-strict does not support Yarn Berry lockfiles (which use "checksum" instead of "integrity").'

function isSha512 (packageMetadata) {
  return packageMetadata.integrity.split('-')[0] === 'sha512'
}

function normalizeSource (source) {
  if (typeof source !== 'string') return ''
  try {
    // Classify the same URL that a consumer sees, including ignored whitespace.
    return new URL(source).href
  } catch (error) {
    // Semver versions and relative workspace paths are not absolute URLs.
    return source.trim()
  }
}

function isHttpsGitRemote (source) {
  try {
    const url = new URL(source)
    const parts = url.pathname.split('/').filter(Boolean)
    return (
      url.protocol === 'https:' &&
      ['github.com', 'gitlab.com', 'bitbucket.org'].includes(url.hostname) &&
      parts.length === 2 &&
      !/\.(tgz|tar|gz|zip)$/i.test(parts[1]) &&
      !url.search &&
      /^#[a-f0-9]{7,40}$/i.test(url.hash)
    )
  } catch (error) {
    return false
  }
}

function isPinnedCodeload (source) {
  try {
    const url = new URL(source)
    return (
      url.protocol === 'https:' &&
      url.hostname === 'codeload.github.com' &&
      !url.search &&
      !url.hash &&
      !url.username &&
      !url.password &&
      !url.port &&
      /^\/[^/]+\/[^/]+\/tar\.gz\/[a-f0-9]{40}$/i.test(url.pathname)
    )
  } catch (error) {
    return false
  }
}

function isIntegrityExempt (packageMetadata) {
  const source = normalizeSource(packageMetadata.resolved || packageMetadata.version)
  const remoteSource = /^https?:/i.test(source)
  const localTarball = /^file:.*\.(tgz|tar\.gz)([?#]|$)/i.test(source)
  if (
    !remoteSource &&
    !localTarball &&
    (packageMetadata.link === true ||
      packageMetadata.bundled === true ||
      packageMetadata.inBundle === true)
  ) {
    return true
  }

  if (
    ['git:', 'github:', 'gitlab:', 'bitbucket:', 'ssh:', 'git@'].some(prefix =>
      source.startsWith(prefix)
    ) ||
    /^git\+[^:]+:/.test(source) ||
    isHttpsGitRemote(source) ||
    isPinnedCodeload(source)
  ) {
    return true
  }

  // Local tarballs have integrity; local directories do not.
  return source.startsWith('file:') && !localTarball
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
      return (
        decoded.length === 64 &&
        decoded.toString('base64').replace(/=+$/, '') === digest.replace(/={1,2}$/, '')
      )
    })
}

module.exports = class ValidateIntegrity {
  constructor ({packages, format} = {}) {
    if (typeof packages !== 'object') {
      throw new Error('expecting an object passed to validator constructor')
    }

    this.packages = packages
    this.format = format
  }

  validate (options) {
    if (options && options.integrityStrict && this.format === 'yarn-berry') {
      return {
        type: 'error',
        errors: [{message: YARN_BERRY_STRICT_ERROR}]
      }
    }
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
      if (this.format === 'yarn-berry') {
        throw new Error(YARN_BERRY_STRICT_ERROR)
      }
      return isIntegrityExempt(packageMetadata) || hasStrictIntegrity(packageMetadata)
    }
    if (!('integrity' in packageMetadata)) {
      return true
    }

    return isSha512(packageMetadata)
  }
}
