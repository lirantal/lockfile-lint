<p align="center"><h1 align="center">
lockfile-lint

</h1>

<p align="center">
  A CLI to lint a lockfile for security policies
</p>

<p align="center">
<a href="https://www.npmjs.org/package/lockfile-lint"><img src="https://badgen.net/npm/v/lockfile-lint" alt="npm version"/></a>
  <a href="https://www.npmjs.org/package/lockfile-lint"><img src="https://badgen.net/npm/license/lockfile-lint" alt="license"/></a>
  <a href="https://www.npmjs.org/package/lockfile-lint"><img src="https://badgen.net/npm/dt/lockfile-lint" alt="downloads"/></a>
  <a href="https://travis-ci.org/lirantal/lockfile-lint"><img src="https://badgen.net/travis/lirantal/lockfile-lint" alt="build"/></a>
  <a href="https://codecov.io/gh/lirantal/lockfile-lint"><img src="https://badgen.net/codecov/c/github/lirantal/lockfile-lint" alt="codecov"/></a>
<a href="https://snyk.io/test/npm/lockfile-lint"><img src="https://snyk.io/test/npm/lockfile-lint/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/npm/lockfile-lint" style="max-width:100%;"></a>
  <a href="https://github.com/nodejs/security-wg/blob/master/processes/responsible_disclosure_template.md"><img src="https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg" alt="Security Responsible Disclosure" /></a>
</p>

# About

A CLI tool to lint a lockfile for security policies

# Install

```bash
npm install --save lockfile-lint
```

# Usage

`lockfile-lint` can be installed per a project scope, or globally and exposes a `lockfile-lint` executable that should be practiced during builds, CIs, and general static code analysis procedures to ensure that lockfiles are kept up to date with pre-defined security and usage policies.

```bash
lockfile-lint --type <yarn|npm> --path <path-to-lockfile> --validate-https --allowed-hosts <host-to-match> --allowed-urls <urls-to-match>
```

Supported lockfiles:
- npm's `package-lock.json` and `npm-shrinkwrap.json`
- yarn's `yarn.lock`

# Example

An example of running the linter with debug output for a yarn lockfile and asserting that all resources are using the official npm registry as source for packages:

```bash
DEBUG=* lockfile-lint --path yarn.lock --type yarn --allowed-hosts npm
```

**Example 2**: specify hostnames and enforce the use of HTTPS as a protocol

```bash
lockfile-lint --path yarn.lock --allowed-hosts registry.yarnpkg.com --validate-https
```

- `--type yarn` is ommitted since lockfile-lint can figure it out on it's own
- `--allowed-hosts` explicitly set to match yarn's mirror host

**Example 3**: allow the lockfile to contain packages served over github and so need to specify github.com as a host as well as the `git+https:` as a valid URI scheme

```bash
lockfile-lint --path yarn.lock --allowed-hosts yarn github.com --allowed-schemes "https:" "git+https:"
```

- `--allowed-hosts` explicitly set to match github.com as a host and specifies `yarn` as the alias for yarn's official mirror host
- `--allowed-schemes` is used instead of `validate-https` and it explicitly allows both `https:` and `git+https:` as the [HTTP Scheme](https://tools.ietf.org/html/rfc3986#section-3.1) for the github URL. Note that `--allowed-schemes` and `--validate-https` are mutually exclusive.

**Example 4**: allow the lockfile to contain a package which resolves to a specific URL specified by the `--allowed-urls` option while all other packages must resolve to yarn as specified by `--allowed-hosts`

```bash
lockfile-lint --path yarn.lock --allowed-hosts yarn --allowed-urls https://github.com/lirantal/lockfile-lint#d30ce73a3e5977dede29450df1c79b09f02779b2
```

- `--allowed-hosts` allows packages from yarn only
- `--allowed-urls` overrides `allowed-hosts` and allows a specific Github URL to pass validation

# CLI command options

| command line argument            | description                                                                                                                                                                                                                                                                                | implemented    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `--path`, `-p`                   | path to the lockfile                                                                                                                                                                                                                                                                       | ✅             |
| `--type`, `-t`                   | lockfile type, options are `npm` or `yarn`                                                                                                                                                                                                                                                 | ✅             |
| `--format`, `-f` | sets what type of report output is desired, one of [ `pretty`, `plain` ] with `plain` removing colors & status symbols from output | ✅             |
| `--validate-https`, `-s`         | validates the use of HTTPS as protocol schema for all resources in the lockfile                                                                                                                                                                                                            | ✅             |
| `--allowed-hosts`, `-a`          | validates a list of allowed hosts to be used for all resources in the lockfile. Supported short-hands aliases are `npm`, `yarn`, and `verdaccio` which will match URLs `https://registry.npmjs.org`, `https://registry.yarnpkg.com` and `https://registry.verdaccio.org` respectively      | ✅             |
| `--allowed-schemes`, `-o`        | allowed [URI schemes](https://tools.ietf.org/html/rfc2396#section-3.1) such as "https:", "http", "git+ssh:", or "git+https:"                                                                                                                                                               | ✅             |
| `--allowed-urls`, `-u`           | allowed URLs (e.g. `https://github.com/some-org/some-repo#some-hash`)                                                                                                                                                                                                                      | ✅             |
| `--empty-hostname`, `-e`         | allow empty hostnames, or set to false if you wish for a stricter policy                                                                                                                                                                                                                   | ✅             |
| `--validate-package-names`, `-n` | validates that the resolved URL matches the package name                                                                                                                                                                                                                                   | ✅             |
| `--validate-checksum`, `-c`      | check that all resources include a checksum                                                                                                                                                                                                                                                | ❌ PRs welcome |
| `--validate-integrity`, `-i`     | check that all resources include an integrity field                                                                                                                                                                                                                                        | ❌ PRs welcome |

# File-Based Configuration

Lockfile-lint uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for configuration file support. This means you can configure the above options via (in order of precedence):

- A "lockfile-lint" key in your package.json file.
- A .lockfile-lintrc file, written in JSON or YAML, with optional extensions: .json/.yaml/.yml (without extension takes precedence).
- A .lockfile-lint.js or lockfilelint.config.js file that exports an object.
- A .lockfile-lint.toml file, written in TOML (the .toml extension is required).

The configuration file will be resolved starting from the current working directory, and searching up the file tree until a config file is (or isn't) found. Command-line options take precedence over any file-based configuration.

The options accepted in the configuration file are the same as the options above in camelcase (e.g. "path", "allowedHosts").

# Contributing

Please consult [CONTIRBUTING](../../CONTRIBUTING.md) for guidelines on contributing to this project.

# Author

**lockfile-lint** © [Liran Tal](https://github.com/lirantal), Released under the [Apache-2.0](./LICENSE) License.
