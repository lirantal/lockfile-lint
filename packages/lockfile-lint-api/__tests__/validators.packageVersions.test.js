const ValidatePackageVersions = require('../src/validators/ValidatePackageVersions')

describe('Validator: PackageVersions', () => {
  it('validator should throw an error when provided a string', () => {
    expect(() => new ValidatePackageVersions('ss')).toThrowError()
  })

  it('validator should throw an error when provided null', () => {
    expect(() => new ValidatePackageVersions(null)).toThrowError()
  })

  it('validator should throw an error when provided undefined', () => {
    expect(() => new ValidatePackageVersions()).toThrowError()
  })

  it('validator should throw an error when provided array', () => {
    expect(() => new ValidatePackageVersions(['a'])).toThrowError()
  })

  it('validator should fail if resource URLs are not for correct package versions', () => {
    const mockedPackages = {
      '@babel/code-frame@^0.16.0': {
        resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-0.17.0.tgz'
      },
      'meow@1.0.0': {
        resolved: 'https://registry.npmjs.org/meow/-/meow-4.0.1.tgz'
      },
      '@babel/generator@~3.2.1': {
        resolved: 'https://registry.npmjs.org/@babel/generator/-/generator-7.4.4.tgz'
      }
    }

    const validator = new ValidatePackageVersions({packages: mockedPackages})
    expect(validator.validate()).toEqual({
      type: 'error',
      errors: [
        {
          package: '@babel/code-frame',
          message:
            expect.stringContaining('expected: ^0.16.0') &&
            expect.stringContaining('actual: 0.17.0')
        },
        {
          package: 'meow',
          message:
            expect.stringContaining('expected: 1.0.0') && expect.stringContaining('actual: 4.0.1')
        },
        {
          package: '@babel/generator',
          message:
            expect.stringContaining('expected: ~3.2.1') && expect.stringContaining('actual: 7.4.4')
        }
      ]
    })
  })

  it('validator should succeed if package has no `resolved` field', () => {
    const mockedPackages = {
      '@babel/code-frame@^0.16.0': {
        resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-0.16.0.tgz'
      },
      meow: {},
      '@babel/generator@3.2.1': {
        resolved: 'https://registry.npmjs.org/@babel/generator/-/generator-3.2.1.tgz'
      }
    }

    const validator = new ValidatePackageVersions({packages: mockedPackages})
    expect(validator.validate()).toEqual({
      type: 'success',
      errors: []
    })
  })
})
