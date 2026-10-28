---
"lockfile-lint-api": minor
"lockfile-lint": minor
---

Add pnpm-lock.yaml support for lockfileVersion 9.x, including an optional --pnpm-registry for reconstructing integrity-only tarball URLs. Directory entries and Git entries that are not https: fail --validate-https; use --allowed-schemes instead of that flag (they are mutually exclusive).
