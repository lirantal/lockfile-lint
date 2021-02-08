#!/usr/bin/env node
'use strict'

const debug = require('debug')('lockfile-lint')
const main = require('../src/main')

const isSupported =
  process.platform !== 'win32' || process.env.CI || process.env.TERM === 'xterm-256color'

const symbolsDefault = {
  info: 'ℹ',
  success: '✔',
  error: '✖'
}

const symbolsFallback = {
  info: 'i',
  success: '√',
  error: '×'
}

const symbols = isSupported ? symbolsDefault : symbolsFallback

const RESET = '\x1b[0m'
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'

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
  ['allowed-schemes', 'validateSchemes'],
  ['allowed-urls', 'validateUrls']
])

for (const [commandArgument, commandValue] of Object.entries(config)) {
  /**
   * If we have both --allowed-urls and --allowed-hosts flags active
   * then we can skip doing the work for allowed urls as the validator
   * for allowed hosts will check for both.
   *
   * We only need to run the check for allowed urls if the user does not
   * specify allowed hosts.
   */
  if (commandArgument === 'allowed-urls' && config['allowed-hosts']) {
    continue
  }

  if (supportedValidators.has(commandArgument)) {
    const validatorItem = supportedValidators.get(commandArgument)
    validators.push({
      name: validatorItem,
      values: commandValue,
      options: {
        emptyHostname: config['empty-hostname'],
        allowedHosts: config['allowed-hosts'],
        allowedUrls: config['allowed-urls']
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
  console.error(
    YELLOW,
    `${symbols.info} ABORTING lockfile lint process due to error exceptions`,
    '\n',
    RESET
  )
  console.error(error.message, '\n')
  console.error(error.stack, '\n')
  console.error(RED, `${symbols.error} Error: command failed with exit code 1`, '\n', RESET)
  process.exit(1)
}

const {validatorCount, validatorFailures, validatorSuccesses} = result

debug(`total validators invoked: ${validatorCount}`)
debug(`total validator failures: ${validatorFailures}`)
debug(`total validator successes: ${validatorSuccesses}`)

if (validatorFailures !== 0) {
  console.error(RED, `${symbols.error} Error: security issues detected!`, '\n', RESET)
  process.exit(1)
} else {
  console.info(GREEN, `${symbols.success} No issues detected`, '\n', RESET)
}
