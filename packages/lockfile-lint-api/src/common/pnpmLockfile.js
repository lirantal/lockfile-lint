'use strict'

const DEFAULT_PNPM_REGISTRY = 'https://registry.npmjs.org'

/**
 * Build the canonical npm-style tarball URL pnpm omits for registry packages.
 * Mirrors pnpm's get-npm-tarball-url helper.
 * @param {string} name
 * @param {string} version
 * @param {string} registry
 * @return {string}
 */
function npmTarballUrl (name, version, registry) {
  const base = registry.endsWith('/') ? registry : `${registry}/`
  const scopeless = name.startsWith('@') ? name.slice(name.indexOf('/') + 1) : name
  const versionWithoutBuild = version.includes('+') ? version.split('+')[0] : version
  return `${base}${name}/-/${scopeless}-${versionWithoutBuild}.tgz`
}

/**
 * Split a pnpm packages dependency id into name + remainder (version or URL).
 * @param {string} dependencyId
 * @return {{name: string, rest: string}}
 */
function splitDependencyId (dependencyId) {
  if (dependencyId.startsWith('@')) {
    const at = dependencyId.indexOf('@', 1)
    if (at === -1) {
      return {name: dependencyId, rest: ''}
    }
    return {
      name: dependencyId.slice(0, at),
      rest: dependencyId.slice(at + 1)
    }
  }

  const at = dependencyId.indexOf('@')
  if (at === -1) {
    return {name: dependencyId, rest: ''}
  }
  return {
    name: dependencyId.slice(0, at),
    rest: dependencyId.slice(at + 1)
  }
}

function isUrlOrPathSpec (value) {
  return (
    typeof value === 'string' &&
    (/^https?:\/\//i.test(value) ||
      value.startsWith('file:') ||
      value.startsWith('git:') ||
      value.startsWith('git+') ||
      value.startsWith('link:') ||
      value.startsWith('portal:') ||
      value.startsWith('workspace:'))
  )
}

/**
 * Normalize one pnpm packages entry into the shape validators expect.
 * @param {string} dependencyId
 * @param {object} entry
 * @param {string} registry
 * @return {{version?: string, resolved?: string, integrity?: string, link?: boolean}}
 */
function normalizePnpmPackageEntry (dependencyId, entry, registry) {
  const resolution = (entry && entry.resolution) || {}
  const {name, rest} = splitDependencyId(dependencyId)
  const versionFromId = isUrlOrPathSpec(rest) ? undefined : rest
  const version =
    (entry && typeof entry.version === 'string' && entry.version) || versionFromId || rest

  const normalized = {
    version
  }

  if (typeof resolution.integrity === 'string') {
    normalized.integrity = resolution.integrity
  }

  if (typeof resolution.tarball === 'string') {
    normalized.resolved = resolution.tarball
    return normalized
  }

  if (resolution.type === 'directory' && typeof resolution.directory === 'string') {
    // Match npm's file: directory entries (link:true for integrity-strict exemptions).
    normalized.resolved = resolution.directory.startsWith('file:')
      ? resolution.directory
      : `file:${resolution.directory}`
    normalized.link = true
    return normalized
  }

  if (resolution.type === 'git' && typeof resolution.repo === 'string') {
    const commit = typeof resolution.commit === 'string' ? resolution.commit : ''
    const repo = resolution.repo
    if (commit && repo.includes('#')) {
      normalized.resolved = `${repo.replace(/#.*$/, '')}#${commit}`
    } else if (commit) {
      normalized.resolved = `${repo}#${commit}`
    } else {
      normalized.resolved = repo
    }
    return normalized
  }

  // Registry package: integrity-only — reconstruct tarball URL from inferred registry.
  if (typeof resolution.integrity === 'string' && name && versionFromId) {
    normalized.resolved = npmTarballUrl(name, versionFromId, registry)
    return normalized
  }

  return normalized
}

/**
 * Stable serialization for comparing resolutions across multi-doc lockfiles.
 * @param {object} entry
 * @return {string}
 */
function resolutionFingerprint (entry) {
  return JSON.stringify((entry && entry.resolution) || null)
}

module.exports = {
  DEFAULT_PNPM_REGISTRY,
  npmTarballUrl,
  splitDependencyId,
  normalizePnpmPackageEntry,
  resolutionFingerprint
}
