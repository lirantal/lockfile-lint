# Development

## Prerequisites

- Node.js compatible with this repository's packages and tooling.
- npm for dependency installation and scripts.

## Setup

```sh
npm install
```

## Common Commands

- `npm run lint` - runs lint checks.
- `pnpm test` - runs the test suite.

## Repository Notes

This repository contains package directories under:

- `packages/lockfile-lint`
- `packages/lockfile-lint-api`


## Package-manager pin

Run `bash .github/scripts/setup-npm.sh` from the repository to install the exact
npm version in `package.json#packageManager`, then install dependencies using
the existing project setup instructions. CI uses the same setup script.

Upgrade the pin and matching lockfile metadata together in a maintenance PR.
Choose a release at least 30 days old and run the project checks with it.
Keep `.npmrc` and `pnpm-workspace.yaml` security policies enabled.
Periodic upgrade automation is not configured.
