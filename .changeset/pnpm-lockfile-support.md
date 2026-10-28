---
"lockfile-lint-api": minor
"lockfile-lint": minor
---

Add pnpm-lock.yaml support for lockfileVersion 9.x. Reconstruct integrity-only tarball URLs with the CLI flag --pnpm-registry or the ParseLockfile option pnpmRegistry (default https://registry.npmjs.org). Directory entries and Git entries that are not https: fail --validate-https; use --allowed-schemes instead of that flag (they are mutually exclusive).
