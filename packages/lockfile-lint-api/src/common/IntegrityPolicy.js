'use strict'

// Only ParseLockfile can supply bundle provenance; JSON/Yarn flags are untrusted.
const VERIFIED_BUNDLE = Symbol('verifiedBundle')

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

function isIntegrityExempt (packageMetadata, {allowBundle = true, requirePinnedGit = false} = {}) {
  const source = normalizeSource(packageMetadata.resolved || packageMetadata.version)
  const remoteSource = /^https?:/i.test(source)
  const localTarball = /^file:.*\.(tgz|tar\.gz)([?#]|$)/i.test(source)
  if (
    !remoteSource &&
    !localTarball &&
    // eslint-disable-next-line security/detect-object-injection -- Fixed internal Symbol, not a key from the lockfile.
    (packageMetadata.link === true || (allowBundle && packageMetadata[VERIFIED_BUNDLE] === true))
  ) {
    return true
  }

  if (
    ((['git:', 'github:', 'gitlab:', 'bitbucket:', 'ssh:', 'git@'].some(prefix =>
      source.startsWith(prefix)
    ) ||
      /^git\+[^:]+:/.test(source)) &&
      (!requirePinnedGit || /#[a-f0-9]{7,40}$/i.test(source))) ||
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

module.exports = {VERIFIED_BUNDLE, isIntegrityExempt, hasStrictIntegrity}
