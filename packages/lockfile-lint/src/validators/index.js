'use strict'

const {ValidateHost, ParseLockFile, ValidateHttps} = require('lockfile-lint-api')
const debug = require('debug')

module.exports = {
  ValidateHostManager,
  ValidateHttpsManager
}

function ValidateHostManager({path, type, validatorOptions} = {}) {
  debug('validate-host-manager')(
    `invoked with validator options: ${JSON.stringify(validatorOptions)}`
  )

  const options = {
    lockFilePath: path
  }

  const parser = new ParseLockFile(options)
  const lockfile = parser.parseSync()
  const validator = new ValidateHost({packages: lockfile.object})

  return validator.validate(validatorOptions)
}

function ValidateHttpsManager({path, type, validatorOptions} = {}) {
  debug('validate-host-manager')(
    `invoked with validator options: ${JSON.stringify(validatorOptions)}`
  )

  const options = {
    lockFilePath: path
  }

  const parser = new ParseLockFile(options)
  const lockfile = parser.parseSync()
  const validator = new ValidateHttps({packages: lockfile.object})

  return validator.validate()
}
