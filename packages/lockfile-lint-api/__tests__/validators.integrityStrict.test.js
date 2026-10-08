'use strict'

const {ParseLockfile, ValidateIntegrity} = require('..')
const integrity = `sha512-${Buffer.alloc(64, 1).toString('base64')}`
const strict = {integrityStrict: true}

function validatePackage (metadata, options = strict) {
  return new ValidateIntegrity({packages: {'example@1.0.0': metadata}}).validate(options)
}

describe('strict integrity validation', () => {
  test.each([undefined, null, '', 42, {}, 'sha1-YWJj', 'sha512-dummy', 'sha512-'])(
    'rejects missing or malformed integrity: %p',
    value => {
      expect(validatePackage({integrity: value}).type).toBe('error')
    }
  )

  test('rejects an absent field and reports the package', () => {
    expect(validatePackage({})).toEqual({
      type: 'error',
      errors: [{package: 'example@1.0.0', message: expect.stringContaining('missing integrity')}]
    })
  })

  test('accepts a complete SHA-512 digest and SRI lists containing one', () => {
    expect(validatePackage({integrity}).type).toBe('success')
    expect(validatePackage({integrity: `sha1-YWJj ${integrity}`}).type).toBe('success')
  })

  test.each([
    {version: 'git+https://github.com/example/pkg.git#abcdef0'},
    {resolved: 'git+ssh://git@github.com/example/pkg.git#abcdef0'},
    {resolved: 'git://github.com/example/pkg.git#abcdef0'},
    {version: 'github:example/pkg#abcdef0'},
    {version: 'file:../local-package'},
    {resolved: 'file:packages/local'},
    {link: true}
  ])('allows sources which do not require integrity: %p', metadata => {
    expect(validatePackage(metadata).type).toBe('success')
  })

  test.each([
    {resolved: 'https://github.com/example/pkg/archive/main.tar.gz'},
    {resolved: 'file:../package.tgz'},
    {resolved: 'file:../package.tar.gz'},
    {resolved: 'https://registry.npmjs.org/example/-/example-1.0.0.tgz'},
    {version: '1.0.0'}
  ])('requires integrity for tarballs and registry entries: %p', metadata => {
    expect(validatePackage(metadata).type).toBe('error')
  })

  test('honors exact package exclusions', () => {
    expect(
      validatePackage({}, Object.assign({}, strict, {integrityExclude: ['example']})).type
    ).toBe('success')
    expect(validatePackage({}, Object.assign({}, strict, {integrityExclude: ['exam']})).type).toBe(
      'error'
    )
  })

  test('keeps the existing non-strict behavior', () => {
    expect(validatePackage({}, {}).type).toBe('success')
    expect(validatePackage({integrity: undefined}, {}).type).toBe('success')
  })

  test('supports strict single-package validation', () => {
    const validator = new ValidateIntegrity({
      packages: {
        valid: {integrity},
        missing: {},
        linked: {link: true},
        invalid: {integrity: 'sha512-dummy'}
      }
    })
    expect(validator.validateSingle('valid', strict)).toBe(true)
    expect(validator.validateSingle('linked', strict)).toBe(true)
    expect(validator.validateSingle('missing', strict)).toBe(false)
    expect(validator.validateSingle('invalid', strict)).toBe(false)
  })

  test.each([1, 2, 3])(
    'validates parsed npm lockfile v%i with source exceptions',
    lockfileVersion => {
      const missing = {version: '1.0.0'}
      const valid = {version: '1.0.0', integrity}
      const git = {version: 'git+https://github.com/example/pkg.git#abcdef0'}
      const lockfile =
        lockfileVersion === 1
          ? {
              lockfileVersion,
              dependencies: {
                missing,
                valid,
                git,

                local: {version: 'file:../local'},
                parent: Object.assign({}, valid, {dependencies: {nested: missing}})
              }
            }
          : {
              lockfileVersion,
              packages: {
                '': {name: 'root', version: '1.0.0'},
                'node_modules/missing': missing,
                'node_modules/valid': valid,
                'node_modules/git': git,
                'node_modules/parent': Object.assign({}, valid, {bundleDependencies: ['bundled']}),
                'node_modules/parent/node_modules/bundled': {version: '1.0.0', inBundle: true},
                'node_modules/local': {resolved: 'packages/local', link: true},
                'packages/local': {name: 'local', version: '1.0.0'},
                'packages/local/node_modules/nested': missing
              }
            }
      const parsed = new ParseLockfile({
        lockfileText: JSON.stringify(lockfile),
        lockfileType: 'npm'
      }).parseSync()
      const result = new ValidateIntegrity({packages: parsed.object}).validate(strict)
      expect(result.type).toBe('error')
      expect(result.errors.map(error => error.package.split('@')[0]).sort()).toEqual([
        'missing',
        'nested'
      ])
    }
  )

  test('validates parsed Yarn Classic lockfiles', () => {
    const lockfileText =
      '# yarn lockfile v1\n\nexample@^1.0.0:\n  version "1.0.0"\n  resolved "https://registry.yarnpkg.com/example/-/example-1.0.0.tgz"\n'
    const parse = text =>
      new ParseLockfile({lockfileText: text, lockfileType: 'yarn'}).parseSync().object
    expect(new ValidateIntegrity({packages: parse(lockfileText)}).validate(strict).type).toBe(
      'error'
    )
    expect(
      new ValidateIntegrity({
        packages: parse(`${lockfileText}  integrity ${integrity}\n`)
      }).validate(strict).type
    ).toBe('success')
  })
})

describe('strict integrity review regressions', () => {
  test.each([
    'https://github.com/LN-Zap/bolt11#0123456789abcdef0123456789abcdef01234567',
    'https://github.com/example/repo.git#abcdef0',
    'https://gitlab.com/example/repo#abcdef0',
    'https://bitbucket.org/example/repo#abcdef0'
  ])('exempts pinned hosted Git repositories: %s', resolved => {
    expect(validatePackage({resolved}).type).toBe('success')
  })

  test.each([
    'https://github.com/example/repo/archive/abcdef0.tar.gz#abcdef0',
    'https://github.com/example/repo.tgz#abcdef0',
    'https://example.com/example/repo#abcdef0',
    'https://github.com.evil.test/example/repo#abcdef0',
    'https://github.com/example/repo?download=1#abcdef0',
    'https://github.com/example/repo',
    'https://registry.npmjs.org/example/-/example-1.0.0.tgz#abcdef0'
  ])('does not exempt download URLs: %s', resolved => {
    expect(validatePackage({resolved}).type).toBe('error')
  })

  test('accepts unpadded SHA-512 without accepting decoder-ignored garbage', () => {
    expect(validatePackage({integrity: integrity.replace(/=+$/, '')}).type).toBe('success')
    expect(validatePackage({integrity: integrity.replace('sha512-', 'sha512-!')}).type).toBe(
      'error'
    )
    expect(validatePackage({integrity: integrity + '==='}).type).toBe('error')
    expect(validatePackage({integrity: 'sha512-' + Buffer.alloc(63).toString('base64')}).type).toBe(
      'error'
    )
  })
})

describe('maintainer security regressions', () => {
  test.each([1, 2, 3])(
    'requires integrity for forged bundled/link entries in npm v%i',
    lockfileVersion => {
      const remote = 'https://registry.npmjs.org/ms/-/ms-2.0.0.tgz'
      const cases = [
        {
          metadata: {version: '2.1.3', resolved: remote, bundled: true, inBundle: true},
          nested: false,
          expected: 'error'
        },
        {
          metadata: {version: '2.1.3', bundled: true, inBundle: true},
          nested: true,
          expected: 'success'
        },
        {
          metadata: {version: '2.1.3', bundled: true, inBundle: true},
          nested: false,
          expected: 'error'
        },
        {
          metadata: {version: '2.1.3', resolved: remote, bundled: true, inBundle: true},
          nested: true,
          expected: 'error'
        },
        {
          metadata: {version: '2.1.3', resolved: remote, link: true},
          nested: false,
          expected: 'error'
        }
      ]
      for (const {metadata, nested, expected} of cases) {
        const lockfile =
          lockfileVersion === 1
            ? {
                lockfileVersion,
                dependencies: nested
                  ? {parent: {version: '1.0.0', integrity, dependencies: {x: metadata}}}
                  : {x: metadata}
              }
            : {
                lockfileVersion,
                packages: nested
                  ? {
                      'node_modules/@scope/parent': {
                        version: '1.0.0',
                        integrity,
                        bundleDependencies: ['x']
                      },
                      'node_modules/@scope/parent/node_modules/x': metadata
                    }
                  : {'node_modules/x': metadata}
              }
        const parsed = new ParseLockfile({
          lockfileText: JSON.stringify(lockfile),
          lockfileType: 'npm'
        }).parseSync()
        expect(new ValidateIntegrity({packages: parsed.object}).validate(strict).type).toBe(
          expected
        )
      }
    }
  )

  test.each(['http://example.com/x.tgz', 'https://example.com/x.tgz'])(
    'does not trust bundled or link flags with remote resolved %s',
    resolved => {
      for (const metadata of [{bundled: true}, {inBundle: true}, {link: true}]) {
        expect(validatePackage(Object.assign({resolved}, metadata)).type).toBe('error')
      }
    }
  )

  test.each([
    ' https://example.com/x.tgz',
    '\t\r\nhttp://example.com/x.tgz ',
    '\u0000https://example.com/x.tgz',
    'ht\ttps://example.com/x.tgz',
    'file:../x.tgz',
    'file:../x.tar.gz',
    ' \tfile:../x.tgz?download=1',
    'file:../x.tar.gz#fragment'
  ])('does not allow metadata flags to exempt tarball source %p', source => {
    for (const flag of [{link: true}, {bundled: true}, {inBundle: true}]) {
      for (const metadata of [{resolved: source}, {version: source}]) {
        const validator = new ValidateIntegrity({
          packages: {example: Object.assign({}, metadata, flag)}
        })
        expect(validator.validate(strict).type).toBe('error')
        expect(validator.validateSingle('example', strict)).toBe(false)
        expect(validatePackage(Object.assign({}, metadata, flag, {integrity})).type).toBe('success')
      }
    }
  })

  test.each([1, 2, 3])('rejects flagged tarballs after parsing npm v%i', lockfileVersion => {
    const remote = {version: '1.0.0', resolved: ' \thttps://example.com/x.tgz', link: true}
    const local = {version: 'file:../x.tar.gz', bundled: true, inBundle: true}
    const linkedTarball = {resolved: 'file:../x.tgz', link: true}
    const lockfile =
      lockfileVersion === 1
        ? {
            lockfileVersion,
            dependencies: {
              remote,
              linkedTarball,
              parent: {version: '1.0.0', integrity, dependencies: {local}}
            }
          }
        : {
            lockfileVersion,
            packages: {
              'node_modules/remote': remote,
              'node_modules/linkedTarball': linkedTarball,
              'node_modules/parent/node_modules/local': local
            }
          }
    const parsed = new ParseLockfile({
      lockfileText: JSON.stringify(lockfile),
      lockfileType: 'npm'
    }).parseSync()
    const result = new ValidateIntegrity({packages: parsed.object}).validate(strict)
    expect(result.type).toBe('error')
    expect(result.errors.map(error => error.package.split('@')[0]).sort()).toEqual([
      'linkedTarball',
      'local',
      'remote'
    ])
  })

  const sha = '1c6264b795492e8fdecbc82cb8802fcfbfc08d26'
  const codeload = `https://codeload.github.com/vercel/ms/tar.gz/${sha}`
  test('accepts a commit-pinned Yarn Classic codeload dependency', () => {
    const lockfileText = `# yarn lockfile v1\n\n"ms-git@github:vercel/ms#2.1.3":\n  version "2.1.3"\n  resolved "${codeload}"\n`
    const parsed = new ParseLockfile({lockfileText, lockfileType: 'yarn'}).parseSync()
    expect(new ValidateIntegrity({packages: parsed.object}).validate(strict).type).toBe('success')
  })

  test.each([
    `http://codeload.github.com/vercel/ms/tar.gz/${sha}`,
    `https://codeload.github.com.evil.test/vercel/ms/tar.gz/${sha}`,
    'https://codeload.github.com/vercel/ms/tar.gz/main',
    'https://codeload.github.com/vercel/ms/tar.gz/abcdef0',
    `https://codeload.github.com/vercel/ms/tar.gz/${'z'.repeat(40)}`,
    `${codeload}/extra`,
    `${codeload}?download=1`,
    `${codeload}#fragment`
  ])('rejects codeload lookalikes and unpinned downloads: %s', resolved => {
    expect(validatePackage({resolved}).type).toBe('error')
  })

  test('reports one format error for Yarn Berry in strict mode only', () => {
    const path = require('path')
    const parsed = new ParseLockfile({
      lockfilePath: path.join(__dirname, '__fixtures__/yarnberry.lock'),
      lockfileType: 'yarn'
    }).parseSync()
    const validator = new ValidateIntegrity({packages: parsed.object, format: parsed.format})
    const result = validator.validate(strict)
    expect(result.type).toBe('error')
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].message).toContain('does not support Yarn Berry')
    expect(result.errors[0].unsupportedFormat).toBe(true)
    expect(result.errors[0]).not.toHaveProperty('package')
    expect(validator.validate().type).toBe('success')
    const packageName = Object.keys(parsed.object)[0]
    expect(() => validator.validateSingle(packageName, strict)).toThrow(result.errors[0].message)
    expect(validator.validateSingle(packageName)).toBe(true)
  })

  test.each([{}, {integrity}, {link: true}])(
    'rejects strict single-package Yarn Berry validation regardless of metadata: %p',
    metadata => {
      const validator = new ValidateIntegrity({
        packages: {example: metadata},
        format: 'yarn-berry'
      })
      expect(() => validator.validateSingle('example', strict)).toThrow(
        'does not support Yarn Berry'
      )
      expect(() => validator.validateSingle('example', strict)).toThrow(
        expect.objectContaining({unsupportedFormat: true})
      )
    }
  )
})

test('strict validation accepts an empty npm lockfile', () => {
  const parsed = new ParseLockfile({lockfileText: '{}', lockfileType: 'npm'}).parseSync()
  expect(new ValidateIntegrity({packages: parsed.object}).validate(strict)).toEqual({
    type: 'success',
    errors: []
  })
})

test('identifies Berry format for a scoped package resolution', () => {
  const parsed = new ParseLockfile({
    lockfileText:
      '__metadata:\n  version: 4\n\n"@scope/pkg@npm:^1.0.0":\n  version: 1.0.0\n  resolution: "@scope/pkg@npm:1.0.0"\n  checksum: abc\n',
    lockfileType: 'yarn'
  }).parseSync()
  expect(parsed.object['@scope/pkg@npm:^1.0.0'].resolved).toBe('npm:1.0.0')
  expect(
    new ValidateIntegrity({packages: parsed.object, format: parsed.format}).validate(strict)
  ).toEqual({
    type: 'error',
    errors: [
      {message: expect.stringContaining('does not support Yarn Berry'), unsupportedFormat: true}
    ]
  })
})
