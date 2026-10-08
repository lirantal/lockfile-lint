---
"lockfile-lint-api": minor
"lockfile-lint": minor
---

Add opt-in strict SHA-512 integrity validation that detects missing or malformed hashes while allowing Git, local directory, linked workspace and bundled dependencies.

Exempt Yarn Classic GitHub codeload archives only when pinned to a full 40-hex
commit. Resolve npm bundled dependencies against their nearest non-bundled
ancestor before flattening: v2/v3 require a non-empty `bundleDependencies`
declaration and an ancestor with valid SHA-512 integrity or an independent
source exemption. npm v1 verifies the ancestor but cannot confirm the bundle
declaration. Unverified flags and HTTP(S)/local tarball downloads still require
integrity.

Report Yarn Berry as one marked unsupported-format error. The CLI exits non-zero
without calling an unsupported format a security finding; other failing
validators still report their security findings.

Require commit pins for all Git-source exemptions, and recognize percent-encoded
local tarball extensions before granting directory exemptions.
