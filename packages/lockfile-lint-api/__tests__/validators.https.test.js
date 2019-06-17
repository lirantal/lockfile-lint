const ValidatorHTTPS = require('../src/validators/ValidateHttps')

describe('Validator: HTTPS', () => {
  it('validator should throw an error when provided a string', () => {
    expect(() => new ValidatorHTTPS('ss')).toThrowError()
  })

  it('validator should throw an error when provided null', () => {
    expect(() => new ValidatorHTTPS(null)).toThrowError()
  })

  it('validator should throw an error when provided array', () => {
    expect(() => new ValidatorHTTPS(['a'])).toThrowError()
  })

  it('validator should fail if finding a non-https resource', () => {
    const failedPackage = 'meow'
    const mockedPackages = {
      '@babel/code-frame': {
        resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      meow: {
        resolved: 'http://registry.npmjs.org/meow/-/meow-4.0.1.tgz'
      },
      '@babel/generator': {
        resolved: 'https://registry.npmjs.org/@babel/generator/-/generator-7.4.4.tgz'
      }
    }

    const validator = new ValidatorHTTPS({packages: mockedPackages})
    expect(validator.validate()).toEqual({
      type: 'error',
      errors: [
        {
          message: `detected non-https protocol used for package: ${failedPackage}`,
          package: failedPackage
        }
      ]
    })
  })

  it('validator should succeed if all resources are https', () => {
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

    const validator = new ValidatorHTTPS({packages: mockedPackages})
    expect(validator.validate()).toEqual({
      type: 'success',
      errors: []
    })
  })
})
