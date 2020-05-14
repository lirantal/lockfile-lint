'use strict'

const {
  ValidateHost,
  ParseLockfile,
  ValidateHttps,
  ValidateScheme,
  ValidateUrl
} = require('lockfile-lint-api')
const debug = require('debug')('lockfile-lint')

module.exports = {
  ValidateHostManager,
  ValidateHttpsManager,
  ValidateSchemeManager,
  ValidateUrlManager
}

function ValidateSchemeManager ({path, type, validatorValues, validatorOptions}) {
  debug(
    `validate-scheme-manager invoked with validator options: ${JSON.stringify(validatorValues)}`
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
  debug(`validate-host-manager invoked with validator options: ${JSON.stringify(validatorValues)}`)

  const options = {
    lockfilePath: path,
    lockfileType: type
  }

  const parser = new ParseLockfile(options)
  const lockfile = parser.parseSync()
  const validator = new ValidateHost({packages: lockfile.object})
  const validationResult = validator.validate(validatorValues, validatorOptions)

  // Check if some of the errors are for allowed URLs and filter those out
  if (validatorOptions && validatorOptions.allowedUrls) {
    const urlValidator = new ValidateUrl({packages: lockfile.object})

    validationResult.errors = validationResult.errors.filter(
      result => !urlValidator.validateSingle(result.package, validatorOptions.allowedUrls)
    )

    // If we don't have any errors left at this point make sure it's a success type
    if (!validationResult.errors.length) {
      validationResult.type = 'success'
    }
  }

  return validationResult
}

function ValidateHttpsManager ({path, type, validatorValues, validatorOptions}) {
  debug(`validate-host-manager invoked with validator options: ${JSON.stringify(validatorValues)}`)

  const options = {
    lockfilePath: path,
    lockfileType: type
  }

  const parser = new ParseLockfile(options)
  const lockfile = parser.parseSync()
  const validator = new ValidateHttps({packages: lockfile.object})

  return validator.validate()
}

function ValidateUrlManager ({path, type, validatorValues, validatorOptions}) {
  debug(`validate-url-manager invoked with validator options: ${JSON.stringify(validatorValues)}`)

  const options = {
    lockfilePath: path,
    lockfileType: type
  }

  const parser = new ParseLockfile(options)
  const lockfile = parser.parseSync()
  const validator = new ValidateUrl({packages: lockfile.object})

  return validator.validate(validatorValues, validatorOptions)
}
