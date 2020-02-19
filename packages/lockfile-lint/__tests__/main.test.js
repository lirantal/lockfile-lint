'use strict'

const path = require('path')
const main = require('../src/main')

describe('Main CLI logic', () => {
  describe('Invoking validators should handle errors and defaults', () => {
    test('when no validator function is provided expect to fail', () => {
      const lockfilePath = path.join(__dirname, '/fixtures/yarn-only-http.lock')
      const lockfileType = 'yarn'
      const validators = [
        {
          name: 'validateHttps',
          options: []
        }
      ]

      const result = main.runValidators({
        path: lockfilePath,
        type: lockfileType,
        validators
      })

      expect(result.validatorFailures).toEqual(2)
      expect(result.validatorCount).toEqual(1)
      expect(result.validatorSuccesses).toEqual(0)
    })

    test('should handle exceptions when validators arent provided for runValidators method', () => {
      expect(() => {
        main.runValidators()
      }).toThrow('provided object must have a validators array list')
    })
  })

  describe('validateHttp', () => {
    test('a failing validator should return proper validation failed object', () => {
      const lockfilePath = path.join(__dirname, '/fixtures/yarn-only-http.lock')
      const lockfileType = 'yarn'
      const validators = [
        {
          name: 'validateHttps',
          options: []
        }
      ]

      const result = main.runValidators({
        path: lockfilePath,
        type: lockfileType,
        validators
      })

      expect(result.validatorFailures).toEqual(2)
      expect(result.validatorCount).toEqual(1)
      expect(result.validatorSuccesses).toEqual(0)
    })

    test('a successful validator should return proper validation object', () => {
      const lockfilePath = path.join(__dirname, '/fixtures/yarn-only-https.lock')
      const lockfileType = 'yarn'
      const validators = [
        {
          name: 'validateHttps',
          options: []
        }
      ]

      const result = main.runValidators({
        path: lockfilePath,
        type: lockfileType,
        validators
      })

      expect(result.validatorFailures).toEqual(0)
      expect(result.validatorCount).toEqual(1)
      expect(result.validatorSuccesses).toEqual(1)
    })
  })

  describe('validateHosts', () => {
    test('a failing validator should return proper validation failed object', () => {
      const lockfilePath = path.join(__dirname, '/fixtures/yarn-only-https.lock')
      const lockfileType = 'yarn'
      const validators = [
        {
          name: 'validateHosts',
          values: ['npm']
        }
      ]

      const result = main.runValidators({
        path: lockfilePath,
        type: lockfileType,
        validators
      })

      expect(result.validatorFailures).toEqual(2)
      expect(result.validatorCount).toEqual(1)
      expect(result.validatorSuccesses).toEqual(0)
    })

    test('a failing validator should throw an error if an empty host is not allowed', () => {
      const lockfilePath = path.join(__dirname, '/fixtures/package-lock-empty-hostname.json')
      const lockfileType = 'npm'
      const validators = [
        {
          name: 'validateHosts',
          values: ['npm'],
          options: {
            emptyHostname: false
          }
        }
      ]

      const result = main.runValidators({
        path: lockfilePath,
        type: lockfileType,
        validators
      })

      expect(result.validatorFailures).toEqual(2)
      expect(result.validatorCount).toEqual(1)
      expect(result.validatorSuccesses).toEqual(0)
    })

    test('a successful validator should return proper validation object', () => {
      const lockfilePath = path.join(__dirname, '/fixtures/yarn-only-https.lock')
      const lockfileType = 'yarn'
      const validators = [
        {
          name: 'validateHosts',
          values: ['yarn']
        }
      ]

      const result = main.runValidators({
        path: lockfilePath,
        type: lockfileType,
        validators
      })

      expect(result.validatorFailures).toEqual(0)
      expect(result.validatorCount).toEqual(1)
      expect(result.validatorSuccesses).toEqual(1)
    })
  })

  describe('validateSchemes', () => {
    test('should fail validating allowed schemes for a package-lock.json file', () => {
      const lockfilePath = path.join(__dirname, '/fixtures/package-lock-git-scheme.json')
      const lockfileType = 'npm'
      const validators = [
        {
          name: 'validateSchemes',
          values: ['https']
        }
      ]

      const result = main.runValidators({
        path: lockfilePath,
        type: lockfileType,
        validators
      })

      expect(result.validatorFailures).toEqual(2)
      expect(result.validatorCount).toEqual(1)
      expect(result.validatorSuccesses).toEqual(0)
    })

    test('should succeed validating allowed schemes for a package-lock.json file', () => {
      const lockfilePath = path.join(__dirname, '/fixtures/package-lock-git-scheme.json')
      const lockfileType = 'npm'
      const validators = [
        {
          name: 'validateSchemes',
          values: ['https:', 'git+https:']
        }
      ]

      const result = main.runValidators({
        path: lockfilePath,
        type: lockfileType,
        validators
      })

      expect(result.validatorFailures).toEqual(0)
      expect(result.validatorCount).toEqual(1)
      expect(result.validatorSuccesses).toEqual(1)
    })

    test('should fail validating allowed schemes for a yarn.lock file', () => {
      const lockfilePath = path.join(__dirname, '/fixtures/yarn-lock-schemes.lock')
      const lockfileType = 'yarn'
      const validators = [
        {
          name: 'validateSchemes',
          values: ['https']
        }
      ]

      const result = main.runValidators({
        path: lockfilePath,
        type: lockfileType,
        validators
      })

      expect(result.validatorFailures).toEqual(3)
      expect(result.validatorCount).toEqual(1)
      expect(result.validatorSuccesses).toEqual(0)
    })

    test('should succeed validating allowed schemes for a yarn.lock file', () => {
      const lockfilePath = path.join(__dirname, '/fixtures/yarn-lock-schemes.lock')
      const lockfileType = 'yarn'
      const validators = [
        {
          name: 'validateSchemes',
          values: ['https:', 'git+https:']
        }
      ]

      const result = main.runValidators({
        path: lockfilePath,
        type: lockfileType,
        validators
      })

      expect(result.validatorFailures).toEqual(0)
      expect(result.validatorCount).toEqual(1)
      expect(result.validatorSuccesses).toEqual(1)
    })
  })
})
