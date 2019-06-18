'use strict'

// eslint-disable-next-line security/detect-child-process
const childProcess = require('child_process')
const cliExecPath = `${__dirname}/../bin/lockfile-lint.js`

describe('CLI tests', () => {
  test('Running without parameters should display help', done => {
    const process = childProcess.spawn(cliExecPath, [])

    let output = ''
    process.stderr.on('data', chunk => {
      output += chunk
    })

    process.stdout.on('close', () => {
      expect(output.indexOf('Usage:')).not.toBe(-1)
      expect(output.indexOf('Options:')).not.toBe(-1)
      expect(output.indexOf('Examples:')).not.toBe(-1)
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
      expect(output.indexOf('Missing required argument: p')).not.toBe(-1)
      done()
    })
  })

  test('Linting a file that has wrong origin should display an error message and use exit code 1', done => {
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
      expect(output.indexOf('detected non-https protocol used for package: debug@^4.1.1')).not.toBe(
        -1
      )
      expect(output.indexOf('detected non-https protocol used for package: ms@^2.1.1')).not.toBe(-1)
      expect(output.indexOf('error: command failed with exit code 1')).not.toBe(-1)
      done()
    })
  })

  test('Linting a file that has wrong origin should return exit code 1', done => {
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
