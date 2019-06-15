<p align="center"><h1 align="center">
  lockfile linting 🌈
</h1>

<p align="center">
  lint lockfiles for improved security and trust policies
</p>

<p align="center">
  <a href="https://www.npmjs.org/package/lockfile-lint-api"><img src="https://badgen.net/npm/license/lockfile-lint-api" alt="license"/></a>
  <a href="https://github.com/nodejs/security-wg/blob/master/processes/responsible_disclosure_template.md"><img src="https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg" alt="Security Responsible Disclosure" /></a>
</p>

# About

Lockfiles are used as trusted whitelist of resources manifest to fetch packages from. However, keeping track of the changes introduced to lockfiles is not an easy task as they are designed to consumed by machines 🤖.

What happens when someone creates a Pull Request and sneaks a malicious resource package that replaces a real library? 😱

Exactly!
Lint your lockfiles to ensure they adhere to pre-defined security policies and mitigate this vector of attack.

# Usage

Two methods are available to lint a lockfile:

- [lockfile-lint-api](https://github.com/lirantal/lockfile-lint/tree/master/packages/lockfile-lint-api) - a library providing a programmatic API
- [lockfile-lint](https://github.com/lirantal/lockfile-lint/tree/master/packages/lockfile-lint) - a CLI tool that can be easily integrated as a pre-commit hook or part of a CI/build

# Author

**lockfile-lint** © [Liran Tal](https://github.com/lirantal), Released under the [Apache-2.0](./LICENSE) License.
