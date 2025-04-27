# Change Log

## 4.14.0

### Minor Changes

- [`e0739b8829f158ba6f739759fcb41f03f3b60142`](https://github.com/lirantal/lockfile-lint/commit/e0739b8829f158ba6f739759fcb41f03f3b60142) Thanks [@lirantal](https://github.com/lirantal)! - fix: cosmiconfig dependency upgrade for better lockfile-lint config file support

## 4.13.2

### Patch Changes

- [`889c016`](https://github.com/lirantal/lockfile-lint/commit/889c016ea3ed338eede27e5e4c4a81587375e996) Thanks [@lirantal](https://github.com/lirantal)! - docs: update instructions for working with cosmiconfig files

## 4.13.1

### Patch Changes

- [`2f7a477`](https://github.com/lirantal/lockfile-lint/commit/2f7a477ced649eb54d94f2572dda5f2daf26e5f0) Thanks [@lirantal](https://github.com/lirantal)! - fix: support for validatio integrity exception

- Updated dependencies [[`2f7a477`](https://github.com/lirantal/lockfile-lint/commit/2f7a477ced649eb54d94f2572dda5f2daf26e5f0)]:
  - lockfile-lint-api@5.9.1

## 4.13.0

### Minor Changes

- [`ff74c61`](https://github.com/lirantal/lockfile-lint/commit/ff74c61f92cabcb9e71f824e2022eb9b2bb96ead) Thanks [@lirantal](https://github.com/lirantal)! - add --integrity-exclude CLI option

### Patch Changes

- Updated dependencies [[`ff74c61`](https://github.com/lirantal/lockfile-lint/commit/ff74c61f92cabcb9e71f824e2022eb9b2bb96ead)]:
  - lockfile-lint-api@5.9.0

## 4.12.1

### Patch Changes

- [`745aa65`](https://github.com/lirantal/lockfile-lint/commit/745aa65346204a7a74531feef1a4f73c7718820d) Thanks [@lirantal](https://github.com/lirantal)! - fix: --version command-line was throwing an error related to glob matching

## 4.12.0

### Minor Changes

- [#182](https://github.com/lirantal/lockfile-lint/pull/182) [`8e0294a`](https://github.com/lirantal/lockfile-lint/commit/8e0294aea9996a3cbce30810475b4a829a91828c) Thanks [@lirantal](https://github.com/lirantal)! - Add support for glob matching multiple lockfiles

## 4.11.0

### Minor Changes

- [#178](https://github.com/lirantal/lockfile-lint/pull/178) [`acf87b8`](https://github.com/lirantal/lockfile-lint/commit/acf87b8047a0a457fff269ee80b90a570926be04) Thanks [@lirantal](https://github.com/lirantal)! - New CLI flag to add package name and aliases as trusted policy

### Patch Changes

- Updated dependencies [[`acf87b8`](https://github.com/lirantal/lockfile-lint/commit/acf87b8047a0a457fff269ee80b90a570926be04)]:
  - lockfile-lint-api@5.8.0

## 4.10.6

### Patch Changes

- [#165](https://github.com/lirantal/lockfile-lint/pull/165) [`625817f`](https://github.com/lirantal/lockfile-lint/commit/625817fa2087b7206eb373c6a6a1b237b4637215) Thanks [@lirantal](https://github.com/lirantal)! - Friendly error messages by referencing the long-form CLI flag

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.10.5 (2023-05-24)

### Bug Fixes

- error variable was shadowed by function ([#162](https://github.com/lirantal/lockfile-lint/issues/162)) ([17fe528](https://github.com/lirantal/lockfile-lint/commit/17fe528))

## 4.10.4 (2023-05-24)

**Note:** Version bump only for package lockfile-lint

## 4.10.3 (2023-05-24)

**Note:** Version bump only for package lockfile-lint

## 4.10.2 (2023-05-23)

### Bug Fixes

- error handling for empty yarn lock files ([#158](https://github.com/lirantal/lockfile-lint/issues/158)) ([#159](https://github.com/lirantal/lockfile-lint/issues/159)) ([bb96f4c](https://github.com/lirantal/lockfile-lint/commit/bb96f4c))

## 4.10.1 (2023-02-13)

**Note:** Version bump only for package lockfile-lint

# 4.10.0 (2022-12-26)

### Features

- add support for yarn berry lockfiles ([#147](https://github.com/lirantal/lockfile-lint/issues/147)) ([d4cf64d](https://github.com/lirantal/lockfile-lint/commit/d4cf64d))

## 4.9.6 (2022-10-08)

### Bug Fixes

- cli parsing - handle correctly false value for validator ([#146](https://github.com/lirantal/lockfile-lint/issues/146)) ([8f7e4c7](https://github.com/lirantal/lockfile-lint/commit/8f7e4c7))

## 4.9.5 (2022-09-30)

### Bug Fixes

- **integrity:** rename command-line argument from `--validate-integrity-sha512` to `--validate-integrity` ([#144](https://github.com/lirantal/lockfile-lint/issues/144)) ([a29d18b](https://github.com/lirantal/lockfile-lint/commit/a29d18b))

## 4.9.4 (2022-09-27)

**Note:** Version bump only for package lockfile-lint

## 4.9.3 (2022-09-26)

**Note:** Version bump only for package lockfile-lint

## 4.9.2 (2022-09-26)

### Bug Fixes

- too noisy error messages ([#139](https://github.com/lirantal/lockfile-lint/issues/139)) ([ab2ee5d](https://github.com/lirantal/lockfile-lint/commit/ab2ee5d))

## 4.9.1 (2022-09-26)

**Note:** Version bump only for package lockfile-lint

# 4.9.0 (2022-09-26)

### Features

- **validator:** add new integrity hash type validator ([#135](https://github.com/lirantal/lockfile-lint/issues/135)) ([46d0fa7](https://github.com/lirantal/lockfile-lint/commit/46d0fa7))

# 4.8.0 (2022-08-10)

### Features

- add format options for report output ([#134](https://github.com/lirantal/lockfile-lint/issues/134)) ([4667c3d](https://github.com/lirantal/lockfile-lint/commit/4667c3d))

## 4.7.7 (2022-07-22)

**Note:** Version bump only for package lockfile-lint

## 4.7.6 (2022-07-02)

### Bug Fixes

- **lockfile-lint-api:** remove extra console.log in yarn.lock parsing ([#131](https://github.com/lirantal/lockfile-lint/issues/131)) ([75bb6d2](https://github.com/lirantal/lockfile-lint/commit/75bb6d2))

## 4.7.5 (2022-06-11)

### Bug Fixes

- continues [#125](https://github.com/lirantal/lockfile-lint/issues/125) with lockfile update ([#130](https://github.com/lirantal/lockfile-lint/issues/130)) ([988347f](https://github.com/lirantal/lockfile-lint/commit/988347f))

## 4.7.4 (2022-03-13)

**Note:** Version bump only for package lockfile-lint

## 4.7.3 (2022-03-10)

**Note:** Version bump only for package lockfile-lint

## 4.7.2 (2022-03-10)

**Note:** Version bump only for package lockfile-lint

## 4.7.1 (2022-03-10)

**Note:** Version bump only for package lockfile-lint

# 4.7.0 (2022-03-09)

### Features

- validate package names ([#114](https://github.com/lirantal/lockfile-lint/issues/114)) ([7aa0b3d](https://github.com/lirantal/lockfile-lint/commit/7aa0b3d))

## 4.6.3 (2021-05-04)

### Bug Fixes

- missing git step on release with lerna ([#111](https://github.com/lirantal/lockfile-lint/issues/111)) ([5fcd65b](https://github.com/lirantal/lockfile-lint/commit/5fcd65b))

## [4.6.2](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.6.1...lockfile-lint@4.6.2) (2021-02-26)

**Note:** Version bump only for package lockfile-lint

## [4.6.1](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.6.0...lockfile-lint@4.6.1) (2021-02-20)

**Note:** Version bump only for package lockfile-lint

# [4.6.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.3.8...lockfile-lint@4.6.0) (2021-02-19)

### Features

- use log sysmbols for easier to read output ([#21](https://github.com/lirantal/lockfile-lint/issues/21)) ([#104](https://github.com/lirantal/lockfile-lint/issues/104)) ([281c8ec](https://github.com/lirantal/lockfile-lint/commit/281c8ec))

# [4.5.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.3.8...lockfile-lint@4.5.0) (2021-02-19)

### Features

- use log sysmbols for easier to read output ([#21](https://github.com/lirantal/lockfile-lint/issues/21)) ([#104](https://github.com/lirantal/lockfile-lint/issues/104)) ([281c8ec](https://github.com/lirantal/lockfile-lint/commit/281c8ec))

# [4.4.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.3.8...lockfile-lint@4.4.0) (2021-02-09)

### Features

- use log sysmbols for easier to read output ([#21](https://github.com/lirantal/lockfile-lint/issues/21)) ([#104](https://github.com/lirantal/lockfile-lint/issues/104)) ([281c8ec](https://github.com/lirantal/lockfile-lint/commit/281c8ec))

## [4.3.8](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.3.7...lockfile-lint@4.3.8) (2020-11-21)

### Bug Fixes

- packages/lockfile-lint/package.json to reduce vulnerabilities ([#98](https://github.com/lirantal/lockfile-lint/issues/98)) ([2aed559](https://github.com/lirantal/lockfile-lint/commit/2aed559))

## [4.3.7](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.3.6...lockfile-lint@4.3.7) (2020-06-24)

### Bug Fixes

- **readme:** update docs for allowed-schemes ([#97](https://github.com/lirantal/lockfile-lint/issues/97)) ([e763b99](https://github.com/lirantal/lockfile-lint/commit/e763b99)), closes [#91](https://github.com/lirantal/lockfile-lint/issues/91)

## [4.3.6](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.3.5...lockfile-lint@4.3.6) (2020-05-14)

### Bug Fixes

- **windows:** remove emoji from output not supported on windows ([#96](https://github.com/lirantal/lockfile-lint/issues/96)) ([6115d68](https://github.com/lirantal/lockfile-lint/commit/6115d68))

## [4.3.5](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.3.4...lockfile-lint@4.3.5) (2020-05-14)

### Bug Fixes

- all debug under lockfile-lint namespace ([#95](https://github.com/lirantal/lockfile-lint/issues/95)) ([a86485b](https://github.com/lirantal/lockfile-lint/commit/a86485b))

## [4.3.4](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.3.3...lockfile-lint@4.3.4) (2020-05-13)

**Note:** Version bump only for package lockfile-lint

## [4.3.3](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.3.1...lockfile-lint@4.3.3) (2020-05-13)

### Bug Fixes

- bump package ver that skipped releases ([7d239ca](https://github.com/lirantal/lockfile-lint/commit/7d239ca))

## [4.3.1](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.3.0...lockfile-lint@4.3.1) (2020-05-13)

### Bug Fixes

- **readme:** update example 3 remove invalid argument ([#90](https://github.com/lirantal/lockfile-lint/issues/90)) ([828868c](https://github.com/lirantal/lockfile-lint/commit/828868c))

# [4.3.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.2.2...lockfile-lint@4.3.0) (2020-04-30)

### Features

- add validation success console message ([#87](https://github.com/lirantal/lockfile-lint/issues/87)) ([3ff6eb8](https://github.com/lirantal/lockfile-lint/commit/3ff6eb8))

## [4.2.2](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.2.1...lockfile-lint@4.2.2) (2020-03-25)

**Note:** Version bump only for package lockfile-lint

## [4.2.1](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.2.0...lockfile-lint@4.2.1) (2020-03-24)

### Bug Fixes

- **readme:** update README with --allowed-urls option ([#83](https://github.com/lirantal/lockfile-lint/issues/83)) ([237b680](https://github.com/lirantal/lockfile-lint/commit/237b680))

# [4.2.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.1.0...lockfile-lint@4.2.0) (2020-03-23)

### Features

- **validators:** add URL validator ([#52](https://github.com/lirantal/lockfile-lint/issues/52)) ([e81ffe9](https://github.com/lirantal/lockfile-lint/commit/e81ffe9))

# [4.1.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@4.0.0...lockfile-lint@4.1.0) (2020-03-09)

### Features

- **cli:** add file-based configuration ([#75](https://github.com/lirantal/lockfile-lint/issues/75)) ([e183593](https://github.com/lirantal/lockfile-lint/commit/e183593))

# [4.0.0](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.18...lockfile-lint@4.0.0) (2020-02-20)

### Bug Fixes

- **cli:** conflicting arguments will error ([#72](https://github.com/lirantal/lockfile-lint/issues/72)) ([3e0eb59](https://github.com/lirantal/lockfile-lint/commit/3e0eb59))

### BREAKING CHANGES

- **cli:** CLI may show an error when arguments
  conflict and the order of short and long options was reversed
  to be more descriptive on CLI options errors.

## [3.0.18](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.17...lockfile-lint@3.0.18) (2020-02-10)

### Bug Fixes

- **tests:** shebangs don't work on Windows ([#71](https://github.com/lirantal/lockfile-lint/issues/71)) ([6baff98](https://github.com/lirantal/lockfile-lint/commit/6baff98))

## [3.0.17](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.16...lockfile-lint@3.0.17) (2020-02-10)

### Bug Fixes

- **cli:** use `path.join` when concatenating paths ([#70](https://github.com/lirantal/lockfile-lint/issues/70)) ([4fa9090](https://github.com/lirantal/lockfile-lint/commit/4fa9090))

## [3.0.16](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.15...lockfile-lint@3.0.16) (2020-02-10)

**Note:** Version bump only for package lockfile-lint

## [3.0.15](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.14...lockfile-lint@3.0.15) (2020-02-10)

**Note:** Version bump only for package lockfile-lint

## [3.0.14](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.13...lockfile-lint@3.0.14) (2020-02-10)

### Bug Fixes

- **cli:** REVERT conflicting arguments will error ([#64](https://github.com/lirantal/lockfile-lint/issues/64)) ([b9768ad](https://github.com/lirantal/lockfile-lint/commit/b9768ad))

## [3.0.13](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.12...lockfile-lint@3.0.13) (2020-02-10)

### Bug Fixes

- **cli:** conflicting arguments will error ([#64](https://github.com/lirantal/lockfile-lint/issues/64)) ([2d451c9](https://github.com/lirantal/lockfile-lint/commit/2d451c9))

## [3.0.12](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.11...lockfile-lint@3.0.12) (2020-02-04)

**Note:** Version bump only for package lockfile-lint

## [3.0.11](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.10...lockfile-lint@3.0.11) (2020-02-04)

**Note:** Version bump only for package lockfile-lint

## [3.0.10](https://github.com/lirantal/lockfile-lint/compare/lockfile-lint@3.0.9...lockfile-lint@3.0.10) (2020-02-03)

**Note:** Version bump only for package lockfile-lint

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
