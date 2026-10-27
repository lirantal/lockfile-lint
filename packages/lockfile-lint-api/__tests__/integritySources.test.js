'use strict'

const {ParseLockfile, ValidateIntegrity} = require('..')
const strict = {integrityStrict: true}
const integrity = `sha512-${Buffer.alloc(64, 1).toString('base64')}`

test.each([
  'git+https://github.com/example/repo.git#main',
  'git+https://github.com/example/repo.git#main#abcdef0',
  'git+ssh://git@github.com/example/repo.git#v1.0.0',
  'git://github.com/example/repo.git',
  'github:example/repo#semver:^1',
  'gitlab:example/repo#abc',
  'bitbucket:example/repo#main',
  'ssh://git@example.com/repo.git#main',
  'git@example.com:repo.git#main',
  'file:///tmp/pkg%2Etgz',
  'file:../pkg.%74%67%7a',
  'file:///tmp/pkg%2Etar%2Egz?download=1#ref',
  'file:///tmp/dir%20name/pkg.TAR%2EGZ',
  'file:///tmp/invalid%ZZ',
  'file://[invalid/pkg'
])('requires integrity for unpinned or encoded/invalid source %p', source => {
  for (const field of ['resolved', 'version']) {
    for (const flags of [{}, {link: true}, {inBundle: true}, {bundled: true}]) {
      const metadata = Object.assign({[field]: source}, flags)
      const validator = new ValidateIntegrity({packages: {example: metadata}})
      expect(validator.validate(strict).type).toBe('error')
      expect(validator.validateSingle('example', strict)).toBe(false)
      expect(validator.validate().type).toBe('success')
      expect(validator.validateSingle('example')).toBe(true)
      metadata.integrity = integrity
      expect(validator.validate(strict).type).toBe('success')
      expect(validator.validateSingle('example', strict)).toBe(true)
    }
  }
})

test.each([
  'git+https://github.com/example/repo.git#abcdef0',
  'git+ssh://git@github.com/example/repo.git#abcdef0123456789',
  'github:example/repo#abcdef0',
  'file:///tmp/local%20directory',
  'file:///tmp/pkg%252Etgz',
  'file:///tmp/local%23directory',
  'file:///tmp/local%3Fdirectory'
])('accepts pinned Git and decoded local directories: %p', resolved => {
  const validator = new ValidateIntegrity({packages: {example: {resolved}}})
  expect(validator.validate(strict).type).toBe('success')
  expect(validator.validateSingle('example', strict)).toBe(true)
})

test.each([1, 2, 3])('enforces source policy after parsing npm v%i', lockfileVersion => {
  const metadata = {version: '1.0.0', resolved: 'file:../pkg%2Etgz', link: true}
  const git = {version: 'git+https://github.com/example/repo.git#main'}
  const lockfile =
    lockfileVersion === 1
      ? {lockfileVersion, dependencies: {local: metadata, git}}
      : {lockfileVersion, packages: {'node_modules/local': metadata, 'node_modules/git': git}}
  const parsed = new ParseLockfile({
    lockfileText: JSON.stringify(lockfile),
    lockfileType: 'npm'
  }).parseSync()
  const result = new ValidateIntegrity({packages: parsed.object}).validate(strict)
  expect(result.errors.map(error => error.package.split('@')[0]).sort()).toEqual(['git', 'local'])
})
