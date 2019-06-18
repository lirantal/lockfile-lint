const ValidatorHost = require('../src/validators/ValidateHost')

describe('Validator: Host', () => {
  it('validator should throw an error when provided a string', () => {
    expect(() => new ValidatorHost('ss')).toThrowError()
  })

  it('validator should throw an error when provided null', () => {
    expect(() => new ValidatorHost(null)).toThrowError()
  })

  it('validator should throw an error when provided array', () => {
    expect(() => new ValidatorHost(['a'])).toThrowError()
  })

  it('validator should throw an error instantiated with no value', () => {
    expect(() => new ValidatorHost()).toThrowError()
  })

  it('validator should fail if not allowed host is used for a resource', () => {
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

    const validator = new ValidatorHost({packages: mockedPackages})
    expect(validator.validate(['npm'])).toEqual({
      type: 'error',
      errors: [
        {
          message: 'detected invalid origin for package: @babel/code-frame',
          package: '@babel/code-frame'
        },
        {
          message: 'detected invalid origin for package: meow',
          package: 'meow'
        }
      ]
    })
  })

  it('validator should succeed if all resources are from a valid host alias', () => {
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

    const validator = new ValidatorHost({packages: mockedPackages})
    expect(() => {
      validator.validate(['npm'])
    }).not.toThrow()
  })

  it('validator should succeed if all resources are from a valid list of host aliases', () => {
    const mockedPackages = {
      '@babel/code-frame': {
        resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      meow: {
        resolved: 'https://registry.yarnpkg.com/meow/-/meow-4.0.1.tgz'
      },
      '@babel/generator': {
        resolved: 'https://registry.npmjs.org/@babel/generator/-/generator-7.4.4.tgz'
      }
    }

    const validator = new ValidatorHost({packages: mockedPackages})
    expect(() => {
      validator.validate(['npm', 'yarn'])
    }).not.toThrow()
  })

  it('validator should succeed if all resources are matching a host address', () => {
    const mockedPackages = {
      '@babel/code-frame': {
        resolved: 'https://registry.verdaccio.org/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      meow: {
        resolved: 'https://registry.verdaccio.org/meow/-/meow-4.0.1.tgz'
      },
      '@babel/generator': {
        resolved: 'https://registry.verdaccio.org/@babel/generator/-/generator-7.4.4.tgz'
      }
    }

    const validator = new ValidatorHost({packages: mockedPackages})
    expect(() => {
      validator.validate(['https://registry.verdaccio.org'])
    }).not.toThrow()
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

    const validator = new ValidatorHost({packages: mockedPackages})
    expect(() => {
      validator.validate(null)
    }).toThrowError(`validate method requires an array`)
  })
})
