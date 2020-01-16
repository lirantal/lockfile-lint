const ValidatorHost = require('../src/validators/ValidateHost')
const PackageError = require('../src/common/PackageError')

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
          message: `detected invalid host(s) for package: @babel/code-frame\n    expected: registry.npmjs.org\n    actual: registry.yarnpkg.com\n`,
          package: '@babel/code-frame'
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

  it('validator should allow for git-based URLs', () => {
    const mockedPackages = {
      '@babel/code-frame': {
        resolved: 'https://registry.yarnpkg.com/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      meow: {
        resolved: 'git+ssh://lirantal@github.com/lirantal/dockly.git#1234567890'
      },
      '@babel/generator': {
        resolved: 'https://registry.npmjs.org/@babel/generator/-/generator-7.4.4.tgz'
      }
    }

    const validator = new ValidatorHost({packages: mockedPackages})
    expect(validator.validate(['npm', 'github.com'])).toEqual({
      type: 'error',
      errors: [
        {
          message: `detected invalid host(s) for package: @babel/code-frame\n    expected: registry.npmjs.org,github.com\n    actual: registry.yarnpkg.com\n`,
          package: '@babel/code-frame'
        }
      ]
    })
  })

  it('validator should throw a descriptive error when one is encounterd in a package', () => {
    const mockedPackages = {
      '@babel/code-frame': {
        resolved: 'debug-4.1.1.tgz#3b72260255109c6b589cee050f1d516139664791'
      }
    }
    const validator = new ValidatorHost({packages: mockedPackages})

    expect(() => validator.validate(['npm'])).toThrow(PackageError)
  })

  it('validator should not throw if emptyHostnames are allowed', () => {
    const mockedPackages = {
      '@babel/code-frame': {
        resolved: 'github:XhmikosR/metalsmith-permalinks#master'
      }
    }
    const validator = new ValidatorHost({packages: mockedPackages})

    expect(
      validator.validate(['npm'], {
        emptyHostname: true
      })
    ).toEqual({
      type: 'success',
      errors: []
    })
  })

  it('validator should return errors if emptyHostnames are not allowed', () => {
    const mockedPackages = {
      '@babel/code-frame': {
        resolved: 'github:XhmikosR/metalsmith-permalinks#master'
      }
    }
    const validator = new ValidatorHost({packages: mockedPackages})

    expect(
      validator.validate(['npm'], {
        emptyHostname: false
      })
    ).toEqual({
      type: 'error',
      errors: [
        {
          message: `detected invalid host(s) for package: @babel/code-frame\n    expected: registry.npmjs.org\n    actual: \n`,
          package: '@babel/code-frame'
        }
      ]
    })
  })

  it('validator should not throw if package has no `resolved` field', () => {
    const mockedPackages = {
      '@babel/code-frame': {
        resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      meow: {}
    }
    const validator = new ValidatorHost({packages: mockedPackages})

    expect(() => {
      validator.validate(['npm'])
    }).not.toThrow()
  })
})
