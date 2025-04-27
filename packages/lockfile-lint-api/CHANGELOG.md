# Change Log

## 5.9.2

### Patch Changes

- [`d91813411898315e8e064f616b698e129af40495`](https://github.com/lirantal/lockfile-lint/commit/d91813411898315e8e064f616b698e129af40495) Thanks [@lirantal](https://github.com/lirantal)! - fix: trailing slash catch in policy test

## 5.9.1

### Patch Changes

- [`2f7a477`](https://github.com/lirantal/lockfile-lint/commit/2f7a477ced649eb54d94f2572dda5f2daf26e5f0) Thanks [@lirantal](https://github.com/lirantal)! - fix: support for validatio integrity exception

## 5.9.0

### Minor Changes

- [`ff74c61`](https://github.com/lirantal/lockfile-lint/commit/ff74c61f92cabcb9e71f824e2022eb9b2bb96ead) Thanks [@lirantal](https://github.com/lirantal)! - add --integrity-exclude CLI option

## 5.8.0

### Minor Changes

- [#178](https://github.com/lirantal/lockfile-lint/pull/178) [`acf87b8`](https://github.com/lirantal/lockfile-lint/commit/acf87b8047a0a457fff269ee80b90a570926be04) Thanks [@lirantal](https://github.com/lirantal)! - New CLI flag to add package name and aliases as trusted policy

## 5.7.0

### Minor Changes

- [#172](https://github.com/lirantal/lockfile-lint/pull/172) [`ebe0637`](https://github.com/lirantal/lockfile-lint/commit/ebe06370b52d7eac0b297097e7c093719b9bace1) Thanks [@lirantal](https://github.com/lirantal)! - Add verbose information in debug

## 5.6.0

### Minor Changes

- [#169](https://github.com/lirantal/lockfile-lint/pull/169) [`c7817c6`](https://github.com/lirantal/lockfile-lint/commit/c7817c68cb2bcfeb471a55e39a44e3f8cbf69b4f) Thanks [@lirantal](https://github.com/lirantal)! - Add support for npm lockfile v3 format

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 5.5.5 (2023-05-24)

### Bug Fixes

- error variable was shadowed by function ([#162](https://github.com/lirantal/lockfile-lint/issues/162)) ([17fe528](https://github.com/lirantal/lockfile-lint/commit/17fe528))

## 5.5.4 (2023-05-24)

**Note:** Version bump only for package lockfile-lint-api

## 5.5.3 (2023-05-24)

**Note:** Version bump only for package lockfile-lint-api

## 5.5.2 (2023-05-23)

### Bug Fixes

- error handling for empty yarn lock files ([#158](https://github.com/lirantal/lockfile-lint/issues/158)) ([#159](https://github.com/lirantal/lockfile-lint/issues/159)) ([bb96f4c](https://github.com/lirantal/lockfile-lint/commit/bb96f4c))

## 5.5.1 (2023-02-13)

**Note:** Version bump only for package lockfile-lint-api

# 5.5.0 (2022-12-26)

### Features

- add support for yarn berry lockfiles ([#147](https://github.com/lirantal/lockfile-lint/issues/147)) ([d4cf64d](https://github.com/lirantal/lockfile-lint/commit/d4cf64d))

## 5.4.6 (2022-10-08)

### Bug Fixes

- cli parsing - handle correctly false value for validator ([#146](https://github.com/lirantal/lockfile-lint/issues/146)) ([8f7e4c7](https://github.com/lirantal/lockfile-lint/commit/8f7e4c7))

## 5.4.5 (2022-09-30)

### Bug Fixes

- **integrity:** rename command-line argument from `--validate-integrity-sha512` to `--validate-integrity` ([#144](https://github.com/lirantal/lockfile-lint/issues/144)) ([a29d18b](https://github.com/lirantal/lockfile-lint/commit/a29d18b))

## 5.4.4 (2022-09-27)

**Note:** Version bump only for package lockfile-lint-api

## 5.4.3 (2022-09-26)

**Note:** Version bump only for package lockfile-lint-api

## 5.4.2 (2022-09-26)

### Bug Fixes

- too noisy error messages ([#139](https://github.com/lirantal/lockfile-lint/issues/139)) ([ab2ee5d](https://github.com/lirantal/lockfile-lint/commit/ab2ee5d))

## 5.4.1 (2022-09-26)

**Note:** Version bump only for package lockfile-lint-api

# 5.4.0 (2022-09-26)

### Features

- **validator:** add new integrity hash type validator ([#135](https://github.com/lirantal/lockfile-lint/issues/135)) ([46d0fa7](https://github.com/lirantal/lockfile-lint/commit/46d0fa7))

# 5.3.0 (2022-08-10)

### Features

- add format options for report output ([#134](https://github.com/lirantal/lockfile-lint/issues/134)) ([4667c3d](https://github.com/lirantal/lockfile-lint/commit/4667c3d))

## 5.2.7 (2022-07-22)

**Note:** Version bump only for package lockfile-lint-api

## 5.2.6 (2022-07-02)

### Bug Fixes

- **lockfile-lint-api:** remove extra console.log in yarn.lock parsing ([#131](https://github.com/lirantal/lockfile-lint/issues/131)) ([75bb6d2](https://github.com/lirantal/lockfile-lint/commit/75bb6d2))

## 5.2.5 (2022-06-11)

### Bug Fixes

- continues [#125](https://github.com/lirantal/lockfile-lint/issues/125) with lockfile update ([#130](https://github.com/lirantal/lockfile-lint/issues/130)) ([988347f](https://github.com/lirantal/lockfile-lint/commit/988347f))

## 5.2.4 (2022-03-13)

**Note:** Version bump only for package lockfile-lint-api

## 5.2.3 (2022-03-10)

**Note:** Version bump only for package lockfile-lint-api

## 5.2.2 (2022-03-10)

**Note:** Version bump only for package lockfile-lint-api

## 5.2.1 (2022-03-10)

**Note:** Version bump only for package lockfile-lint-api

# 5.2.0 (2022-03-09)

### Features

- validate package names ([#114](https://github.com/lirantal/lockfile-lint/issues/114)) ([7aa0b3d](https://github.com/lirantal/lockfile-lint/commit/7aa0b3d))

## 5.1.8 (2021-05-04)

### Bug Fixes

- missing git step on release with lerna ([#111](https://github.com/lirantal/lockfile-lint/issues/111)) ([5fcd65b](https://github.com/lirantal/lockfile-lint/commit/5fcd65b))

## [5.1.7](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.1.6...lockfile-lint-api@5.1.7) (2021-02-26)

### Bug Fixes

- **parser:** Fix exception on empty dependencies ([#107](https://github.com/lirantal/lockfile-lint/issues/107)) ([1ab87a9](https://github.com/lirantal/lockfile-lint/commit/1ab87a9))

## [5.1.6](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.1.5...lockfile-lint-api@5.1.6) (2020-05-13)

### Bug Fixes

- support host:port syntax ([#94](https://github.com/lirantal/lockfile-lint/issues/94)) ([37d8eef](https://github.com/lirantal/lockfile-lint/commit/37d8eef))

## [5.1.5](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.1.2...lockfile-lint-api@5.1.5) (2020-05-13)

### Bug Fixes

- **hostvalidator:** support full urls for host ([#88](https://github.com/lirantal/lockfile-lint/issues/88)) ([d0002e7](https://github.com/lirantal/lockfile-lint/commit/d0002e7))
- bump package ver that skipped releases ([7d239ca](https://github.com/lirantal/lockfile-lint/commit/7d239ca))

## [5.1.3](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.1.2...lockfile-lint-api@5.1.3) (2020-04-30)

### Bug Fixes

- **hostvalidator:** support full urls for host ([#88](https://github.com/lirantal/lockfile-lint/issues/88)) ([d0002e7](https://github.com/lirantal/lockfile-lint/commit/d0002e7))

## [5.1.2](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.1.1...lockfile-lint-api@5.1.2) (2020-03-25)

**Note:** Version bump only for package lockfile-lint-api

## [5.1.1](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.1.0...lockfile-lint-api@5.1.1) (2020-03-24)

### Bug Fixes

- **refactor:** use includes() instead of indexOf() ([#86](https://github.com/lirantal/lockfile-lint/issues/86)) ([ab50386](https://github.com/lirantal/lockfile-lint/commit/ab50386))

# [5.1.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.0.12...lockfile-lint-api@5.1.0) (2020-03-23)

### Features

- **validators:** add URL validator ([#52](https://github.com/lirantal/lockfile-lint/issues/52)) ([e81ffe9](https://github.com/lirantal/lockfile-lint/commit/e81ffe9))

## [5.0.12](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.0.11...lockfile-lint-api@5.0.12) (2020-02-10)

**Note:** Version bump only for package lockfile-lint-api

## [5.0.11](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.0.10...lockfile-lint-api@5.0.11) (2020-02-10)

**Note:** Version bump only for package lockfile-lint-api

## [5.0.10](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.0.9...lockfile-lint-api@5.0.10) (2020-02-04)

### Bug Fixes

- **validators:** host validator enforced with URLs only ([#61](https://github.com/lirantal/lockfile-lint/issues/61)) ([036edbf](https://github.com/lirantal/lockfile-lint/commit/036edbf))

## [5.0.9](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.0.8...lockfile-lint-api@5.0.9) (2020-02-04)

### Bug Fixes

- **validators:** only validating when URL is present ([#59](https://github.com/lirantal/lockfile-lint/issues/59)) ([dcf4e40](https://github.com/lirantal/lockfile-lint/commit/dcf4e40)), closes [#53](https://github.com/lirantal/lockfile-lint/issues/53)

## [5.0.8](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.0.7...lockfile-lint-api@5.0.8) (2020-02-03)

### Bug Fixes

- **api:** lint all dependencies in package-lock ([#53](https://github.com/lirantal/lockfile-lint/issues/53)) ([f5bb8ca](https://github.com/lirantal/lockfile-lint/commit/f5bb8ca))

## [5.0.7](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.0.6...lockfile-lint-api@5.0.7) (2020-01-17)

**Note:** Version bump only for package lockfile-lint-api

## [5.0.6](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.0.5...lockfile-lint-api@5.0.6) (2020-01-17)

**Note:** Version bump only for package lockfile-lint-api

## [5.0.5](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.0.4...lockfile-lint-api@5.0.5) (2020-01-16)

### Bug Fixes

- **validators:** skip packages with no resolved field ([#43](https://github.com/lirantal/lockfile-lint/issues/43)) ([4d4aaf3](https://github.com/lirantal/lockfile-lint/commit/4d4aaf3))

## [5.0.4](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.0.3...lockfile-lint-api@5.0.4) (2019-12-23)

**Note:** Version bump only for package lockfile-lint-api

## [5.0.3](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.0.2...lockfile-lint-api@5.0.3) (2019-12-18)

**Note:** Version bump only for package lockfile-lint-api

## [5.0.2](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.0.1...lockfile-lint-api@5.0.2) (2019-11-28)

### Bug Fixes

- **docs:** typo in project README ([#29](https://github.com/lirantal/lockfile-lint/issues/29)) ([4229a03](https://github.com/lirantal/lockfile-lint/commit/4229a03))

## [5.0.1](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@5.0.0...lockfile-lint-api@5.0.1) (2019-11-22)

**Note:** Version bump only for package lockfile-lint-api

# [5.0.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@2.3.0...lockfile-lint-api@5.0.0) (2019-11-22)

### Features

- **emptyhostname:** allow empty hostnames in api ([#27](https://github.com/lirantal/lockfile-lint/issues/27)) ([ef9f599](https://github.com/lirantal/lockfile-lint/commit/ef9f599)), closes [#23](https://github.com/lirantal/lockfile-lint/issues/23) [#25](https://github.com/lirantal/lockfile-lint/issues/25)

### BREAKING CHANGES

- **emptyhostname:** lockfile-lint-api internal method API has changed its function
  signature to allow receiving a value, and then an options object in a second
  argument.

Relevant issues:

# [4.0.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@2.3.0...lockfile-lint-api@4.0.0) (2019-11-22)

### Features

- **emptyhostname:** allow empty hostnames in api ([#27](https://github.com/lirantal/lockfile-lint/issues/27)) ([ef9f599](https://github.com/lirantal/lockfile-lint/commit/ef9f599)), closes [#23](https://github.com/lirantal/lockfile-lint/issues/23) [#25](https://github.com/lirantal/lockfile-lint/issues/25)

### BREAKING CHANGES

- **emptyhostname:** lockfile-lint-api internal method API has changed its function
  signature to allow receiving a value, and then an options object in a second
  argument.

Relevant issues:

# [3.0.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@2.3.0...lockfile-lint-api@3.0.0) (2019-11-22)

### Features

- **emptyhostname:** allow empty hostnames in api ([#27](https://github.com/lirantal/lockfile-lint/issues/27)) ([ef9f599](https://github.com/lirantal/lockfile-lint/commit/ef9f599)), closes [#23](https://github.com/lirantal/lockfile-lint/issues/23) [#25](https://github.com/lirantal/lockfile-lint/issues/25)

### BREAKING CHANGES

- **emptyhostname:** lockfile-lint-api internal method API has changed its function
  signature to allow receiving a value, and then an options object in a second
  argument.

Relevant issues:

# [2.3.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@2.2.0...lockfile-lint-api@2.3.0) (2019-11-07)

### Features

- **errors:** provide the actual bad string in ValidateScheme ([#20](https://github.com/lirantal/lockfile-lint/issues/20)) ([45fb7d2](https://github.com/lirantal/lockfile-lint/commit/45fb7d2))

# [2.2.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@2.1.4...lockfile-lint-api@2.2.0) (2019-10-24)

### Features

- **errors:** user friendly error messages in lockfile parsing ([#22](https://github.com/lirantal/lockfile-lint/issues/22)) ([17654d0](https://github.com/lirantal/lockfile-lint/commit/17654d0))

## [2.1.4](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@2.1.3...lockfile-lint-api@2.1.4) (2019-10-15)

### Bug Fixes

- **readme:** fixing typo in README.md example ([#19](https://github.com/lirantal/lockfile-lint/issues/19)) ([7307a74](https://github.com/lirantal/lockfile-lint/commit/7307a74))

## [2.1.3](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@2.1.2...lockfile-lint-api@2.1.3) (2019-10-13)

### Bug Fixes

- **errors:** verbose error message includes package name ([#13](https://github.com/lirantal/lockfile-lint/issues/13)) ([f4ec3a1](https://github.com/lirantal/lockfile-lint/commit/f4ec3a1))

## [2.1.2](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@2.1.1...lockfile-lint-api@2.1.2) (2019-10-13)

### Bug Fixes

- **package:** remove tests and other files from published package ([#15](https://github.com/lirantal/lockfile-lint/issues/15)) ([1e61938](https://github.com/lirantal/lockfile-lint/commit/1e61938))

## [2.1.1](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@2.1.0...lockfile-lint-api@2.1.1) (2019-10-12)

### Bug Fixes

- **docs:** update API usage of ValidateScheme ([a1d113b](https://github.com/lirantal/lockfile-lint/commit/a1d113b))

# [2.1.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@2.0.0...lockfile-lint-api@2.1.0) (2019-10-12)

### Features

- **schema:** support protocol schema and refactor host validators ([#12](https://github.com/lirantal/lockfile-lint/issues/12)) ([a483115](https://github.com/lirantal/lockfile-lint/commit/a483115))

# [2.0.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@1.0.7...lockfile-lint-api@2.0.0) (2019-07-22)

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

## [1.0.7](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@1.0.6...lockfile-lint-api@1.0.7) (2019-06-19)

### Bug Fixes

- **readme:** update contribution link and open todos ([536f5e8](https://github.com/lirantal/lockfile-lint/commit/536f5e8))

## [1.0.6](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@1.0.5...lockfile-lint-api@1.0.6) (2019-06-19)

**Note:** Version bump only for package lockfile-lint-api

## [1.0.5](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@1.0.4...lockfile-lint-api@1.0.5) (2019-06-18)

**Note:** Version bump only for package lockfile-lint-api

## [1.0.4](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@1.0.1...lockfile-lint-api@1.0.4) (2019-06-18)

### Bug Fixes

- **keywords:** use proper package keywords format when publishing to npm ([bf05a80](https://github.com/lirantal/lockfile-lint/commit/bf05a80))
- **tests:** cleanup unnecessary function call ([49cbe72](https://github.com/lirantal/lockfile-lint/commit/49cbe72))

## [1.0.3](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@1.0.1...lockfile-lint-api@1.0.3) (2019-06-18)

### Bug Fixes

- **keywords:** use proper package keywords format when publishing to npm ([bf05a80](https://github.com/lirantal/lockfile-lint/commit/bf05a80))
- **tests:** cleanup unnecessary function call ([49cbe72](https://github.com/lirantal/lockfile-lint/commit/49cbe72))

## [1.0.2](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint-api@1.0.1...lockfile-lint-api@1.0.2) (2019-06-18)

### Bug Fixes

- **keywords:** use proper package keywords format when publishing to npm ([bf05a80](https://github.com/lirantal/lockfile-lint/commit/bf05a80))
- **tests:** cleanup unnecessary function call ([49cbe72](https://github.com/lirantal/lockfile-lint/commit/49cbe72))

## 1.0.1 (2019-06-11)

### Bug Fixes

- **readme:** use correct export name ([f962950](https://github.com/lirantal/lockfile-lint/commit/f962950))
