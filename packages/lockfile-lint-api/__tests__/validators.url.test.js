const ValidatorUrl = require('../src/validators/ValidateUrl')

describe('Validator: Url', () => {
  it('validator should throw an error when provided a string', () => {
    expect(() => new ValidatorUrl('ss')).toThrowError()
  })

  it('validator should throw an error when provided null', () => {
    expect(() => new ValidatorUrl(null)).toThrowError()
  })

  it('validator should throw an error when provided array', () => {
    expect(() => new ValidatorUrl(['a'])).toThrowError()
  })

  it('validator should throw an error instantiated with no value', () => {
    expect(() => new ValidatorUrl()).toThrowError()
  })

  it('validator should fail if not allowed url is used for a resource', () => {
    const mockedPackages = {
      bolt11: {
        resolved: 'https://github.com/LN-Zap/bolt11#0492874ea9ced4ab49bf0f59a62368687f147247'
      }
    }

    const validator = new ValidatorUrl({packages: mockedPackages})
    expect(validator.validate(['https://registry.npmjs.org'])).toEqual({
      type: 'error',
      errors: [
        {
          message: `detected invalid url(s) for package: bolt11\n    expected: https://registry.npmjs.org\n    actual: https://github.com/LN-Zap/bolt11#0492874ea9ced4ab49bf0f59a62368687f147247\n`,
          package: 'bolt11'
        }
      ]
    })
  })

  it('validator should succeed if all resources are from an allowed URL', () => {
    const mockedPackages = {
      '@babel/code-frame': {
        resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      meow: {
        resolved: 'https://registry.npmjs.org/meow/-/meow-4.0.1.tgz'
      },
      '@babel/generator': {
        resolved: 'https://registry.npmjs.org/@babel/generator/-/generator-7.4.4.tgz'
      }
    }

    const validator = new ValidatorUrl({packages: mockedPackages})
    expect(
      validator.validate([
        'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz',
        'https://registry.npmjs.org/meow/-/meow-4.0.1.tgz',
        'https://registry.npmjs.org/@babel/generator/-/generator-7.4.4.tgz'
      ])
    ).toEqual({
      type: 'success',
      errors: []
    })
  })

  it('validator should fail if validate method receives a non-array value', () => {
    const mockedPackages = {
      '@babel/code-frame': {
        resolved: 'https://registry.yarnpkg.com/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      meow: {
        resolved: 'http://registry.npmjs.org/meow/-/meow-4.0.1.tgz'
      },
      '@babel/generator': {
        resolved: 'https://registry.npmjs.org/@babel/generator/-/generator-7.4.4.tgz'
      }
    }

    const validator = new ValidatorUrl({packages: mockedPackages})
    expect(() => {
      validator.validate(null)
    }).toThrowError(`validate method requires an array`)
  })

  it('validator should not fail even if one of the packages has no `resolved` field', () => {
    const mockedPackages = {
      '@babel/code-frame': {
        resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      meow: {}
    }
    const validator = new ValidatorUrl({packages: mockedPackages})

    expect(
      validator.validate(['https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz'])
    ).toEqual({
      type: 'success',
      errors: []
    })
  })

  it('validator should return true for a single package with a valid URL', () => {
    const mockedPackages = {
      'bolt11@https://github.com/LN-Zap/bolt11#0492874ea9ced4ab49bf0f59a62368687f147247': {
        resolved: 'https://github.com/LN-Zap/bolt11#0492874ea9ced4ab49bf0f59a62368687f147247'
      }
    }
    const validator = new ValidatorUrl({packages: mockedPackages})

    expect(
      validator.validateSingle(
        'bolt11@https://github.com/LN-Zap/bolt11#0492874ea9ced4ab49bf0f59a62368687f147247',
        ['https://github.com/LN-Zap/bolt11#0492874ea9ced4ab49bf0f59a62368687f147247']
      )
    ).toEqual(true)
  })

  it('validator should return false for a single package with an invalid URL', () => {
    const mockedPackages = {
      'bolt11@https://github.com/LN-Zap/bolt11#0492874ea9ced4ab49bf0f59a62368687f147247': {
        resolved: 'https://github.com/LN-Zap/bolt11#0492874ea9ced4ab49bf0f59a62368687f147247'
      }
    }
    const validator = new ValidatorUrl({packages: mockedPackages})

    expect(
      validator.validateSingle(
        'bolt11@https://github.com/LN-Zap/bolt11#0492874ea9ced4ab49bf0f59a62368687f147247',
        ['https://github.com/LN-Zap/bolt11']
      )
    ).toEqual(false)
  })

  it('validator should return true for a single package that does not have a resolved URL', () => {
    const mockedPackages = {
      meow: {}
    }
    const validator = new ValidatorUrl({packages: mockedPackages})

    expect(validator.validateSingle('meow', ['https://github.com/LN-Zap/bolt11'])).toEqual(true)
  })
})
