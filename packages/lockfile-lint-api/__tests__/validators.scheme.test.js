const ValidatorScheme = require('../src/validators/ValidateScheme')
const PackageError = require('../src/common/PackageError')

describe('Validator: Protocol', () => {
  it('validator should throw an error when provided a string', () => {
    expect(() => new ValidatorScheme('ss')).toThrowError()
  })
  it('validator should throw an error when provided null', () => {
    expect(() => new ValidatorScheme(null)).toThrowError()
  })
  it('validator should throw an error when provided an object', () => {
    expect(() => new ValidatorScheme({asda: 1234})).toThrowError()
  })

  it('validator should throw error if not provided array of values', () => {
    const mockedPackages = {
      '@babel/code-frame': {
        resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz'
      }
    }
    const validator = new ValidatorScheme({packages: mockedPackages})
    expect(() => validator.validate()).toThrow(`validate method requires an array`)
  })

  it('validator should fail if finding a non-https resource', () => {
    const allowedProtocols = ['https:']
    const mockedPackages = {
      '@babel/code-frame': {
        resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      meow: {
        resolved: 'http://registry.npmjs.org/meow/-/meow-4.0.1.tgz'
      },
      '@babel/generator': {
        resolved: 'git+ssh://registry.npmjs.org/@babel/generator/-/generator-7.4.4.tgz'
      }
    }
    const validator = new ValidatorScheme({packages: mockedPackages})
    expect(validator.validate(allowedProtocols)).toEqual({
      type: 'error',
      errors: [
        {
          message: `detected invalid scheme(s) for package: meow\n    expected: ${allowedProtocols}\n    actual: http:\n`,
          package: 'meow'
        },
        {
          message: `detected invalid scheme(s) for package: @babel/generator\n    expected: ${allowedProtocols}\n    actual: git+ssh:\n`,
          package: '@babel/generator'
        }
      ]
    })
  })

  it('validator should succeed if resources match provided protocols', () => {
    const mockedPackages = {
      '@babel/code-frame': {
        resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      meow: {
        resolved: 'https://registry.npmjs.org/meow/-/meow-4.0.1.tgz'
      },
      '@babel/generator': {
        resolved: 'git+ssh://registry.npmjs.org/@babel/generator/-/generator-7.4.4.tgz'
      }
    }
    const validator = new ValidatorScheme({packages: mockedPackages})
    expect(validator.validate(['https:', 'git+ssh:'])).toEqual({
      type: 'success',
      errors: []
    })
  })

  it('validator should throw a descriptive error when one is encounterd in a package', () => {
    const mockedPackages = {
      '@babel/code-frame': {
        resolved: 'debug-4.1.1.tgz#3b72260255109c6b589cee050f1d516139664791'
      }
    }
    const validator = new ValidatorScheme({packages: mockedPackages})

    expect(() => validator.validate(['npm'])).toThrow(PackageError)
  })
})
