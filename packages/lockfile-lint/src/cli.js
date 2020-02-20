'use strict'

const yargs = require('yargs')

const argv = yargs
  .version()
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
      describe: 'validates a whitelist of allowed schemes to be used for resources in the lockfile',
      conflicts: ['validate-https', 's']
    }
  })
  .example('lockfile-lint --path yarn.lock --validate-https')
  .example('lockfile-lint --path yarn.lock --validate-https --allowed-hosts npm yarn verdaccio')
  .example(
    'lockfile-lint --path yarn.lock --allowed-schemes "https:" "git+ssh:" --allowed-hosts npm yarn verdaccio'
  )
  .epilogue('curated by Liran Tal at https://github.com/lirantal/lockfile-lint')
  .detectLocale(false).argv

module.exports = argv
