'use strict'

const {LOCKFILE_TYPES} = require('./constants')

const errorMessages = {
  NO_OPTIONS: () => 'Did not recive options for lockfile path or type',
  NO_PARSER_FOR_TYPE: type =>
    `Unable to find relevant lockfile parser for type "${type}", the currently available options are ${LOCKFILE_TYPES}.`,
  NO_PARSER_FOR_PATH: path =>
    `Unable to find relevant lockfile parser for "${path}", consider passing the --type option.`,
  READ_FAILED: path => `Unable to read lockfile "${path}"`,
  PARSE_NPMLOCKFILE_FAILED: path => `Unable to parse npm lockfile "${path}"`,
  PARSE_YARNLOCKFILE_FAILED: path => `Unable to parse yarn lockfile "${path}"`
}

const ERROR_KEYS = Object.keys(errorMessages).reduce(function (accumulator, key) {
  return Object.assign(accumulator, {[key]: key})
}, {})

class ParsingError extends Error {
  /**
   * constructor
   * @param {string} errorKey - the key corresponding to the error message
   * @param {string} relatedValue - the value related to the error, to be used in the error message
   * @param {Error} error - the original error (if one exists)
   */
  constructor (errorKey = '', relatedValue = '', error = {}) {
    super()
    this.name = 'ParsingError'
    // eslint-disable-next-line security/detect-object-injection
    const getMessage = errorMessages[errorKey]
    this.message = getMessage ? getMessage(relatedValue) : 'INVALID ERROR KEY'
    this.stack = error.stack || new Error().stack
  }
}

module.exports = {
  ParsingError,
  ERROR_KEYS
}
