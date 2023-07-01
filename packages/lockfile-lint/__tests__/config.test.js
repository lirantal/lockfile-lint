const path = require('path')
const loadConfig = require('../src/config')

describe('config', () => {
  let realConsole

  beforeEach(() => {
    realConsole = global.console
    global.console = {
      log: jest.fn(),
      error: jest.fn()
    }
  })

  afterEach(() => {
    global.console = realConsole
  })

  test('running without parameters should display help', () => {
    try {
      loadConfig(['lockfile-lint.js'], false)
    } catch (err) {
      /* swallow error for missing parameter - tested below */
    }

    expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/usage:/i))
    expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/options:/i))
    expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/examples:/i))
  })

  test('running with -h should display help', () => {
    loadConfig(['lockfile-lint.js', '-h'], false)

    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/usage:/i))
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/options:/i))
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/examples:/i))
  })

  test('running without parameters should display a requirement for the p option', () => {
    const errorMessageExpression = /missing required argument: p/i

    expect(() => loadConfig(['lockfile-lint.js'], false)).toThrow(errorMessageExpression)

    expect(console.error).toHaveBeenCalledWith(expect.stringMatching(errorMessageExpression))
  })

  test('providing conflicting arguments should display an error', () => {
    const errorMessageExpression = /Arguments allowed-schemes and validate-https are mutually exclusive/i

    expect(() =>
      loadConfig(
        [
          'lockfile-lint.js',
          '--type',
          'yarn',
          '--path',
          '__tests__/fixtures/yarn-only-http.lock',
          '--validate-https',
          '--allowed-schemes',
          'https:'
        ],
        false
      )
    ).toThrow(errorMessageExpression)

    expect(console.error).toHaveBeenCalledWith(expect.stringMatching(errorMessageExpression))
  })
  ;[
    {
      name: 'minimal',
      args: ['--path', 'yarn.lock'],
      expected: {
        path: 'yarn.lock',
        emptyHostname: true
      }
    },
    {
      name: 'complete',
      args: [
        '--path',
        'yarn.lock',
        '--type',
        'npm',
        '--allowed-hosts',
        'yarn',
        '--validate-https',
        'true',
        '--empty-hostname',
        'false',
        '--validate-package-names',
        'true',
        '--format',
        'plain'
      ],
      expected: {
        path: 'yarn.lock',
        type: 'npm',
        validateHttps: true,
        validatePackageNames: true,
        emptyHostname: false,
        format: 'plain'
      }
    }
  ].forEach(({name, args, expected}) => {
    test(`providing valid ${name} arguments should return correct config`, () => {
      expect(loadConfig(['lockfile-lint.js', ...args], false)).toEqual(
        expect.objectContaining(expected)
      )
    })
  })

  describe('cosmiconfig integration', () => {
    it('options are loaded from cosmiconfig files', () => {
      expect(
        loadConfig(['lockfile-lint.js'], false, path.join(__dirname, 'fixtures/valid-config'))
      ).toEqual(
        expect.objectContaining({
          path: '../yarn-only-https.lock',
          type: 'yarn',
          validateHttps: true
        })
      )
    })

    it('command-line options take precedence', () => {
      expect(
        loadConfig(
          ['lockfile-lint.js', '-p', 'other-lockfile.lock'],
          false,
          path.join(__dirname, 'fixtures/valid-config')
        )
      ).toEqual(
        expect.objectContaining({
          path: 'other-lockfile.lock',
          type: 'yarn',
          validateHttps: true
        })
      )
    })

    it('invalid config files are ignored', () => {
      expect(
        loadConfig(
          ['lockfile-lint.js', '-p', 'package-lock.json', '--type', 'npm', '--validate-https'],
          false,
          path.join(__dirname, 'fixtures/invalid-config')
        )
      ).toEqual(
        expect.objectContaining({
          path: 'package-lock.json',
          type: 'npm',
          validateHttps: true
        })
      )
    })
  })
})
