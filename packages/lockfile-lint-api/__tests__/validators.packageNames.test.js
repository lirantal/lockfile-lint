const ValidatePackageNames = require('../src/validators/ValidatePackageNames')

describe('Validator: PackageName', () => {
  it('validator should throw an error when provided a string', () => {
    expect(() => new ValidatePackageNames('ss')).toThrowError()
  })

  it('validator should throw an error when provided null', () => {
    expect(() => new ValidatePackageNames(null)).toThrowError()
  })

  it('validator should throw an error when provided array', () => {
    expect(() => new ValidatePackageNames(['a'])).toThrowError()
  })

  it('validator should fail if a resolved URL for a different package is found', () => {
    const failedPackage = 'meow'
    const maliciousPackage = 'malicious'
    const mockedPackages = {
      '@babel/code-frame@^0.16.0': {
        resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      'meow@1.0.0': {
        resolved: `https://registry.npmjs.org/${maliciousPackage}/-/meow-4.0.1.tgz`
      },
      '@babel/generator@3.2.1': {
        resolved: 'https://registry.npmjs.org/@babel/generator/-/generator-7.4.4.tgz'
      }
    }

    const validator = new ValidatePackageNames({packages: mockedPackages})
    const expectedValidationResult = {
      type: 'error',
      errors: [
        {
          message: `detected resolved URL for package with a different name: ${failedPackage}\n    expected: ${failedPackage}\n    actual: ${maliciousPackage}\n`,
          package: failedPackage
        }
      ]
    }
    expect(validator.validate()).toEqual(expectedValidationResult)
  })

  it('validator should succeed if all resource URLs are for correct packages', () => {
    const mockedPackages = {
      '@babel/code-frame@^0.16.0': {
        resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      'meow@1.0.0': {
        resolved: 'https://registry.npmjs.org/meow/-/meow-4.0.1.tgz'
      },
      '@babel/generator@3.2.1': {
        resolved: 'https://registry.npmjs.org/@babel/generator/-/generator-7.4.4.tgz'
      },
      avsc: {
        resolved: 'https://github.com/Bundlr-Network/avsc#a730cc8018b79e114b6a3381bbb57760a24c6cef'
      }
    }

    const validator = new ValidatePackageNames({packages: mockedPackages})
    expect(validator.validate()).toEqual({
      type: 'success',
      errors: []
    })
  })

  it('validator should succeed if package has no `resolved` field', () => {
    const mockedPackages = {
      '@babel/code-frame@^0.16.0': {
        resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      meow: {},
      '@babel/generator@3.2.1': {
        resolved: 'https://registry.npmjs.org/@babel/generator/-/generator-7.4.4.tgz'
      }
    }

    const validator = new ValidatePackageNames({packages: mockedPackages})
    expect(validator.validate()).toEqual({
      type: 'success',
      errors: []
    })
  })
})
