const ValidateResolved = require('../src/validators/ValidateResolved')

describe('Validator: Resolved', () => {
  it('validator should throw an error when provided a string', () => {
    expect(() => new ValidateResolved('ss')).toThrowError()
  })

  it('validator should throw an error when provided null', () => {
    expect(() => new ValidateResolved(null)).toThrowError()
  })

  it('validator should throw an error when provided undefined', () => {
    expect(() => new ValidateResolved()).toThrowError()
  })

  it('validator should throw an error when provided array', () => {
    expect(() => new ValidateResolved(['a'])).toThrowError()
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
      }
    }

    const validator = new ValidateResolved({packages: mockedPackages})
    expect(validator.validate()).toEqual({
      type: 'success',
      errors: []
    })
  })

  it('validator should fail if package has no `resolved` field', () => {
    const mockedPackages = {
      '@babel/code-frame@^0.16.0': {
        resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      meow: {},
      '@babel/generator@3.2.1': {}
    }

    const validator = new ValidateResolved({packages: mockedPackages})
    expect(validator.validate()).toEqual({
      type: 'error',
      errors: [
        {
          message: 'missing resolved field for package: meow\n',
          package: 'meow'
        },
        {
          message: 'missing resolved field for package: @babel/generator\n',
          package: '@babel/generator'
        }
      ]
    })
  })
})
