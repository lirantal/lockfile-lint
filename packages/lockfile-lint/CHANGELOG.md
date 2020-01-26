# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.9](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.8...lockfile-lint@3.0.9) (2020-01-26)

**Note:** Version bump only for package lockfile-lint





## [3.0.8](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.7...lockfile-lint@3.0.8) (2020-01-17)

**Note:** Version bump only for package lockfile-lint





## [3.0.7](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.6...lockfile-lint@3.0.7) (2020-01-17)

**Note:** Version bump only for package lockfile-lint





## [3.0.6](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.5...lockfile-lint@3.0.6) (2020-01-16)

**Note:** Version bump only for package lockfile-lint





## [3.0.5](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.4...lockfile-lint@3.0.5) (2019-12-23)

**Note:** Version bump only for package lockfile-lint





## [3.0.4](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.3...lockfile-lint@3.0.4) (2019-12-18)

**Note:** Version bump only for package lockfile-lint





## [3.0.3](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.2...lockfile-lint@3.0.3) (2019-11-28)

**Note:** Version bump only for package lockfile-lint





## [3.0.2](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.1...lockfile-lint@3.0.2) (2019-11-22)

**Note:** Version bump only for package lockfile-lint





## [3.0.1](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.0...lockfile-lint@3.0.1) (2019-11-22)

**Note:** Version bump only for package lockfile-lint





# [3.0.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@2.2.0...lockfile-lint@3.0.0) (2019-11-22)

### Features

- **emptyhostname:** allow empty hostnames in lockfiles ([#26](https://github.com/lirantal/lockfile-lint/issues/26)) ([7d859e1](https://github.com/lirantal/lockfile-lint/commit/7d859e1))

### BREAKING CHANGES

- **emptyhostname:** lockfile-lint-api internal method API has changed its function signature
  to allow receiving a value, and then an options object in a second argument.

Relevant issues:

- https://github.com/lirantal/lockfile-lint/issues/23
- https://github.com/lirantal/lockfile-lint/issues/25

# [2.2.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@2.1.6...lockfile-lint@2.2.0) (2019-11-07)

### Features

- **errors:** provide the actual bad string in ValidateScheme ([#20](https://github.com/lirantal/lockfile-lint/issues/20)) ([45fb7d2](https://github.com/lirantal/lockfile-lint/commit/45fb7d2))

## [2.1.6](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@2.1.5...lockfile-lint@2.1.6) (2019-10-24)

**Note:** Version bump only for package lockfile-lint

## [2.1.5](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@2.1.4...lockfile-lint@2.1.5) (2019-10-15)

**Note:** Version bump only for package lockfile-lint

## [2.1.4](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@2.1.3...lockfile-lint@2.1.4) (2019-10-13)

### Bug Fixes

- **errors:** verbose error message includes package name ([#13](https://github.com/lirantal/lockfile-lint/issues/13)) ([f4ec3a1](https://github.com/lirantal/lockfile-lint/commit/f4ec3a1))

## [2.1.3](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@2.1.2...lockfile-lint@2.1.3) (2019-10-13)

### Bug Fixes

- **package:** remove tests and other files from published package ([#15](https://github.com/lirantal/lockfile-lint/issues/15)) ([1e61938](https://github.com/lirantal/lockfile-lint/commit/1e61938))

## [2.1.2](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@2.1.1...lockfile-lint@2.1.2) (2019-10-12)

**Note:** Version bump only for package lockfile-lint

## [2.1.1](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@2.1.0...lockfile-lint@2.1.1) (2019-10-12)

**Note:** Version bump only for package lockfile-lint

# [2.1.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@2.0.1...lockfile-lint@2.1.0) (2019-10-12)

### Features

- **schema:** support protocol schema and refactor host validators ([#12](https://github.com/lirantal/lockfile-lint/issues/12)) ([a483115](https://github.com/lirantal/lockfile-lint/commit/a483115))

## [2.0.1](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@2.0.0...lockfile-lint@2.0.1) (2019-07-22)

### Bug Fixes

- **readme:** cleaned up accidental text in readme ([#3](https://github.com/lirantal/lockfile-lint/issues/3)) ([cc50a6b](https://github.com/lirantal/lockfile-lint/commit/cc50a6b))

# [2.0.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@1.3.4...lockfile-lint@2.0.0) (2019-07-22)

### Features

- support npm lockfile parsing ([#2](https://github.com/lirantal/lockfile-lint/issues/2)) ([b94ab49](https://github.com/lirantal/lockfile-lint/commit/b94ab49))

### BREAKING CHANGES

- exported lockfile parser util renamed

- feat(parsers): compatability with new yarn/npm parsers

BREAKING CHANGE

- feat(parsers): support npm parser

- build(yarn): update CI version of yarn

- build(cache): disable all cache

- fix(filenames): case-sensitive filename changed

- fix(file): removed old file

## [1.3.4](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@1.3.3...lockfile-lint@1.3.4) (2019-06-19)

### Bug Fixes

- **readme:** update contribution link and open todos ([536f5e8](https://github.com/lirantal/lockfile-lint/commit/536f5e8))

## [1.3.3](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@1.3.2...lockfile-lint@1.3.3) (2019-06-19)

**Note:** Version bump only for package lockfile-lint

## [1.3.2](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@1.3.1...lockfile-lint@1.3.2) (2019-06-19)

**Note:** Version bump only for package lockfile-lint

## [1.3.1](https://github.com/lirantal/lockfile-lint/tree/master/packages/lockfile-lint/compare/lockfile-lint@1.3.0...lockfile-lint@1.3.1) (2019-06-18)

**Note:** Version bump only for package lockfile-lint

# 1.3.0 (2019-06-18)

### Bug Fixes

- **tests:** cleanup unnecessary function call ([49cbe72](https://github.com/lirantal/lockfile-lint/tree/master/packages/lockfile-lint/commit/49cbe72))

### Features

- **lockfile-lint:** 🎉 cli tool initial version ([05fdbaa](https://github.com/lirantal/lockfile-lint/tree/master/packages/lockfile-lint/commit/05fdbaa))

# 1.2.0 (2019-06-18)

### Bug Fixes

- **tests:** cleanup unnecessary function call ([49cbe72](https://github.com/lirantal/lockfile-lint/tree/master/packages/lockfile-lint/commit/49cbe72))

### Features

- **lockfile-lint:** 🎉 cli tool initial version ([05fdbaa](https://github.com/lirantal/lockfile-lint/tree/master/packages/lockfile-lint/commit/05fdbaa))

# 1.1.0 (2019-06-18)

### Bug Fixes

- **tests:** cleanup unnecessary function call ([49cbe72](https://github.com/lirantal/lockfile-lint/tree/master/packages/lockfile-lint/commit/49cbe72))

### Features

- **lockfile-lint:** 🎉 cli tool initial version ([05fdbaa](https://github.com/lirantal/lockfile-lint/tree/master/packages/lockfile-lint/commit/05fdbaa))
