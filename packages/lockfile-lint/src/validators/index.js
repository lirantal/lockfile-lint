'use strict'

const {ValidateHost, ParseLockfile, ValidateHttps, ValidateScheme} = require('lockfile-lint-api')
const debug = require('debug')

module.exports = {
  ValidateHostManager,
  ValidateHttpsManager,
  ValidateSchemeManager
}

function ValidateSchemeManager ({path, type, validatorValues, validatorOptions}) {
  debug('validate-scheme-manager')(
    `invoked with validator options: ${JSON.stringify(validatorValues)}`
  )

  const options = {
    lockfilePath: path,
    lockfileType: type
  }

  const parser = new ParseLockfile(options)
  const lockfile = parser.parseSync()
  const validator = new ValidateScheme({packages: lockfile.object})

  return validator.validate(validatorValues)
}

function ValidateHostManager ({path, type, validatorValues, validatorOptions}) {
  debug('validate-host-manager')(
    `invoked with validator options: ${JSON.stringify(validatorValues)}`
  )

  const options = {
    lockfilePath: path,
    lockfileType: type
  }

  const parser = new ParseLockfile(options)
  const lockfile = parser.parseSync()
  const validator = new ValidateHost({packages: lockfile.object})

  return validator.validate(validatorValues, validatorOptions)
}

function ValidateHttpsManager ({path, type, validatorValues, validatorOptions}) {
  debug('validate-host-manager')(
    `invoked with validator options: ${JSON.stringify(validatorValues)}`
  )

  const options = {
    lockfilePath: path,
    lockfileType: type
  }

  const parser = new ParseLockfile(options)
  const lockfile = parser.parseSync()
  const validator = new ValidateHttps({packages: lockfile.object})

  return validator.validate()
}
