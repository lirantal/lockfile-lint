const ValidateIntegrity = require('../src/validators/ValidateIntegrity')

describe('Validator: IntegrityHashType', () => {
  it('validator should throw an error when provided a string', () => {
    expect(() => new ValidateIntegrity('ss')).toThrowError()
  })

  it('validator should throw an error when provided null', () => {
    expect(() => new ValidateIntegrity(null)).toThrowError()
  })

  it('validator should throw an error when provided array', () => {
    expect(() => new ValidateIntegrity(['a'])).toThrowError()
  })

  it('validator should throw an error instantiated with no value', () => {
    expect(() => new ValidateIntegrity()).toThrowError()
  })

  it('validator should fail if not allowed hash type is used for a resource', () => {
    const mockedPackages = {
      bolt11: {
        integrity: 'sha1-1ZNEUixLxGSmWnMKxpUAf9tm3Yg='
      }
    }

    const validator = new ValidateIntegrity({packages: mockedPackages})
    expect(validator.validate()).toEqual({
      type: 'error',
      errors: [
        {
          message: `detected invalid integrity hash type for package: bolt11\n    expected: sha512\n    actual: sha1-1ZNEUixLxGSmWnMKxpUAf9tm3Yg=\n`,
          package: 'bolt11'
        }
      ]
    })
  })

  it('validator should succeed if all resources are from an allowed hash type', () => {
    const mockedPackages = {
      '@types/node': {
        integrity:
          'sha512-CK2fnrQlIgKlCV3N2kM+Gznb5USlwA1KFX3rJVHmgVk6NJxFPuQ86pAcvKnu37IA4BGlSRz7sEE1lHL1aLZ/eQ=='
      },
      typescript: {
        integrity:
          'sha512-goMHfm00nWPa8UvR/CPSvykqf6dVV8x/dp0c5mFTMTIu0u0FlGWRioyy7Nn0PGAdHxpJZnuO/ut+PpQ8UiHAig=='
      }
    }

    const validator = new ValidateIntegrity({packages: mockedPackages})
    expect(validator.validate()).toEqual({
      type: 'success',
      errors: []
    })
  })

  it('validator should not fail even if one of the packages has no `integrity` field', () => {
    const mockedPackages = {
      typescript: {
        integrity:
          'sha512-goMHfm00nWPa8UvR/CPSvykqf6dVV8x/dp0c5mFTMTIu0u0FlGWRioyy7Nn0PGAdHxpJZnuO/ut+PpQ8UiHAig=='
      },
      meow: {}
    }
    const validator = new ValidateIntegrity({packages: mockedPackages})

    expect(validator.validate()).toEqual({
      type: 'success',
      errors: []
    })
  })

  it('validator should return true for a single package with a valid URL', () => {
    const mockedPackages = {
      typescript: {
        resolved:
          'sha512-goMHfm00nWPa8UvR/CPSvykqf6dVV8x/dp0c5mFTMTIu0u0FlGWRioyy7Nn0PGAdHxpJZnuO/ut+PpQ8UiHAig=='
      }
    }
    const validator = new ValidateIntegrity({packages: mockedPackages})

    expect(validator.validateSingle('typescript')).toEqual(true)
  })

  it('validator should return false for a single package with an invalid integrity hash type', () => {
    const mockedPackages = {
      typescript: {
        integrity: 'sha1-1ZNEUixLxGSmWnMKxpUAf9tm3Yg='
      }
    }
    const validator = new ValidateIntegrity({packages: mockedPackages})

    expect(validator.validateSingle('typescript')).toEqual(false)
  })

  it('validator should return true for a single package that does not have integrity', () => {
    const mockedPackages = {
      meow: {}
    }
    const validator = new ValidateIntegrity({packages: mockedPackages})

    expect(validator.validateSingle('meow')).toEqual(true)
  })
})
