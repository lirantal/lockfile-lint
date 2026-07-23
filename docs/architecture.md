# Architecture

## Overview

lockfile-lint contains the source, package configuration, and release tooling for `lockfile-lint`.

## Repository Structure

- `packages/lockfile-lint` - package source and package-specific documentation.
- `packages/lockfile-lint-api` - package source and package-specific documentation.
- `.changeset/` - Changesets configuration and pending release notes.
- `docs/` - project documentation for maintainers and coding agents.

## Boundaries

- Keep user-facing usage, installation, and examples in the root `README.md`.
- Keep contribution rules in `CONTRIBUTING.md`.
- Keep release workflow details in `RELEASE.md`.
- Keep deeper development and architecture notes in `docs/`.
