'use strict'

const main = require('../src/main')

describe('Main CLI logic', () => {
  describe('Invoking validators should handle errors and defaults', () => {
    test('when no validator function is provided expect to fail', () => {
      const lockfilePath = `${__dirname}/fixtures/yarn-only-http.lock`
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
      const lockfilePath = `${__dirname}/fixtures/yarn-only-http.lock`
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
      const lockfilePath = `${__dirname}/fixtures/yarn-only-https.lock`
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
      const lockfilePath = `${__dirname}/fixtures/yarn-only-https.lock`
      const lockfileType = 'yarn'
      const validators = [
        {
          name: 'validateHosts',
          options: ['npm']
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
      const lockfilePath = `${__dirname}/fixtures/yarn-only-https.lock`
      const lockfileType = 'yarn'
      const validators = [
        {
          name: 'validateHosts',
          options: ['yarn']
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
