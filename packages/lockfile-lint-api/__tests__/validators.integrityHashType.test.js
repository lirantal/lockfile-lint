const ValidateIntegrity = require('../src/validators/ValidateIntegrity')

describe('Validator: Integrity', () => {
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

  it('validator should throw an error when excludedPackages is not an array', () => {
    const options = {
      integrityExclude: 'not-an-array'
    }

    const validator = new ValidateIntegrity({packages: {}})
    expect(() => validator.validate(options)).toThrowError()
  })

  it('validator should fail if not allowed hash type is used for a resource', () => {
    const mockedPackages = {
      'bolt11@1.4.1-3e38a8b13f29678e59705efec18f590e50272676': {
        integrity: 'sha1-1ZNEUixLxGSmWnMKxpUAf9tm3Yg='
      }
    }

    const validator = new ValidateIntegrity({packages: mockedPackages})
    expect(validator.validate()).toEqual({
      type: 'error',
      errors: [
        {
          message:
            'detected invalid integrity hash type for package: bolt11@1.4.1-3e38a8b13f29678e59705efec18f590e50272676\n    expected: sha512\n    actual: sha1-1ZNEUixLxGSmWnMKxpUAf9tm3Yg=\n',
          package: 'bolt11@1.4.1-3e38a8b13f29678e59705efec18f590e50272676'
        }
      ]
    })
  })

  it('validator should succeed if all resources are from an allowed hash type', () => {
    const mockedPackages = {
      '@types/node@20.11.17-14733ac8d7ad65e47f20fc8c2b20bd58ef37c9f5': {
        integrity:
          'sha512-CK2fnrQlIgKlCV3N2kM+Gznb5USlwA1KFX3rJVHmgVk6NJxFPuQ86pAcvKnu37IA4BGlSRz7sEE1lHL1aLZ/eQ=='
      },
      'typescript@5.0.0-d5998c40b92db6ac7b06359242cf43afc8b499f4': {
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
      'typescript@5.0.0-d5998c40b92db6ac7b06359242cf43afc8b499f4': {
        integrity:
          'sha512-goMHfm00nWPa8UvR/CPSvykqf6dVV8x/dp0c5mFTMTIu0u0FlGWRioyy7Nn0PGAdHxpJZnuO/ut+PpQ8UiHAig=='
      },
      'meow@13.0.0-0478ab49a1d0b9808d0ea088db43c980a15dfc4b': {}
    }
    const validator = new ValidateIntegrity({packages: mockedPackages})

    expect(validator.validate()).toEqual({
      type: 'success',
      errors: []
    })
  })

  it('validator should not fail if an excluded package has an invalid integrity hash type', () => {
    const mockedPackages = {
      'typescript@5.0.0-d5998c40b92db6ac7b06359242cf43afc8b499f4': {
        integrity: 'sha1-1ZNEUixLxGSmWnMKxpUAf9tm3Yg='
      }
    }
    const options = {
      integrityExclude: ['typescript']
    }

    const validator = new ValidateIntegrity({packages: mockedPackages})
    expect(validator.validate(options)).toEqual({
      type: 'success',
      errors: []
    })
  })

  it('validator should not match excluded package by partial name', () => {
    const mockedPackages = {
      'common-prefix-package@1.0.0-30f09ab54e1d572758bd0673b8b96b5df96ec1fa': {
        integrity: 'sha1-1ZNEUixLxGSmWnMKxpUAf9tm3Yg='
      }
    }
    const options = {
      integrityExclude: ['common-prefix']
    }

    const validator = new ValidateIntegrity({packages: mockedPackages})
    expect(validator.validate(options)).toEqual({
      type: 'error',
      errors: [
        {
          message:
            'detected invalid integrity hash type for package: common-prefix-package@1.0.0-30f09ab54e1d572758bd0673b8b96b5df96ec1fa\n    expected: sha512\n    actual: sha1-1ZNEUixLxGSmWnMKxpUAf9tm3Yg=\n',
          package: 'common-prefix-package@1.0.0-30f09ab54e1d572758bd0673b8b96b5df96ec1fa'
        }
      ]
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
