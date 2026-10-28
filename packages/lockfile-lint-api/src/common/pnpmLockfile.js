'use strict'

const DEFAULT_PNPM_REGISTRY = 'https://registry.npmjs.org'

const GIT_URL_PROTOCOLS = new Set([
  'http:',
  'https:',
  'ssh:',
  'git:',
  'git+http:',
  'git+https:',
  'git+ssh:'
])

/**
 * Ensure pnpmRegistry is an absolute http(s) URL (no search/hash).
 * Invalid values would produce unparsable `resolved` URLs that validators swallow.
 * @param {string} registry
 * @return {string} registry base ending with `/`
 */
function assertPnpmRegistry (registry) {
  // `new URL('https://host?')` yields an empty search, so check the raw string.
  if (typeof registry !== 'string' || registry.includes('?') || registry.includes('#')) {
    throw new Error(`Malformed pnpm registry URL: "${registry}"`)
  }
  let parsed
  try {
    parsed = new URL(registry)
  } catch (error) {
    throw new Error(`Malformed pnpm registry URL: "${registry}"`)
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Malformed pnpm registry URL: "${registry}"`)
  }
  // Use the normalized URL. Raw input can keep whitespace that `URL` trims, which
  // would make the reconstructed tarball unparsable and bypass host/HTTPS checks.
  return parsed.href.endsWith('/') ? parsed.href : `${parsed.href}/`
}

/**
 * Git `resolved` values must be URLs validators can parse; otherwise host/HTTPS checks swallow the error.
 * @param {string} dependencyId
 * @param {string} resolved
 */
function assertRemoteOrFileUrl (dependencyId, value, label) {
  if (value.startsWith('file:')) {
    if (!value.slice('file:'.length).trim()) {
      throw new Error(
        `Malformed pnpm lockfile: package entry for "${dependencyId}" has an empty file: ${label}`
      )
    }
    return
  }
  let parsed
  try {
    parsed = new URL(value)
  } catch (error) {
    throw new Error(
      `Malformed pnpm lockfile: package entry for "${dependencyId}" has an invalid ${label}`
    )
  }
  if ((parsed.protocol !== 'http:' && parsed.protocol !== 'https:') || !parsed.hostname) {
    throw new Error(
      `Malformed pnpm lockfile: package entry for "${dependencyId}" has a ${label} that is not http(s)`
    )
  }
}

/**
 * Git `resolved` values must be URLs validators can parse; otherwise host/HTTPS checks swallow the error.
 * @param {string} dependencyId
 * @param {string} resolved
 */
function assertGitResolvedUrl (dependencyId, resolved) {
  let parsed
  try {
    parsed = new URL(resolved)
  } catch (error) {
    throw new Error(
      `Malformed pnpm lockfile: package entry for "${dependencyId}" has an invalid git repo URL`
    )
  }
  if (!GIT_URL_PROTOCOLS.has(parsed.protocol) || !parsed.hostname) {
    throw new Error(
      `Malformed pnpm lockfile: package entry for "${dependencyId}" has an unsupported git repo URL`
    )
  }
}

/**
 * Build the canonical npm-style tarball URL pnpm omits for registry packages.
 * Mirrors pnpm's get-npm-tarball-url helper.
 * @param {string} name
 * @param {string} version
 * @param {string} registry
 * @return {string}
 */
function npmTarballUrl (name, version, registry, revision) {
  const base = assertPnpmRegistry(registry)
  if (revision != null) {
    // pnpm fetches registry revisions from `<registry>/<name>@<version>+r<revision>`.
    return `${base}${name}@${version}+r${revision}`
  }
  const scopeless = name.startsWith('@') ? name.slice(name.indexOf('/') + 1) : name
  const versionWithoutBuild = version.includes('+') ? version.split('+')[0] : version
  return `${base}${name}/-/${scopeless}-${versionWithoutBuild}.tgz`
}

/**
 * @param {*} revision
 * @return {string|null}
 */
function pnpmRevisionText (revision) {
  if (typeof revision === 'number' && Number.isInteger(revision) && revision >= 0) {
    return String(revision)
  }
  if (typeof revision === 'string' && revision.length > 0 && revision.length <= 16) {
    for (let i = 0; i < revision.length; i++) {
      const code = revision.charCodeAt(i)
      if (code < 48 || code > 57) return null
    }
    return revision
  }
  return null
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
      value.startsWith('ssh:') ||
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

  if (Object.prototype.hasOwnProperty.call(resolution, 'integrity')) {
    if (typeof resolution.integrity !== 'string') {
      throw new Error(
        `Malformed pnpm lockfile: package entry for "${dependencyId}" has a non-string resolution.integrity`
      )
    }
    normalized.integrity = resolution.integrity
  }

  if (resolution.type != null) {
    if (Object.prototype.hasOwnProperty.call(resolution, 'tarball')) {
      throw new Error(
        `Malformed pnpm lockfile: package entry for "${dependencyId}" has both a typed resolution and a tarball`
      )
    }

    if (resolution.type === 'directory' && typeof resolution.directory === 'string') {
      if (resolution.repo != null) {
        throw new Error(
          `Malformed pnpm lockfile: package entry for "${dependencyId}" has a directory resolution that also sets repo`
        )
      }
      const directoryPath = resolution.directory.startsWith('file:')
        ? resolution.directory.slice('file:'.length)
        : resolution.directory
      if (!directoryPath.trim()) {
        throw new Error(
          `Malformed pnpm lockfile: package entry for "${dependencyId}" has an empty directory path`
        )
      }
      // Match npm's file: directory entries (link:true for integrity-strict exemptions).
      normalized.resolved = resolution.directory.startsWith('file:')
        ? resolution.directory
        : `file:${resolution.directory}`
      normalized.link = true
      return normalized
    }

    if (resolution.type === 'git' && typeof resolution.repo === 'string') {
      if (resolution.directory != null) {
        throw new Error(
          `Malformed pnpm lockfile: package entry for "${dependencyId}" has a git resolution that also sets directory`
        )
      }
      if (resolution.commit != null && typeof resolution.commit !== 'string') {
        throw new Error(
          `Malformed pnpm lockfile: package entry for "${dependencyId}" has a non-string git commit`
        )
      }
      const commit = typeof resolution.commit === 'string' ? resolution.commit : ''
      const repo = resolution.repo
      if (commit && repo.includes('#')) {
        normalized.resolved = `${repo.replace(/#.*$/, '')}#${commit}`
      } else if (commit) {
        normalized.resolved = `${repo}#${commit}`
      } else {
        normalized.resolved = repo
      }
      assertGitResolvedUrl(dependencyId, normalized.resolved)
      return normalized
    }

    if (resolution.type === 'binary') {
      if (typeof resolution.url !== 'string' || !resolution.url) {
        throw new Error(
          `Malformed pnpm lockfile: package entry for "${dependencyId}" has a binary resolution without a URL`
        )
      }
      assertRemoteOrFileUrl(dependencyId, resolution.url, 'binary URL')
      normalized.resolved = resolution.url
      return normalized
    }

    throw new Error(
      `Malformed pnpm lockfile: package entry for "${dependencyId}" has an incomplete or unsupported typed resolution`
    )
  }

  if (Object.prototype.hasOwnProperty.call(resolution, 'tarball')) {
    if (typeof resolution.tarball !== 'string') {
      throw new Error(
        `Malformed pnpm lockfile: package entry for "${dependencyId}" has a non-string resolution.tarball`
      )
    }
    if (resolution.tarball.startsWith('file:')) {
      const filePath = resolution.tarball.slice('file:'.length)
      if (!filePath.trim()) {
        throw new Error(
          `Malformed pnpm lockfile: package entry for "${dependencyId}" has an empty file: tarball path`
        )
      }
      // pnpm records local tarball dependencies as file: URLs, not http(s).
      normalized.resolved = resolution.tarball
      return normalized
    }
    let tarballUrl
    try {
      tarballUrl = new URL(resolution.tarball)
    } catch (error) {
      throw new Error(
        `Malformed pnpm lockfile: package entry for "${dependencyId}" has an invalid resolution.tarball URL`
      )
    }
    // Host checks allow an empty hostname, so only http(s) tarballs with a host are safe to return.
    const tarballIsHttp =
      (tarballUrl.protocol === 'http:' || tarballUrl.protocol === 'https:') && tarballUrl.hostname
    if (!tarballIsHttp) {
      throw new Error(
        `Malformed pnpm lockfile: package entry for "${dependencyId}" has a resolution.tarball URL that is not http(s)`
      )
    }
    normalized.resolved = resolution.tarball
    return normalized
  }

  // Git ids such as ssh:// must not be rewritten as registry tarballs.
  if (
    typeof rest === 'string' &&
    (rest.startsWith('ssh:') || rest.startsWith('git:') || rest.startsWith('git+'))
  ) {
    throw new Error(
      `Malformed pnpm lockfile: package entry for "${dependencyId}" is a Git dependency and must use a typed git resolution`
    )
  }

  // Registry package: integrity-only — reconstruct tarball URL from inferred registry.
  // Prefer the alias target name/version when the id uses `npm:`.
  if (typeof resolution.integrity === 'string' && registryRef) {
    let revision = null
    if (Object.prototype.hasOwnProperty.call(resolution, 'revision')) {
      revision = pnpmRevisionText(resolution.revision)
      if (revision == null) {
        throw new Error(
          `Malformed pnpm lockfile: package entry for "${dependencyId}" has an invalid resolution.revision`
        )
      }
    }
    normalized.resolved = npmTarballUrl(registryRef.name, registryRef.version, registry, revision)
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
 * Only fingerprints resolution fields that affect normalization (avoids deep-copying
 * arbitrary YAML alias graphs) plus version.
 * @param {object} entry
 * @return {string}
 */
function resolutionFingerprint (entry) {
  const resolution = entry && entry.resolution
  const relevant =
    resolution && typeof resolution === 'object' && !Array.isArray(resolution)
      ? {
          integrity: typeof resolution.integrity === 'string' ? resolution.integrity : null,
          tarball: typeof resolution.tarball === 'string' ? resolution.tarball : null,
          type: typeof resolution.type === 'string' ? resolution.type : null,
          directory: typeof resolution.directory === 'string' ? resolution.directory : null,
          repo: typeof resolution.repo === 'string' ? resolution.repo : null,
          commit: typeof resolution.commit === 'string' ? resolution.commit : null,
          url: typeof resolution.url === 'string' ? resolution.url : null,
          revision:
            resolution.revision == null ? null : pnpmRevisionText(resolution.revision) || null
        }
      : null

  return JSON.stringify(
    canonicalize({
      resolution: relevant,
      version: entry && typeof entry.version === 'string' ? entry.version : null
    })
  )
}

module.exports = {
  DEFAULT_PNPM_REGISTRY,
  assertPnpmRegistry,
  npmTarballUrl,
  splitDependencyId,
  assertPnpmPackageEntry,
  normalizePnpmPackageEntry,
  resolutionFingerprint
}
