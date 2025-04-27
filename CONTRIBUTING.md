# Contributing

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to lockfile-lint.
These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to contribute to lockfile-lint

<!-- TODO -->

### Tests

Make sure you the code you're contributing has decent test coverage.

Running project tests and coverage from the root of the project:

```bash
npm run test
```

Then make sure that also linting is passing:

```bash
npm run lint
```

Running tests per each of the sub-packages also works:

```bash
cd packages/lockfile-lint
npm run test
```

### Commit Guidelines

The project uses the commitizen tool for standardizing changelog style commit
messages so you should follow it as so:

```bash
git add .           # add files to staging
npm run commit      # use the wizard for the commit message
```

### Contribution Process

Open a new pull request with the changes made. Make sure to follow the guidelines above.

Merging the PR will trigger the CI/CD pipeline to run tests, but it won't automatically publish any new versions because that is a separate process that is triggered manually.

### Version Release Process

We use Changesets to manage the versioning of the project. To release a new version, you need to create a new changeset.

From the root of the project, run the following command:

```bash
npx changeset
```

This will guide you through an interactive prompt on the CLI to create a new changeset. Once you've created the changeset, you can commit it to the repository.

```bash
git add .changeset/<whatever-file-was-created>.md
```

And push the changes to the repository (can be done on the main branch):

```bash
git push
```

From this point, the CI/CD pipeline will automatically detect a new changeset file was added and will open a new Pull Request to propose the new version changes to be made and published.
