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

function isPlainObject (value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Strip peer-dependency suffixes from a pnpm version/id fragment.
 * e.g. `1.0.0(react@18.2.0)` → `1.0.0`
 * @param {string} version
 * @return {string}
 */
function stripPeerSuffix (version) {
  if (typeof version !== 'string') return ''
  const paren = version.indexOf('(')
  return paren === -1 ? version : version.slice(0, paren)
}

/**
 * Resolve the registry package name/version used to reconstruct a tarball URL.
 * Handles `npm:` aliases (`foo@npm:ms@2.1.3` → ms@2.1.3).
 * @param {string} dependencyId
 * @param {object} entry
 * @return {{name: string, version: string}|null}
 */
function registryPackageRef (dependencyId, entry) {
  const {name: keyName, rest} = splitDependencyId(dependencyId)
  const entryVersion =
    entry && typeof entry.version === 'string' ? stripPeerSuffix(entry.version) : ''

  if (typeof rest === 'string' && rest.startsWith('npm:')) {
    const targetId = rest.slice('npm:'.length)
    if (!targetId) return null
    // npm:ms / npm:ms@2.1.3 / npm:@scope/pkg@1.0.0
    if (targetId.startsWith('@') || targetId.includes('@')) {
      const target = splitDependencyId(targetId.includes('@') ? targetId : `${targetId}@`)
      const version = stripPeerSuffix(target.rest) || entryVersion
      if (!target.name || !version) return null
      return {name: target.name, version}
    }
    if (!entryVersion) return null
    return {name: targetId, version: entryVersion}
  }

  if (isUrlOrPathSpec(rest)) {
    return null
  }

  const version = stripPeerSuffix(rest) || entryVersion
  if (!keyName || !version) return null
  return {name: keyName, version}
}

/**
 * Ensure a packages map value is a mapping with a mapping `resolution`.
 * @param {string} dependencyId
 * @param {*} entry
 */
function assertPnpmPackageEntry (dependencyId, entry) {
  if (!isPlainObject(entry)) {
    throw new Error(
      `Malformed pnpm lockfile: package entry for "${dependencyId}" must be a mapping`
    )
  }
  if (!isPlainObject(entry.resolution)) {
    throw new Error(
      `Malformed pnpm lockfile: package entry for "${dependencyId}" must include a mapping "resolution"`
    )
  }
}

/**
 * Normalize one pnpm packages entry into the shape validators expect.
 * @param {string} dependencyId
 * @param {object} entry
 * @param {string} registry
 * @return {{version?: string, resolved?: string, integrity?: string, link?: boolean}}
 */
function normalizePnpmPackageEntry (dependencyId, entry, registry) {
  assertPnpmPackageEntry(dependencyId, entry)

  const resolution = entry.resolution
  const {rest} = splitDependencyId(dependencyId)
  const registryRef = registryPackageRef(dependencyId, entry)
  const version =
    (typeof entry.version === 'string' && entry.version) ||
    (registryRef && registryRef.version) ||
    rest

  const normalized = {
    version
  }

  if (typeof resolution.integrity === 'string') {
    normalized.integrity = resolution.integrity
  }

  if (typeof resolution.tarball === 'string') {
    try {
      // Validators swallow URL parse errors; reject bad tarballs here so they cannot bypass checks.
      // eslint-disable-next-line no-new
      new URL(resolution.tarball)
    } catch (error) {
      throw new Error(
        `Malformed pnpm lockfile: package entry for "${dependencyId}" has an invalid resolution.tarball URL`
      )
    }
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
  // Prefer the alias target name/version when the id uses `npm:`.
  if (typeof resolution.integrity === 'string' && registryRef) {
    normalized.resolved = npmTarballUrl(registryRef.name, registryRef.version, registry)
    return normalized
  }

  throw new Error(
    `Malformed pnpm lockfile: package entry for "${dependencyId}" has an unsupported or incomplete resolution`
  )
}

/**
 * Deterministic JSON for nested values (sorts object keys at every level).
 * @param {*} value
 * @return {*}
 */
function canonicalize (value) {
  if (Array.isArray(value)) {
    return value.map(canonicalize)
  }
  if (value && typeof value === 'object') {
    // Null prototype so an own "__proto__" key is preserved in fingerprints.
    const sorted = Object.create(null)
    Object.keys(value)
      .sort()
      .forEach(key => {
        // eslint-disable-next-line security/detect-object-injection
        sorted[key] = canonicalize(value[key])
      })
    return sorted
  }
  return value
}

/**
 * Stable serialization for comparing package entries across multi-doc lockfiles.
 * Includes resolution and version so differing versions are treated as conflicts
 * even when the resolution object matches.
 * @param {object} entry
 * @return {string}
 */
function resolutionFingerprint (entry) {
  return JSON.stringify(
    canonicalize({
      resolution: (entry && entry.resolution) || null,
      version: entry && typeof entry.version === 'string' ? entry.version : null
    })
  )
}

module.exports = {
  DEFAULT_PNPM_REGISTRY,
  npmTarballUrl,
  splitDependencyId,
  assertPnpmPackageEntry,
  normalizePnpmPackageEntry,
  resolutionFingerprint
}
