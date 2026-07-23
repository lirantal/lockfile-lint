# Release

This project uses [Changesets](https://github.com/changesets/changesets) to record release intent before the version and publish steps run.

Use the command that matches the repository's package manager:

- npm: `npx @changesets/cli`
- pnpm: `pnpx @changesets/cli`

## Release tooling

This project uses the [Changesets](https://github.com/changesets/changesets)
tool to manage semantic versioning and release notes.

## Pre-requisites

Permit GitHub Actions to create and approve pull requests:

1. Go to Actions -> General in the repository settings: (`https://github.com/<user>/<repo>/settings/actions`)
2. In `Workflow permissions` enable the toggle for
`Allow GitHub Actions to create and approve pull requests` (it is not required
to also toggle the `Read and write permission` option)

## Add a changeset interactively

Run the Changesets CLI and follow the prompts:

```sh
# npm
npx @changesets/cli

# pnpm
pnpx @changesets/cli
```

The CLI asks which package changed, what semver bump is needed, and what summary should go in the changelog. Use:

- `patch` for backward-compatible fixes and small internal changes
- `minor` for backward-compatible new functionality
- `major` for breaking changes

Then commit and push the generated changeset:

```sh
git add .changeset
git commit -m "chore: release"
git push origin HEAD --no-verify
```

## Add a changeset without an interactive TTY

The Changesets CLI is mostly interactive when creating a normal changeset. If a TTY is not available, write the changeset file directly.

First, read the package name from `package.json` instead of hard-coding it:

```sh
PACKAGE_NAME=$(node -p "require('./package.json').name")
```

Create a changeset file under `.changeset/`:

```sh
CHANGESET_FILE=".changeset/$(date +%s)-release.md"

cat > "$CHANGESET_FILE" <<EOF
---
"$PACKAGE_NAME": patch
---

Describe the change here.
EOF
```

Replace `patch` with `minor` or `major` when the change requires a larger semver bump. Keep the summary short and user-facing; it is used by Changesets when generating release notes.

Commit and push the changeset:

```sh
git add .changeset
git commit -m "chore: release"
git push origin HEAD --no-verify
```

## Version and publish

After the changeset lands on the release branch, run the configured package scripts when it is time to cut and publish the release:

```sh
# npm
npm run version
npm run release

# pnpm
pnpm run version
pnpm run release
```
