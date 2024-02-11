'use strict'

const debug = require('debug')('lockfile-lint')
const yargs = require('yargs')
const {cosmiconfigSync} = require('cosmiconfig')

module.exports = (argv, exitProcess = false, searchFrom = process.cwd()) => {
  let cosmiconfigResult
  try {
    cosmiconfigResult = cosmiconfigSync('lockfile-lint').search(searchFrom)
  } catch (err) {
    debug(`error encountered while loading configuration: ${err}`)
  }

  let fileConfig = {}
  if (cosmiconfigResult) {
    fileConfig = cosmiconfigResult.config
    debug(
      `loaded the following config from ${cosmiconfigResult.filepath}: ${JSON.stringify(
        fileConfig
      )}`
    )
  }

  return yargs(argv)
    .version()
    .config(fileConfig)
    .usage('Usage: lockfile-lint --path <path-to-lockfile> --allowed-hosts yarn npm')
    .help('help')
    .alias('help', 'h')
    .options({
      path: {
        alias: ['p'],
        type: 'string',
        describe: 'path to the lockfile',
        demandOption: true
      },
      type: {
        alias: ['t'],
        type: 'string',
        describe: 'lockfile type, options are "npm" or "yarn"'
      },
      'validate-https': {
        alias: ['s'],
        type: 'boolean',
        describe: 'validates the use of HTTPS as protocol schema for all resources'
      },
      'validate-package-names': {
        alias: ['n'],
        type: 'boolean',
        describe:
          "validates that the resource URL specifies the same package name as that listed as the lockfile entry's key",
        implies: 'allowed-hosts'
      },
      'validate-integrity': {
        alias: ['i'],
        type: 'boolean',
        describe: 'validates that the integrity hash type is sha512'
      },
      'empty-hostname': {
        alias: 'e',
        type: 'boolean',
        default: true,
        describe: 'allows empty hostnames, or set to false if you wish for a stricter policy'
      },
      'allowed-hosts': {
        alias: ['a'],
        type: 'array',
        describe: 'validates a whitelist of allowed hosts to be used for resources in the lockfile'
      },
      'allowed-schemes': {
        alias: ['o'],
        type: 'array',
        describe:
          'validates a whitelist of allowed schemes to be used for resources in the lockfile',
        conflicts: ['validate-https', 's']
      },
      'allowed-urls': {
        alias: ['u'],
        type: 'array',
        describe: 'validates a whitelist of allowed URLs to be used for resources in the lockfile'
      },
      'allowed-package-name-aliases': {
        alias: ['l'],
        type: 'array',
        describe: 'validates an alias of package names to be used for resources in the lockfile'
      },
      'integrity-exclude': {
        type: 'array',
        describe: 'do not validate integrity for these package'
      },
      format: {
        alias: ['f'],
        type: 'string',
        description: 'format of the report output',
        choices: ['plain', 'pretty'],
        default: 'pretty'
      }
    })
    .example('lockfile-lint --path yarn.lock --validate-https')
    .example('lockfile-lint --path yarn.lock --validate-https --allowed-hosts npm yarn verdaccio')
    .example(
      'lockfile-lint --path yarn.lock --allowed-schemes "https:" "git+ssh:" --allowed-hosts npm yarn verdaccio'
    )
    .epilogue('curated by Liran Tal at https://github.com/lirantal/lockfile-lint')
    .detectLocale(false)
    .exitProcess(exitProcess).argv
}
