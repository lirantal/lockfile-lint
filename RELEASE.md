# Release

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and release notes.

## Release Flow

1. Ensure all intended changes are merged and CI is green.
2. Run `npm run version` to apply Changesets version and changelog updates.
3. Review the generated package and changelog changes.
4. Run the release command, if configured for the repository.

Current release command:

```sh
npm run release
```

## Changesets

Add a changeset for user-facing package behavior changes:

```sh
npm run changeset
```

Documentation-only, test-only, and internal refactor PRs usually do not need a changeset unless they describe or accompany a release-worthy behavior change.
