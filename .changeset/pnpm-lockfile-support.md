---
"lockfile-lint-api": minor
"lockfile-lint": minor
---

Add pnpm-lock.yaml support for lockfileVersion 9.x, including an optional --pnpm-registry for reconstructing integrity-only tarball URLs. Git and directory entries fail --validate-https; use --allowed-schemes instead (the flags are mutually exclusive), for example https:, git+https:, and file:.
