#!/usr/bin/env node
'use strict'

const debug = require('debug')('lockfile-lint')
const {ValidateHostManager, ValidateHttpsManager} = require('../src/validators')
const cli = require('../src/cli')
debug(`parsed the following CLI arguments: ${JSON.stringify(cli)}`)

const validators = new Map([
  ['allowed-hosts', ValidateHostManager],
  ['validate-https', ValidateHttpsManager]
])
let validatorCount = 0
let validatorFailures = 0
let validatorSuccesses = 0

validators.forEach((Validator, commandArgument) => {
  if (cli.hasOwnProperty(commandArgument) !== true) {
    return false
  }

  validatorCount++
  debug(`invoking validator for: ${commandArgument}`)

  let validationResult

  // eslint-disable-next-line security/detect-object-injection
  try {
    validationResult = Validator({
      path: cli['path'],
      type: cli['type'],
      validatorOptions: cli[commandArgument]
    })
  } catch (error) {
    console.error('ABORTING lockfile lint process due to error exceptions')
    console.error(error.message)
    console.error(error.stack)
    console.error('error: command failed with exit code 1')
    process.exit(1)
  }

  if (validationResult.type === 'error') {
    validationResult.errors.forEach(validationError => {
      console.error(validationError.message)
      validatorFailures++
    })
  } else {
    debug(`validator ${commandArgument} reported no issues`)
    validatorSuccesses++
  }
})

debug(`total validators invoked: ${validatorCount}`)
debug(`total validator failures: ${validatorFailures}`)
debug(`total validator failures: ${validatorSuccesses}`)

if (validatorFailures !== 0) {
  console.error('error: command failed with exit code 1')
  process.exit(1)
}
