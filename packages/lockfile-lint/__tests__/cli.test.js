'use strict'

const path = require('path')
// eslint-disable-next-line security/detect-child-process
const childProcess = require('child_process')
const cliExecPath = path.join(__dirname, '../bin/lockfile-lint.js')

describe('CLI tests', () => {
  test('Running without parameters should display help', done => {
    const process = childProcess.spawn('node', [cliExecPath])

    let output = ''
    process.stderr.on('data', chunk => {
      output += chunk
    })

    process.stdout.on('close', () => {
      expect(output).toContain('Usage:')
      expect(output).toContain('Options:')
      expect(output).toContain('Examples:')
      done()
    })
  })

  test('Running without parameters should display a requirement for the p option', done => {
    const process = childProcess.spawn('node', [cliExecPath])

    let output = ''
    process.stderr.on('data', chunk => {
      output += chunk
    })

    process.stdout.on('close', () => {
      expect(output).toContain('Missing required argument: p')
      done()
    })
  })

  test('Linting a file that has wrong host should display an error message and use exit code 1', done => {
    const process = childProcess.spawn('node', [
      cliExecPath,
      '--type',
      'yarn',
      '--path',
      '__tests__/fixtures/yarn-only-http.lock',
      '--validate-https'
    ])

    let output = ''
    process.stderr.on('data', chunk => {
      output += chunk
    })

    process.stdout.on('close', exit => {
      expect(output).toContain(
        'detected invalid protocol for package: debug@^4.1.1\n    expected: https:\n    actual: http:\n'
      )
      expect(output).toContain(
        'detected invalid protocol for package: ms@^2.1.1\n    expected: https:\n    actual: http:\n'
      )
      expect(output).toContain('error: command failed with exit code 1')
      done()
    })
  })

  test('Linting a file that has wrong host should return exit code 1', done => {
    const process = childProcess.spawn('node', [
      cliExecPath,
      '--type',
      'yarn',
      '--path',
      '__tests__/fixtures/yarn-only-http.lock',
      '--validate-https'
    ])

    process.on('close', exitCode => {
      expect(exitCode).toBe(1)
      done()
    })
  })

  test('Providing conflicting arguments should display an error', done => {
    const process = childProcess.spawn(cliExecPath, [
      '--type',
      'yarn',
      '--path',
      '__tests__/fixtures/yarn-only-http.lock',
      '--validate-https',
      '--allowed-schemes',
      'https:'
    ])

    let output = ''
    process.stderr.on('data', chunk => {
      output += chunk
    })

    process.stderr.on('close', _ => {
      expect(output.indexOf('Arguments o and validate-https are mutually exclusive')).not.toBe(-1)
      done()
    })
  })

  describe('cosmiconfig integration', () => {
    it('options are loaded from cosmiconfig files', done => {
      const lintProcess = childProcess.spawn(cliExecPath, [], {
        cwd: path.join(__dirname, 'fixtures/valid-config')
      })

      lintProcess.on('close', exitCode => {
        expect(exitCode).toBe(0)
        done()
      })
    })

    it('command-line options take precedence', done => {
      const lintProcess = childProcess.spawn(cliExecPath, ['-p', '../yarn-only-http.lock'], {
        cwd: path.join(__dirname, 'fixtures/valid-config')
      })

      lintProcess.on('close', exitCode => {
        expect(exitCode).toBe(1)
        done()
      })
    })

    it('invalid config files are ignored', done => {
      const lintProcess = childProcess.spawn(
        cliExecPath,
        ['-p', '../yarn-only-https.lock', '--type', 'yarn', '--validate-https'],
        {
          cwd: path.join(__dirname, 'fixtures/invalid-config'),
          env: Object.assign({}, process.env, {DEBUG: 'lockfile-lint'})
        }
      )

      let stderr = ''
      lintProcess.stderr.on('data', chunk => {
        stderr += chunk
      })

      lintProcess.on('close', exitCode => {
        expect(stderr).toEqual(
          expect.stringMatching(/error encountered while loading configuration/i)
        )
        expect(exitCode).toBe(0)
        done()
      })
    })
  })
})
