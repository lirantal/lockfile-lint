---
"lockfile-lint-api": minor
"lockfile-lint": minor
---

Add pnpm-lock.yaml support for lockfileVersion 9.x. Reconstruct integrity-only tarball URLs with the CLI flag --pnpm-registry or the ParseLockfile option pnpmRegistry (default https://registry.npmjs.org; absolute http(s) base URL, no query or hash). Registry revisions become `<registry>/<name>@<version>+r<revision>` URLs, and binary resolutions keep their archive URL. Directory entries and Git entries that are not https: fail --validate-https; use --allowed-schemes instead of that flag (they are mutually exclusive).
