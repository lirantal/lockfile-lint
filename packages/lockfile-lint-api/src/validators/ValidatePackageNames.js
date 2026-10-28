'use strict'

const debug = require('debug')('lockfile-lint')
const {REGISTRY} = require('../common/constants')

module.exports = class ValidatePackageNames {
  constructor ({packages} = {}) {
    if (typeof packages !== 'object') {
      throw new Error('expecting an object passed to validator constructor')
    }

    this.packages = packages
  }

  validate (packageNameAliases) {
    const validationResult = {
      type: 'success',
      errors: []
    }

    const packageNameAliasPairs = this._getPackageNameAliasPairs(packageNameAliases)

    for (const [packageName, packageMetadata] of Object.entries(this.packages)) {
      if (!('resolved' in packageMetadata)) {
        continue
      }

      // Alias allow-list is keyed by the lockfile entry name (left-hand side), not the
      // npm: target — otherwise `foo@npm:ms@…` would be skipped when `ms` is listed.
      const lockfileKeyName = this._lockfileKeyPackageName(packageName)
      if (Object.hasOwn(packageNameAliasPairs, lockfileKeyName)) {
        debug(
          `skipping package name validation for aliased package name: ${packageName} resolving to: ${
            packageNameAliasPairs[lockfileKeyName]
          }}`
        )
        continue
      }

      try {
        const packageResolvedURL = new URL(packageMetadata.resolved)

        // Only handle package name validation matching per registry URL
        // when the registry is one of the official public registries:
        if (!Object.values(REGISTRY).includes(packageResolvedURL.host)) {
          debug(
            `skipping package name '${packageName}' validation for non-official registry '${
              packageResolvedURL.origin
            }'`
          )
          continue
        }

        const packageNameFromResolved = this._packageNameFromResolvedPath(
          packageResolvedURL.pathname
        )
        const packageNameOnly = this._getPackageNameOnly(packageName)

        // Compare names extracted from the normalized pathname so classic
        // `/-/<tarball>` URLs and pnpm revision `/name@version+rN` URLs both work,
        // and path-traversal forms normalize before the check.
        const isPassing = packageNameOnly === packageNameFromResolved
        if (!isPassing) {
          validationResult.errors.push({
            message: `detected resolved URL for package with a different name: ${packageNameOnly}\n    expected: ${packageNameOnly}\n    actual: ${packageNameFromResolved}\n`,
            package: packageNameOnly
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

  /**
   * Left-hand package name from a lockfile key (before `@npm:` / version).
   * @param {string} packageName
   * @return {string}
   */
  _lockfileKeyPackageName (packageName) {
    const npmAlias = packageName.indexOf('@npm:')
    if (npmAlias !== -1) {
      return packageName.slice(0, npmAlias)
    }
    return packageName.startsWith('@')
      ? `@${packageName.slice(1).split('@')[0]}`
      : packageName.split('@')[0]
  }

  /**
   * Package name encoded in an official-registry pathname.
   * Classic: `/name/-/name-version.tgz`. Revision: `/name@version+rN`.
   * @param {string} pathname
   * @return {string}
   */
  _packageNameFromResolvedPath (pathname) {
    if (pathname.includes('/-/')) {
      return pathname.split('/-/')[0].slice(1)
    }

    const body = pathname.startsWith('/') ? pathname.slice(1) : pathname
    if (body.startsWith('@')) {
      const scopeSlash = body.indexOf('/')
      if (scopeSlash === -1) {
        return body
      }
      const versionAt = body.indexOf('@', scopeSlash)
      return versionAt === -1 ? body : body.slice(0, versionAt)
    }

    const versionAt = body.indexOf('@')
    return versionAt === -1 ? body : body.slice(0, versionAt)
  }

  /**
   * When `npm:` embeds another package id (`name@version` or `@scope/name…`),
   * return that target name. Bare tokens are Yarn versions/dist-tags — use the
   * left-hand lockfile name instead (do not trust token===resolved, which
   * accepts `ms@npm:evil` → evil tarball).
   * @param {string} target
   * @return {string|null}
   */
  _packageNameFromNpmTarget (target) {
    if (!target) {
      return null
    }
    if (target.startsWith('@')) {
      const scopeSlash = target.indexOf('/')
      if (scopeSlash === -1) {
        return null
      }
      const versionAt = target.indexOf('@', scopeSlash)
      return versionAt === -1 ? target : target.slice(0, versionAt)
    }
    if (target.includes('@')) {
      return target.split('@')[0]
    }
    return null
  }

  _getPackageNameOnly (packageName) {
    // pnpm: `foo@npm:ms@2.1.3` — tarball is for the npm: target.
    // Yarn Berry: `ms@npm:2.1.2` / `ms@npm:latest` — npm: value is a version/dist-tag.
    const npmAlias = packageName.indexOf('@npm:')
    if (npmAlias !== -1) {
      const leftHand = packageName.slice(0, npmAlias)
      const target = packageName.slice(npmAlias + '@npm:'.length)
      const fromTarget = this._packageNameFromNpmTarget(target)
      return fromTarget || leftHand
    }

    // Remove versioning info from packageName. The @ sign is the delimiter, but could also be the
    // first character of a scoped package name. We handle this edge-case here.
    const packageNameOnly = packageName.startsWith('@')
      ? `@${packageName.slice(1).split('@')[0]}`
      : packageName.split('@')[0]

    return packageNameOnly
  }

  _getPackageNameAliasPairs (packageNameAliases) {
    if (!packageNameAliases || !Array.isArray(packageNameAliases)) {
      return {}
    }

    const packageNameAliasPairs = {}
    for (const packageNameAlias of packageNameAliases) {
      const [packageName, aliasedPackageName] = packageNameAlias.split(':')
      packageNameAliasPairs[packageName] = aliasedPackageName
    }

    return packageNameAliasPairs
  }
}
