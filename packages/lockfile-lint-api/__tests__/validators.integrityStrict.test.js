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
    {version: 'git+https://github.com/example/pkg.git#abc'},
    {resolved: 'git+ssh://git@github.com/example/pkg.git#abc'},
    {resolved: 'git://github.com/example/pkg.git#abc'},
    {version: 'github:example/pkg#abc'},
    {version: 'file:../local-package'},
    {resolved: 'file:packages/local'},
    {link: true},
    {bundled: true},
    {inBundle: true}
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
      const git = {version: 'git+https://github.com/example/pkg.git#abc'}
      const lockfile =
        lockfileVersion === 1
          ? {
              lockfileVersion,
              dependencies: {
                missing,
                valid,
                git,
                bundled: {version: '1.0.0', bundled: true},
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
                'node_modules/bundled': {version: '1.0.0', inBundle: true},
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
