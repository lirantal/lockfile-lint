'use strict'

const path = require('path')
// eslint-disable-next-line security/detect-child-process
const childProcess = require('child_process')
const cliExecPath = path.join(__dirname, '../bin/lockfile-lint.js')

describe('CLI tests', () => {
  test('Running without parameters should display help', done => {
    const process = childProcess.spawn(cliExecPath, [])

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
    const process = childProcess.spawn(cliExecPath, [])

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
    const process = childProcess.spawn(cliExecPath, [
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
    const process = childProcess.spawn(cliExecPath, [
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
})
