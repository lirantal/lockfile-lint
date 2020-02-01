<p align="center"><h1 align="center">
  lockfile linting 🌈
</h1>

<p align="center">
  lint lockfiles for improved security and trust policies
</p>

<p align="center">
  <a href="https://travis-ci.org/lirantal/lockfile-lint"><img src="https://badgen.net/travis/lirantal/lockfile-lint" alt="build"/></a>
  <a href="https://codecov.io/gh/lirantal/lockfile-lint"><img src="https://badgen.net/codecov/c/github/lirantal/lockfile-lint" alt="codecov"/></a>
  <a href="https://www.npmjs.org/package/lockfile-lint-api"><img src="https://badgen.net/npm/license/lockfile-lint-api" alt="license"/></a>
  <a href="https://github.com/nodejs/security-wg/blob/master/processes/responsible_disclosure_template.md"><img src="https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg" alt="Security Responsible Disclosure" /></a>
  <a href="https://twitter.com/liran_tal/" alt="follow liran_tal twitter"><img src="https://badgen.net/twitter/follow/liran_tal" /></a>
     <a href="https://github.com/lirantal/lockfile-lint#usage"><img src="https://badgen.net/badge/npx/lockfile-lint%20--path%20yarn.lock%20--type%20yarn%20--validate-https%20--allowed-hosts%20npm/blue?icon=npm" alt="npx lockfile-lint" /></a>
</p>

# About

Lockfiles are used as trusted whitelist of resources manifest to fetch packages from.
However, keeping track of the changes introduced to lockfiles is not an easy task as they are designed to consumed by machines 🤖.

What happens when someone creates a Pull Request and sneaks a malicious resource package that replaces a real library? 😱

Exactly!
Lint your lockfiles to ensure they adhere to pre-defined security policies and mitigate this vector of attack.

**Why is this important?** read: [Why npm lockfiles can be a security blindspot for injecting malicious modules](https://snyk.io/blog/why-npm-lockfiles-can-be-a-security-blindspot-for-injecting-malicious-modules/)

# Usage

Easily invoked with npx on any project and lint it:

```bash
npx lockfile-lint --path yarn.lock --allowed-hosts npm yarn --validate-https
```

If lockfile-lint detects exceptions to the policies it will report them:

![carbon](https://user-images.githubusercontent.com/316371/59755684-09923200-9291-11e9-9add-6886dfc6689a.png)

Refer to [lockfile-lint](https://github.com/lirantal/lockfile-lint/tree/master/packages/lockfile-lint) for more details on the CLI usage.

You can use `lockfile-lint` as a standalone CLI tool, or as an API library using the following npm packages:

- [lockfile-lint](https://github.com/lirantal/lockfile-lint/tree/master/packages/lockfile-lint) - a CLI tool that can be easily integrated as a pre-commit hook or part of a CI/build
- [lockfile-lint-api](https://github.com/lirantal/lockfile-lint/tree/master/packages/lockfile-lint-api) - a library providing a programmatic API

## Security Disclaimer

Please be advised of the following security disclaimers that are outside of the control of a lockfile linter:

When you whitelist all hosts from npmjs, yarnpkg, github or other registries you implicitly convey that you trust all the packages originating from these sources. As such, a malicious package can exist in a registry source that you whitelist. Direct dependencies that you add should to a project should be well vetted before adding such as using a tool like [npq](https://github.com/lirantal/npq).



# Author

**lockfile-lint** © [Liran Tal](https://github.com/lirantal), Released under the [Apache-2.0](./LICENSE) License.
