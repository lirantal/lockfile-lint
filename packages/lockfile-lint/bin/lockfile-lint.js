#!/usr/bin/env node
'use strict'

const debug = require('debug')('lockfile-lint')
const main = require('../src/main')

let config

try {
  config = require('../src/config')(process.argv)
  debug(`parsed the following options: ${JSON.stringify(config)}`)
} catch (err) {
  debug(`error loading options from CLI arguments/files: ${err}`)
  process.exit(1)
}

let validators = []
const supportedValidators = new Map([
  ['allowed-hosts', 'validateHosts'],
  ['validate-https', 'validateHttps'],
  ['allowed-schemes', 'validateSchemes']
])

for (const [commandArgument, commandValue] of Object.entries(config)) {
  if (supportedValidators.has(commandArgument)) {
    const validatorItem = supportedValidators.get(commandArgument)
    validators.push({
      name: validatorItem,
      values: commandValue,
      options: {
        emptyHostname: config['empty-hostname']
      }
    })
  }
}

let result
try {
  result = main.runValidators({
    path: config['path'],
    type: config['type'],
    validators
  })
} catch (error) {
  console.error('ABORTING lockfile lint process due to error exceptions', '\n')
  console.error(error.message, '\n')
  console.error(error.stack, '\n')
  console.error('error: command failed with exit code 1', '\n')
  process.exit(1)
}

const {validatorCount, validatorFailures, validatorSuccesses} = result

debug(`total validators invoked: ${validatorCount}`)
debug(`total validator failures: ${validatorFailures}`)
debug(`total validator successes: ${validatorSuccesses}`)

if (validatorFailures !== 0) {
  console.error('error: command failed with exit code 1', '\n')
  process.exit(1)
}
