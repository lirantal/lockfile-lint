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
      p: {
        alias: ['path'],
        type: 'string',
        describe: 'path to the lockfile',
        demandOption: true
      },
      t: {
        alias: ['type'],
        type: 'string',
        describe: 'lockfile type, options are "npm" or "yarn"'
      },
      s: {
        alias: ['validate-https'],
        type: 'boolean',
        describe: 'validates the use of HTTPS as protocol schema for all resources'
      },
      n: {
        alias: ['validate-package-names'],
        type: 'boolean',
        describe:
          "validates that the resource URL specifies the same package name as that listed as the lockfile entry's key",
        implies: 'allowed-hosts'
      },
      e: {
        alias: 'empty-hostname',
        type: 'boolean',
        default: true,
        describe: 'allows empty hostnames, or set to false if you wish for a stricter policy'
      },
      a: {
        alias: ['allowed-hosts'],
        type: 'array',
        describe: 'validates a whitelist of allowed hosts to be used for resources in the lockfile'
      },
      o: {
        alias: ['allowed-schemes'],
        type: 'array',
        describe:
          'validates a whitelist of allowed schemes to be used for resources in the lockfile',
        conflicts: ['validate-https', 's']
      },
      u: {
        alias: ['allowed-urls'],
        type: 'array',
        describe: 'validates a whitelist of allowed URLs to be used for resources in the lockfile'
      },
      f: {
        alias: ['format'],
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
