'use strict'

const path = require('path')
// eslint-disable-next-line security/detect-child-process
const {spawnSync} = require('child_process')
const loadConfig = require('../src/config')

function run (...flags) {
  return spawnSync(
    process.execPath,
    [
      path.join(__dirname, '../bin/lockfile-lint.js'),
      '--path',
      '__tests__/fixtures/package-lock-missing-integrity.json',
      '--type',
      'npm',
      '--format',
      'plain',
      ...flags
    ],
    {encoding: 'utf8', cwd: path.join(__dirname, '..')}
  )
}

describe('strict integrity CLI', () => {
  test('fails on missing integrity when strict validation is used on its own', () => {
    const result = run('--validate-integrity-strict')
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('missing integrity for package: missing@')
    expect(result.stderr).not.toContain('package: local@')
  })

  test('runs integrity validation only once when both flags are set', () => {
    const result = run('--validate-integrity', '--validate-integrity-strict')
    expect(result.status).toBe(1)
    expect(result.stderr.match(/missing integrity/g)).toHaveLength(1)
  })

  test('keeps strict mode optional', () => {
    expect(run('--validate-integrity').status).toBe(0)
    expect(run('--validate-integrity', '--no-validate-integrity-strict').status).toBe(0)
  })

  test('supports explicit integrity exclusions in strict mode', () => {
    const result = run('--validate-integrity-strict', '--integrity-exclude', 'missing')
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('No issues detected')
  })

  test('loads strict integrity from a config file', async () => {
    const config = await loadConfig(
      [],
      false,
      path.join(__dirname, 'fixtures/strict-integrity-config')
    )
    expect(config['validate-integrity-strict']).toBe(true)
  })
})

test.each(['plain', 'pretty'])(
  'strict CLI reports unsupported Yarn Berry without security findings in %s format',
  format => {
    const result = spawnSync(
      process.execPath,
      [
        path.join(__dirname, '../bin/lockfile-lint.js'),
        '--type',
        'yarn',
        '--path',
        '../lockfile-lint-api/__tests__/__fixtures__/yarnberry.lock',
        '--validate-integrity-strict',
        '--format',
        format
      ],
      {encoding: 'utf8', cwd: path.join(__dirname, '..')}
    )
    expect(result.status).toBe(1)
    expect(result.stderr.match(/does not support Yarn Berry/g)).toHaveLength(1)
    expect(result.stderr).not.toContain('missing integrity')
    expect(result.stderr).toContain(
      'Error: unsupported lockfile format for --validate-integrity-strict'
    )
    expect(result.stderr).not.toContain('security issues detected!')
  }
)

test.each(['plain', 'pretty'])(
  'strict CLI retains other security findings for Yarn Berry in %s format',
  format => {
    const result = spawnSync(
      process.execPath,
      [
        path.join(__dirname, '../bin/lockfile-lint.js'),
        '--type',
        'yarn',
        '--path',
        '../lockfile-lint-api/__tests__/__fixtures__/yarnberry.lock',
        '--validate-integrity-strict',
        '--validate-https',
        '--format',
        format
      ],
      {encoding: 'utf8', cwd: path.join(__dirname, '..')}
    )
    expect(result.status).toBe(1)
    expect(result.stderr.match(/does not support Yarn Berry/g)).toHaveLength(1)
    expect(result.stderr).toContain('detected invalid protocol')
    expect(result.stderr).toContain('Error: security issues detected!')
    expect(result.stderr).not.toContain('Error: unsupported lockfile format for')
  }
)
