'use strict'

/* eslint-disable security/detect-object-injection */
const {ParseLockfile, ValidateIntegrity} = require('..')
const fixtureV2 = require('./__fixtures__/bundled-integrity/package-lock-v2.json')
const fixtureV3 = require('./__fixtures__/bundled-integrity/package-lock-v3.json')
const strict = {integrityStrict: true}
const bundlerPath = 'node_modules/bund2'
const debugPath = `${bundlerPath}/node_modules/debug`
const msPath = `${bundlerPath}/node_modules/ms`

function validate (lockfile) {
  const parsed = new ParseLockfile({
    lockfileText: JSON.stringify(lockfile),
    lockfileType: 'npm'
  }).parseSync()
  return new ValidateIntegrity({packages: parsed.object}).validate(strict)
}

function failedNames (lockfile) {
  return validate(lockfile)
    .errors.map(error => error.package.split('@')[0])
    .sort()
}

describe.each([fixtureV2, fixtureV3])('npm v$lockfileVersion bundle ancestry', fixture => {
  let lockfile
  beforeEach(() => {
    lockfile = JSON.parse(JSON.stringify(fixture))
  })

  test('accepts a packed bundle, including transitive dependencies not named in its declaration', () => {
    expect(lockfile.packages[bundlerPath].bundleDependencies).toEqual(['debug'])
    expect(lockfile.packages[debugPath].inBundle).toBe(true)
    expect(lockfile.packages[msPath].inBundle).toBe(true)
    expect(validate(lockfile)).toEqual({type: 'success', errors: []})
  })

  test('rejects the nested non-bundle tampering reproduction', () => {
    const nested = lockfile.packages['node_modules/debug/node_modules/ms']
    delete nested.integrity
    delete nested.resolved
    nested.inBundle = true
    expect(failedNames(lockfile)).toEqual(['ms'])
  })

  test.each([undefined, 'sha512-invalid'])(
    'rejects the bundle and its children with invalid parent integrity: %p',
    integrity => {
      lockfile.packages[bundlerPath].integrity = integrity
      expect(failedNames(lockfile)).toEqual(['bund2', 'debug', 'ms'])
    }
  )

  test.each([undefined, [], false, 'debug'])(
    'requires a non-empty bundle declaration: %p',
    declaration => {
      lockfile.packages[bundlerPath].bundleDependencies = declaration
      expect(failedNames(lockfile)).toEqual(['debug', 'ms'])
    }
  )

  test('accepts the boolean bundle declaration', () => {
    lockfile.packages[bundlerPath].bundleDependencies = true
    expect(validate(lockfile).type).toBe('success')
  })

  test.each([
    {resolved: 'git+https://github.com/example/bund2.git#abcdef0123456789'},
    {resolved: 'https://github.com/example/bund2#abcdef0'},
    {resolved: 'file:../bundler'},
    {resolved: '../bundler', link: true}
  ])('accepts a bundler with an independent non-bundle exemption: %p', metadata => {
    Object.assign(lockfile.packages[bundlerPath], metadata)
    delete lockfile.packages[bundlerPath].integrity
    expect(validate(lockfile).type).toBe('success')
  })

  test.each(['git+https://github.com/example/bund2.git#main', 'github:example/bund2'])(
    'does not trust an unpinned Git bundler: %s',
    resolved => {
      Object.assign(lockfile.packages[bundlerPath], {resolved})
      delete lockfile.packages[bundlerPath].integrity
      expect(failedNames(lockfile)).toEqual(['debug', 'ms'])
    }
  )

  test('does not trust an excluded bundler with missing integrity', () => {
    delete lockfile.packages[bundlerPath].integrity
    const parsed = new ParseLockfile({
      lockfileText: JSON.stringify(lockfile),
      lockfileType: 'npm'
    }).parseSync()
    const result = new ValidateIntegrity({packages: parsed.object}).validate({
      integrityStrict: true,
      integrityExclude: ['bund2']
    })
    expect(result.errors.map(error => error.package.split('@')[0]).sort()).toEqual(['debug', 'ms'])
  })

  test('rejects children of an absent bundler', () => {
    delete lockfile.packages[bundlerPath]
    expect(failedNames(lockfile)).toEqual(['debug', 'ms'])
  })

  test('walks through bundled ancestors to the nearest non-bundled ancestor', () => {
    lockfile.packages[`${debugPath}/node_modules/ms`] = lockfile.packages[msPath]
    delete lockfile.packages[msPath]
    expect(validate(lockfile).type).toBe('success')
    delete lockfile.packages[bundlerPath].bundleDependencies
    expect(failedNames(lockfile)).toEqual(['debug', 'ms'])
  })

  test('does not skip an unverified non-bundled ancestor for a verified outer one', () => {
    const debug = lockfile.packages[debugPath]
    delete debug.inBundle
    debug.bundleDependencies = ['ms']
    lockfile.packages[`${debugPath}/node_modules/ms`] = lockfile.packages[msPath]
    delete lockfile.packages[msPath]
    expect(failedNames(lockfile)).toEqual(['debug', 'ms'])
  })

  test.each(['node_modules/@scope/bund2', 'packages/bund2'])(
    'resolves bundle ancestors at %s',
    parentPath => {
      for (const key of Object.keys(lockfile.packages)) {
        if (key === bundlerPath || key.startsWith(`${bundlerPath}/`)) {
          lockfile.packages[key.replace(bundlerPath, parentPath)] = lockfile.packages[key]
          delete lockfile.packages[key]
        }
      }
      if (parentPath === 'packages/bund2') {
        delete lockfile.packages[parentPath].resolved
        delete lockfile.packages[parentPath].integrity
      }
      expect(validate(lockfile).type).toBe('success')
    }
  )

  test('rejects remote resolved on a child even with verified ancestry', () => {
    lockfile.packages[msPath].resolved = ' https://example.com/ms.tgz'
    expect(failedNames(lockfile)).toEqual(['ms'])
  })

  test('requires integrity when all ancestors claim to be bundled', () => {
    lockfile.packages[bundlerPath].inBundle = true
    expect(failedNames(lockfile)).toEqual(['debug', 'ms'])
  })
})

describe('npm v1 bundle ancestry', () => {
  let lockfile
  beforeEach(() => {
    lockfile = {
      lockfileVersion: 1,
      dependencies: JSON.parse(JSON.stringify(fixtureV2.dependencies))
    }
  })

  test('accepts bundles under a verified ancestor without a bundle declaration', () => {
    expect(lockfile.dependencies.bund2.bundleDependencies).toBeUndefined()
    expect(validate(lockfile).type).toBe('success')
  })

  test.each([undefined, 'sha512-invalid'])('requires valid ancestor integrity: %p', integrity => {
    lockfile.dependencies.bund2.integrity = integrity
    expect(failedNames(lockfile)).toEqual(['bund2', 'debug', 'ms'])
  })

  test('walks through bundled parents in the dependency tree', () => {
    const bundled = lockfile.dependencies.bund2.dependencies
    bundled.debug.dependencies = {ms: bundled.ms}
    delete bundled.ms
    expect(validate(lockfile).type).toBe('success')
    delete lockfile.dependencies.bund2.integrity
    expect(failedNames(lockfile)).toEqual(['bund2', 'debug', 'ms'])
  })

  test('requires integrity for a top-level bundled entry', () => {
    lockfile.dependencies.orphan = {version: '1.0.0', bundled: true}
    expect(failedNames(lockfile)).toEqual(['orphan'])
  })
})

test.each([{bundled: true}, {inBundle: true}, {bundleVerified: true}])(
  'raw API metadata is not proof of a verified bundle: %p',
  metadata => {
    const validator = new ValidateIntegrity({packages: {example: metadata}})
    expect(validator.validate(strict).type).toBe('error')
    expect(validator.validateSingle('example', strict)).toBe(false)
  }
)

test('Yarn metadata cannot forge an npm bundle exemption', () => {
  const parsed = new ParseLockfile({
    lockfileText:
      '# yarn lockfile v1\n\nexample@1:\n  version "1.0.0"\n  resolved "1.0.0"\n  inBundle true\n  bundled true\n',
    lockfileType: 'yarn'
  }).parseSync()
  expect(new ValidateIntegrity({packages: parsed.object}).validate(strict).type).toBe('error')
})
