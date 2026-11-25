'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
// eslint-disable-next-line security/detect-child-process
const {spawnSync} = require('child_process')

const cli = path.join(__dirname, '../bin/lockfile-lint.js')

describe('npm-shrinkwrap.json filename inference', () => {
  let directory

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'lockfile-shrinkwrap-'))
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.writeFileSync(path.join(directory, 'npm-shrinkwrap.json'), JSON.stringify({
      lockfileVersion: 3,
      packages: {
        'node_modules/example': {
          version: '1.0.0',
          resolved: 'https://registry.npmjs.org/example/-/example-1.0.0.tgz'
        }
      }
    }))
  })

  afterEach(() => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.rmSync(directory, {recursive: true, force: true})
  })

  test.each([['npm', 0], ['yarn', 1]])(
    'runs host validation without --type (allowed host: %s)',
    (host, expectedStatus) => {
      // Run outside the repository so its type: npm config cannot mask inference.
      const result = spawnSync(process.execPath, [
        cli, '--path', 'npm-shrinkwrap.json', '--validate-https', '--allowed-hosts', host
      ], {cwd: directory, encoding: 'utf8'})

      expect(result.error).toBeUndefined()
      expect(result.status).toBe(expectedStatus)
      expect(result.stderr).not.toContain('Unable to find relevant lockfile parser')
      if (expectedStatus === 1) {
        expect(result.stderr).toContain('detected invalid host(s)')
      }
    }
  )
})
