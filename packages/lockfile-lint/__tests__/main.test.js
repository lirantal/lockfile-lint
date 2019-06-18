'use strict'

const main = require('../src/main')

describe('Main CLI logic', () => {
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
