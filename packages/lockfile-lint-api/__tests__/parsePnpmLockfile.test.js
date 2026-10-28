'use strict'

const path = require('path')
const {
  ParseLockfile,
  ValidateHost,
  ValidateHttps,
  ValidateIntegrity,
  ValidatePackageNames
} = require('..')

const fixtures = name => path.join(__dirname, '__fixtures__/pnpm', name)

function parsePnpm (fixtureName, options) {
  return new ParseLockfile(
    Object.assign(
      {
        lockfilePath: fixtures(fixtureName),
        lockfileType: 'pnpm'
      },
      options
    )
  ).parseSync()
}

describe('ParseLockfile Pnpm', () => {
  it('parses a registry lockfile and reconstructs the inferred npmjs tarball URL', () => {
    const lockfile = parsePnpm('valid-registry.yaml')

    expect(lockfile.type).toEqual('success')
    expect(lockfile.object['ms@2.1.3']).toEqual({
      version: '2.1.3',
      integrity:
        'sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==',
      resolved: 'https://registry.npmjs.org/ms/-/ms-2.1.3.tgz'
    })
  })

  it('uses pnpmRegistry when reconstructing integrity-only package URLs', () => {
    const lockfile = parsePnpm('integrity-only-private.yaml', {
      pnpmRegistry: 'https://npm.pkg.github.com'
    })

    expect(lockfile.object['ms@2.1.3'].resolved).toEqual(
      'https://npm.pkg.github.com/ms/-/ms-2.1.3.tgz'
    )
  })

  it('keeps explicit private-registry tarball URLs', () => {
    const lockfile = parsePnpm('private-registry.yaml')

    expect(
      lockfile.object['left-pad@https://registry.npmmirror.com/left-pad/-/left-pad-1.3.0.tgz']
    ).toEqual({
      version: '1.3.0',
      integrity:
        'sha512-XI5MPzVNApjAyhQzphX8BkmKsKUxD4LdyK24iZeQGinBN9yTQT3bFlCBy/aVx2HrNcqQGsdot8ghrjyrvMCoEA==',
      resolved: 'https://registry.npmmirror.com/left-pad/-/left-pad-1.3.0.tgz'
    })
  })

  it('maps typed git resolutions like npm git+ URLs', () => {
    const lockfile = parsePnpm('typed-git.yaml')
    const pkg =
      lockfile.object[
        'is-number@git+https://git.example.com/jonschlinkert/is-number.git#98e8ff1da1a89f93d1397a24d7413ed15421c139'
      ]

    expect(pkg).toEqual({
      version: '7.0.0',
      resolved:
        'git+https://git.example.com/jonschlinkert/is-number.git#98e8ff1da1a89f93d1397a24d7413ed15421c139'
    })
  })

  it('maps directory resolutions like npm file: entries with link:true', () => {
    const lockfile = parsePnpm('directory.yaml')

    expect(lockfile.object['local-lib@file:../local-pkg']).toEqual({
      version: 'file:../local-pkg',
      resolved: 'file:../local-pkg',
      link: true
    })
  })

  it('merges packages across multi-document lockfiles', () => {
    const lockfile = parsePnpm('multi-doc.yaml')

    expect(Object.keys(lockfile.object).sort()).toEqual(['ms@2.1.3', 'pnpm@9.15.0'])
    expect(lockfile.object['ms@2.1.3'].resolved).toEqual(
      'https://registry.npmjs.org/ms/-/ms-2.1.3.tgz'
    )
    expect(lockfile.object['pnpm@9.15.0'].resolved).toEqual(
      'https://registry.npmjs.org/pnpm/-/pnpm-9.15.0.tgz'
    )
  })

  it('fails when the same package key has conflicting resolutions across documents', () => {
    expect(() => parsePnpm('multi-doc-conflict.yaml')).toThrow(
      /Conflicting package entries for "ms@2\.1\.3"/
    )
  })

  it('fails when the same package key has the same resolution but different versions across documents', () => {
    const lockfileText = [
      '---',
      "lockfileVersion: '9.0'",
      'packages:',
      '  ms@2.1.3:',
      '    version: 2.1.3',
      '    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}',
      '---',
      "lockfileVersion: '9.0'",
      'packages:',
      '  ms@2.1.3:',
      '    version: 2.1.4',
      '    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}',
      ''
    ].join('\n')

    expect(() =>
      new ParseLockfile({lockfileText, lockfileType: 'pnpm'}).parseSync()
    ).toThrow(/Conflicting package entries for "ms@2\.1\.3"/)
  })

  it('treats equivalent resolutions with different key order as the same entry', () => {
    const lockfileText = [
      '---',
      "lockfileVersion: '9.0'",
      'packages:',
      '  ms@2.1.3:',
      '    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==, tarball: https://registry.npmjs.org/ms/-/ms-2.1.3.tgz}',
      '---',
      "lockfileVersion: '9.0'",
      'packages:',
      '  ms@2.1.3:',
      '    resolution: {tarball: https://registry.npmjs.org/ms/-/ms-2.1.3.tgz, integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}',
      ''
    ].join('\n')

    const lockfile = new ParseLockfile({
      lockfileText,
      lockfileType: 'pnpm'
    }).parseSync()

    expect(lockfile.object['ms@2.1.3'].resolved).toEqual(
      'https://registry.npmjs.org/ms/-/ms-2.1.3.tgz'
    )
  })

  it('rejects trailing non-mapping YAML documents', () => {
    const lockfileText = [
      "lockfileVersion: '9.0'",
      'packages:',
      '  ms@2.1.3:',
      '    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}',
      '---',
      'not-a-mapping',
      ''
    ].join('\n')

    expect(() =>
      new ParseLockfile({lockfileText, lockfileType: 'pnpm'}).parseSync()
    ).toThrow(/expected a YAML mapping document/)
  })

  it('rejects a non-mapping packages section', () => {
    const lockfileText = ["lockfileVersion: '9.0'", 'packages:', '  - ms@2.1.3', ''].join('\n')

    expect(() =>
      new ParseLockfile({lockfileText, lockfileType: 'pnpm'}).parseSync()
    ).toThrow(/"packages" must be a mapping/)
  })

  it('rejects package entries without a mapping resolution', () => {
    const cases = [
      [
        "lockfileVersion: '9.0'\npackages:\n  ms@2.1.3: null\n",
        /package entry for "ms@2\.1\.3" must be a mapping/
      ],
      [
        "lockfileVersion: '9.0'\npackages:\n  ms@2.1.3: hello\n",
        /package entry for "ms@2\.1\.3" must be a mapping/
      ],
      [
        "lockfileVersion: '9.0'\npackages:\n  ms@2.1.3:\n    - only-a-list\n",
        /package entry for "ms@2\.1\.3" must be a mapping/
      ],
      [
        "lockfileVersion: '9.0'\npackages:\n  ms@2.1.3:\n    version: 2.1.3\n",
        /must include a mapping "resolution"/
      ],
      [
        "lockfileVersion: '9.0'\npackages:\n  ms@2.1.3:\n    resolution: null\n",
        /must include a mapping "resolution"/
      ],
      [
        "lockfileVersion: '9.0'\npackages:\n  ms@2.1.3:\n    resolution: []\n",
        /must include a mapping "resolution"/
      ]
    ]

    cases.forEach(([lockfileText, pattern]) => {
      expect(() =>
        new ParseLockfile({lockfileText, lockfileType: 'pnpm'}).parseSync()
      ).toThrow(pattern)
    })
  })

  it('reconstructs tarball URLs using npm: alias targets', () => {
    const lockfileText = [
      "lockfileVersion: '9.0'",
      'packages:',
      '  foo@npm:ms@2.1.3:',
      '    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}',
      '  bar@npm:@sindresorhus/is@4.6.0:',
      '    resolution: {integrity: sha512-t09vSN3MdfsyCHoFcTRCH/iUtG7OJ0CsjzB8cjAmKc/va/kIgeDI/TxsigdncE/4be734m0cvIYwNaV4i2XqAw==}',
      ''
    ].join('\n')

    const lockfile = new ParseLockfile({
      lockfileText,
      lockfileType: 'pnpm'
    }).parseSync()

    expect(lockfile.object['foo@npm:ms@2.1.3'].resolved).toEqual(
      'https://registry.npmjs.org/ms/-/ms-2.1.3.tgz'
    )
    expect(lockfile.object['bar@npm:@sindresorhus/is@4.6.0'].resolved).toEqual(
      'https://registry.npmjs.org/@sindresorhus/is/-/is-4.6.0.tgz'
    )
  })

  it('fails with an explicit error for unsupported lockfileVersion', () => {
    expect(() => parsePnpm('unsupported-version.yaml')).toThrow(
      /Unsupported pnpm lockfileVersion "6\.0"; only lockfileVersion 9\.x is supported/
    )
  })

  it('rejects malformed lockfileVersion values that only share a 9. prefix', () => {
    const lockfileText = [
      "lockfileVersion: '9.not-a-version'",
      'packages:',
      '  ms@2.1.3:',
      '    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}',
      ''
    ].join('\n')

    expect(() =>
      new ParseLockfile({lockfileText, lockfileType: 'pnpm'}).parseSync()
    ).toThrow(/Unsupported pnpm lockfileVersion "9\.not-a-version"/)
  })

  it('resolves parser by pnpm-lock.yaml filename', () => {
    const byName = new ParseLockfile({
      lockfileText: [
        "lockfileVersion: '9.0'",
        '',
        'packages:',
        '',
        '  ms@2.1.3:',
        '    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}',
        ''
      ].join('\n'),
      lockfilePath: '/tmp/project/pnpm-lock.yaml'
    })
    expect(byName.parseSync().object['ms@2.1.3'].resolved).toContain('registry.npmjs.org')
  })
})

describe('Pnpm validators integration', () => {
  it('passes hosts/https/integrity/package-names for a valid registry lockfile', () => {
    const {object: packages} = parsePnpm('valid-registry.yaml')

    expect(new ValidateHost({packages}).validate(['npm']).type).toEqual('success')
    expect(new ValidateHttps({packages}).validate().type).toEqual('success')
    expect(new ValidateIntegrity({packages}).validate().type).toEqual('success')
    expect(new ValidatePackageNames({packages}).validate().type).toEqual('success')
  })

  it('fails when tarball host is not allowed', () => {
    const {object: packages} = parsePnpm('bad-host.yaml')
    const result = new ValidateHost({packages}).validate(['npm'])

    expect(result.type).toEqual('error')
    expect(result.errors[0].message).toMatch(/evil\.example/)
  })

  it('fails when tarball uses http', () => {
    const {object: packages} = parsePnpm('bad-http.yaml')
    const result = new ValidateHttps({packages}).validate()

    expect(result.type).toEqual('error')
    expect(result.errors[0].message).toMatch(/actual: http:/)
  })

  it('fails when integrity is sha1', () => {
    const {object: packages} = parsePnpm('bad-sha1.yaml')
    const result = new ValidateIntegrity({packages}).validate()

    expect(result.type).toEqual('error')
    expect(result.errors[0].message).toMatch(/sha1-/)
  })

  it('fails when package name does not match registry tarball path', () => {
    const {object: packages} = parsePnpm('bad-package-name.yaml')
    const result = new ValidatePackageNames({packages}).validate()

    expect(result.type).toEqual('error')
    expect(result.errors[0].message).toMatch(/different name: ms/)
  })

  it('allows a private registry host when explicitly whitelisted', () => {
    const {object: packages} = parsePnpm('private-registry.yaml')

    expect(new ValidateHost({packages}).validate(['registry.npmmirror.com']).type).toEqual(
      'success'
    )
    expect(new ValidateHost({packages}).validate(['npm']).type).toEqual('error')
  })

  it('treats typed git like npm: host ok with git host, https fails on git+https:', () => {
    const {object: packages} = parsePnpm('typed-git.yaml')

    expect(
      new ValidateHost({packages}).validate(['git.example.com'], {emptyHostname: true}).type
    ).toEqual('success')
    expect(new ValidateHttps({packages}).validate().type).toEqual('error')
    expect(new ValidateIntegrity({packages}).validate({integrityStrict: true}).type).toEqual(
      'success'
    )
  })

  it('treats directory like npm file:: validate-https fails on file: protocol', () => {
    const {object: packages} = parsePnpm('directory.yaml')

    expect(packages['local-lib@file:../local-pkg'].link).toEqual(true)
    expect(new ValidateHttps({packages}).validate().type).toEqual('error')
    expect(new ValidateHttps({packages}).validate().errors[0].message).toMatch(/actual: file:/)
    expect(new ValidateIntegrity({packages}).validate({integrityStrict: true}).type).toEqual(
      'success'
    )
    expect(new ValidateHost({packages}).validate(['npm'], {emptyHostname: true}).type).toEqual(
      'success'
    )
  })
})
