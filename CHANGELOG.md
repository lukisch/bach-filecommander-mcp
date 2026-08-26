# Changelog

All notable changes to this project will be documented in this file.

## [1.10.3] - 2026-08-26

### Runtime language introspection
- Add the read-only `fc_get_language` MCP tool to report the active language and the stable list of six supported runtime languages.
- Classify the new tool explicitly as read-only, non-destructive, idempotent, and local-only through standard MCP annotations.
- Add native result text for German, English, Spanish, Chinese, Japanese, and Russian.
- Add a real stdio integration contract for the 48-tool surface and every supported language switch; synchronize manifests, bilingual documentation, and 261 automated checks.

## [1.10.2] - 2026-08-26

### Security metadata and explicit trust boundaries
- Add all four standard MCP security annotations to every one of the 47 tools and move `fc_set_language` to the annotated `registerTool` API.
- Classify arbitrary command, background-process, and interactive-session entry points conservatively as potentially destructive; classify OCR output and archive writes explicitly.
- Replace runtime-generated OCR import code with `createRequire` for the optional `tesseract.js` dependency.
- Correct the bilingual security documentation: stdio transport has no telemetry or automatic egress, while an explicit `fc_web_fetch` call performs outbound HTTP(S) access.
- Document that safe mode redirects only the two delete tools and does not sandbox command or interactive-session tools.
- Add four regression tests for annotation completeness, high-risk classifications, OCR loading, and bilingual security-boundary parity (257 total checks).

## [1.10.1] - 2026-08-25

### Discoverability, README Navigation & CI Matrix Concurrency (Pfad B)
- **Bilingual README Quick Navigation:** Enriched quick navigation bars in `README.md` and `README_de.md` with comprehensive section anchor jump targets covering architecture, capabilities, configuration, comparisons, discoverability, security, and ecosystem.
- **Core Capabilities & Safety Invariants Matrix:** Integrated bilingual capability and invariant matrices detailing 100% Local-First & Zero-Egress guarantees, Safe Deletion & Trash routing, Cloud-Lock resilience (`fc_move` & `fc_check_cloud_lock`), bounded content search, secret redaction, unprivileged non-elevation execution, and multi-format conversions.
- **CI Workflow Concurrency Hardening:** Enhanced GitHub Actions CI (`.github/workflows/tests.yml`) with concurrency groups and `cancel-in-progress: true` to prevent redundant runner execution on rapid pushes.
- **Test Badges & Contract Parity Suite:** Synchronized README test badges to 253 passed tests (184 Vitest + 69 i18n assertions); expanded `test/metadata-parity.test.ts` to 9 automated contract tests verifying CI concurrency, bilingual capabilities parity, navigation anchors, and `llms.txt` freshness (`2026-08-25`).

## [1.10.1] - 2026-08-21

### Technical Hygiene, CI Multi-OS Matrix & Bilingual Security Policy (Pfad A)
- **GitHub Actions CI Modernization:** Upgraded `.github/workflows/tests.yml` to official modern actions (`actions/checkout@v4`, `actions/setup-node@v4` with npm cache), multi-OS matrix (`ubuntu-latest`, `windows-latest`, `macos-latest`), and Node.js matrix (`[20, 22, 24]`).
- **Bilingual Security Policy (`SECURITY.md`):** Comprehensive English and German security documentation covering Local-First & Zero-Egress guarantees, unprivileged User-Mode execution (Non-Elevation), Safe Mode routing (`fc_set_safe_mode`), Cloud-Lock resilience (`fc_check_cloud_lock`), tool risk classifications, direct contact endpoints (`security@ellmos.ai`, `support@lukasgeiger.com`, `lukas@open-bricks.org`), and supported versions table.
- **Automated Contract & Parity Test Suite:** Expanded `test/metadata-parity.test.ts` (8 contract tests, 100% green) validating version parity, 47-tool manifest consistency, package release files, bilingual security policy, multi-OS CI workflow, and LLM documentation freshness.
- **Documentation & Badges:** Added CI status badge, Zero-Egress security badge, quick navigation bar in `README.md` and `README_de.md`, updated sibling server tool counts (`Blender Use: 5`, `Open Compute: 16`), and synchronized `llms.txt` Last-checked timestamp to `2026-08-21`.
- **Integrated Test Runner:** Updated `npm test` script to seamlessly run Vitest (181 tests) and i18n test runner (69 tests) in unified automated execution (250 tests total, 100% green).

## [1.10.1] - 2026-08-16

### Discoverability, README-Design & Metadata Parity (Pfad B)
- **Badges & Visual Discovery:** Synchronized README badges across `README.md` & `README_de.md` including full test suite (179 vitest + 69 i18n passed, 100% green), Node.js (>=20), Safe Delete (Recycle Bin / Trash), `ellmos-ai` organization, `open-bricks` umbrella, and `llms.txt` discovery badges.
- **Interactive Sequence Diagrams:** Integrated bilingual Mermaid execution sequence diagrams illustrating the 2-step Safe Deletion fallback and resilient Cloud-Lock (OneDrive/Dropbox) recovery flow.
- **Ecosystem & Sibling Matrix:** Extended cross-linking to sibling MCP servers (`Blender Use`, `Open Compute`) and companion desktop applications across `open-bricks` and `file-bricks` (`ProFiler`, `ExplorerPro`, `WinStorePackager`, `SoftwareCenter`, `SQLiteViewer`, `MediaBrain`, `DevCenter`, `CodeBox`).
- **Metadata Parity Test Suite:** Added automated Vitest parity test suite in `test/metadata-parity.test.ts` (6/6 passed) validating version parity (`package.json`, `server.json`, `glama.json`), 47-tool manifest consistency, package release files, and LLM documentation freshness.
- **LLM Indexing:** Synchronized `llms.txt` Last-checked timestamp to `2026-08-16` and refreshed tool family overview.

## [1.10.0] - 2026-07-29

### Maintenance & Discoverability (2026-08-14)
- Update `llms.txt` Last-checked timestamp to `2026-08-14`.
- Complete all 47 tool entries in `README.md` and `README_de.md` by documenting `fc_set_language` in the System tools tables.
- Add MCP Tools (47), Vitest suite (175 passed), and organization badges to `README.md` and `README_de.md`.
- Synchronize system architecture Mermaid diagrams with exact 47-tool category mapping.
- Re-verify TypeScript build (`npm run build`), full Vitest suite (175/175 tests passed), and i18n test suite (69/69 passed).

### Security (2026-08-05)
- Close both open Dependabot advisories via lockfile update: `fast-uri`
  (high, GHSA-7p8r-x3mc-p8w7 — host confusion via backslash authority
  introducer) and `hono` (moderate, GHSA-8j4g-w8fx-2239 — ReDoS in the CORS
  middleware). `npm audit` reports 0 vulnerabilities; build and 175/175
  Vitest tests stay green.

### Maintenance & Technical Hygiene (2026-08-04)
- Update `llms.txt` Last-checked timestamp to `2026-08-04`.
- Fix canonical repository branch reference (`master`) in `llms.txt` documentation links.
- Re-verify TypeScript build (`npm run build`) & Vitest unit test suite (`175/175 passed`).

### Documentation & Discoverability (2026-08-03)
- Replace the legacy opaque Glama URL with the canonical owner-based listing URL in both READMEs and `llms.txt`.

### Maintenance & Discoverability (2026-07-30)
- Update `llms.txt` Last-checked timestamp to `2026-07-30`.
- Add open-bricks ecosystem cross-reference badge to README & German README documentation.
- Verify full test suite (175/175 passed across 4 test files).

### Added
- Add the read-only `fc_search_content` tool for deterministic literal or
  regular-expression search across an explicit ordered list of files.
- Add case sensitivity, bounded context, global and per-file match limits,
  binary/UTF-8/size guards, per-file partial errors, and common-secret
  redaction.
- Localize the complete tool surface in all six runtime language packs.

### Safety
- Do not expand globs, traverse directories, or recurse from
  `fc_search_content`; callers must supply every file path explicitly.
- Bound input paths, query length, file size, excerpts, context, matches, and
  serialized output.
- Redact complete private-key blocks, quoted credentials, bearer tokens, and
  common token formats from both matching lines and returned context.

### Verification
- Add unit coverage for ordering, literal/regex behavior, Unicode case,
  context, limits, non-recursion, binary/encoding/size handling, partial
  errors, output bounds, and secret redaction.

## [1.9.6] - 2026-07-28

### Added
- Add SHA-384 support to `fc_checksum` and cover the digest length in the test suite.

### Security
- Upgrade `@modelcontextprotocol/sdk` to 1.30.x and require
  `@hono/node-server` 2.0.12 or newer to resolve the Windows encoded-backslash
  path-traversal advisory GHSA-frvp-7c67-39w9.

### Changed
- Raise the minimum supported Node.js version from 18 to 20, matching the
  secure Hono Node adapter and the existing Node.js 20/22/24 CI matrix.

### Verification
- Verify the TypeScript build, 162 Vitest tests, 66 standalone i18n checks,
  production dependency audit, and npm package dry-run.
- Align the runtime startup banner with the current `ellmos FileCommander` name.

### Migration
- Move the canonical Git worktree out of OneDrive under Plan D. OneDrive keeps a
  `.git`-less tracked-file mirror plus a cloud-readable repository pointer.

## [1.9.5] - 2026-07-26

### Documentation & Discoverability
- Synchronize tool counts (46 tools) across `README.md`, `README_de.md`, and `llms.txt`.
- Add GFM LLM Integration Note (`> [!NOTE]`) for AI agent discoverability.
- Add Mermaid System Architecture flowcharts to both `README.md` and `README_de.md`.
- Update `llms.txt` verification timestamp to 2026-07-26.

## [1.9.4] - 2026-07-25

### Maintenance
- Update `llms.txt` Last-checked header to 2026-07-25.
- Align version annotations (1.9.4) across `src/index.ts`, `package.json`, `server.json`, and `glama.json`.
- Verify Vitest test suite (161 unit tests), i18n test suite (66 tests, 227 total passing), and TypeScript build.

## [1.9.3] - 2026-07-24

### Fixed
- Correct FileCommander (46) and CodeCommander (22) tool counts in the ecosystem family table; counts now verified against the live MCP `tools/list` surface.
- Align the McpServer runtime version in `src/index.ts` with package.json (was stuck at 1.9.1).

## [1.9.2] - 2026-07-24

### Changed
- Unified the ellmos-ai ecosystem section in README.md and README_de.md: full 9-server MCP family table with refreshed tool counts, AI infrastructure, and desktop software links.
- Refreshed `glama.json` for the Glama MCP directory listing.
- Synced `server.json` version metadata.

## [1.9.1] - 2026-07-06

### Security
- Harden `fc_web_fetch` link/text sanitization, resolving 5 CodeQL `high` code-scanning alerts:
  - `js/double-escaping`: unescape `&amp;` last in the HTML→text pass so a produced `&` cannot be re-read as the start of another entity (`&amp;lt;` now yields literal `&lt;` instead of `<`).
  - `js/incomplete-multi-character-sanitization`: strip tags in the parsed link text in a loop until stable, so removing one tag cannot re-form a new one.
  - `js/incomplete-url-scheme-check`: filter parsed link URLs with an http/https allowlist (also drops `data:`, `vbscript:`, `blob:`) instead of a scheme blocklist; `javascript:`, `mailto:`, `tel:` and fragment-only links stay dropped.
- Defense-in-depth only: parsed link output is reported to the caller, not auto-fetched; the fetch path remains guarded by the existing SSRF allowlist (`fcWebGuardTarget`, unchanged).

## [1.9.0] - 2026-07-05

### Added
- Add `fc_web_fetch`: read-only network tool that fetches a web page and returns content by `mode` (extract=clean main text, raw=HTTP body, links, forms, headers). First online tool in FileCommander; uses Node native `fetch` (no new dependency). SSRF guard blocks internal/private/loopback targets by default (`allow_private` to override); 5 MB size cap and configurable timeout. Description localized in all 6 languages. The full, portable version (incl. screenshot) lives in the `web-scraper` module.
- Replace the Spanish, Chinese, Japanese, and Russian i18n fallback stubs with full FileCommander runtime translations.
- Add an i18n regression test covering localized core messages, interpolation, and stub removal for all four language packs.

### Fixed
- Use `-EncodedCommand` (Base64/UTF-16LE) for PowerShell execution instead of string interpolation, preventing injection via metacharacters (`$`, backtick, `&`). Fixes CodeQL `js/incomplete-string-escaping` alert.

### Documentation
- Update README test counts to 154 after adding the i18n regression coverage.
- Refresh discoverability metadata for the current 44-tool FileCommander release, including jsDelivr and LobeHub visibility, cached third-party directory caveats, and additional Cloud-Lock/OCR/ZIP search phrases.

## [1.8.2] - 2026-06-17

### Fixed
- Correct version mismatch in banner/description display (1.7.10 → 1.8.0) and improve OCR `fc_ocr` error handling for edge cases.
- Align `package.json`, lockfile, MCP runtime version, source header, and `server.json` metadata after the update-notifier release.
- Refresh npm dependency locks so production audit findings for `hono` and `js-yaml` are resolved.

### Changed
- Bump `@modelcontextprotocol/sdk` from 1.27.1 to 1.29.0.
- Add a TTY-guarded `update-notifier` check for interactive CLI starts while keeping MCP stdio output unchanged.

### CI
- Add a dedicated GitHub Actions test workflow for Node.js 20, 22, and 24. The workflow runs `npm ci`, TypeScript build, Vitest, and an npm package dry-run on pushes and pull requests.
- Lock `@emnapi/core` and `@emnapi/runtime` as dev dependencies so Linux `npm ci` resolves Vitest/Rolldown optional WASM peer dependencies deterministically.

### Documentation
- Move the `llms.txt` last-checked marker to the top of the file and normalize search phrases into a crawler-friendly fenced code block.
- Ignore local automation protocol files via `*-protocoll.txt`.
- Normalize `package.json` repository metadata to npm's `git+https` form.

## [1.8.0] - 2026-05-31

### Added
- **Cloud-lock-safe file operations**: `fc_move`, `fc_batch_rename`, and `fc_safe_delete` now automatically fall back to copy+delete when the Windows Cloud Files filter (`cldflt.sys`) or other file locks block `rename()`. Triggered on EPERM, EACCES, EXDEV, and EBUSY errors.
- **`fc_check_cloud_lock`** — New read-only diagnostic tool that checks whether a path is at risk of cloud-sync lock conflicts. Reports driver status, sync folder detection, and risk level. Windows-only (graceful no-op on macOS/Linux).
- Empirical cloud-lock test (`test/empirical_cloud_lock.mjs`) using real Windows file locks to verify the fallback path.
- 7 new unit tests for `cloudSafeRename` helper (143 total tests).
- Full i18n (DE/EN) for all new features.
- Total tools: 44

### Changed
- Include `server.json` in the npm package so official MCP Registry metadata ships with the published artifact.
- Rename the official registry title from legacy "BACH FileCommander" to "ellmos FileCommander".
- Update community workflows to `actions/stale@v10` and `actions/first-interaction@v3` with current input names.
- Refresh README/README_de and `llms.txt` discovery notes for Glama, npm, and the ellmos MCP family.

## [1.7.10] - 2026-05-23

### Fixed
- Refresh npm lockfile and overrides to resolve Dependabot alerts for `fast-xml-builder`, `fast-uri`, `hono`, and `ip-address`.
- Update dev dependency lockfile path away from vulnerable Vite/esbuild ranges.

## [1.7.9] - 2026-05-17

### Added
- Comprehensive test suite with 136 tests covering all 43 tools (vitest)
- Cross-platform compatibility verified on Windows, macOS, and Linux
- Development/Testing section in README.md and README_de.md

## [1.7.2] - 2026-02-20

### Fixed
- Update CHANGELOG with 5 missing version entries (v1.5.0-v1.7.1)
- Fix server.json version mismatch
- Update SECURITY.md supported versions (1.3.x -> 1.7.x)
- Add missing runtime dependencies to THIRD_PARTY_NOTICES.md
- Remove stale "NEW in v1.4.0" label from README

## [1.7.1] - 2026-02-17

### Changed
- Replace custom TOON parser/serializer with official `@toon-format/toon` package
- Proper TOON format: `key: value` syntax instead of custom `key = value`

## [1.7.0] - 2026-02-17

### Added
- `fc_ocr` - Extract text from images via optional tesseract.js dependency
- `fc_archive` - Create, extract, and list ZIP archives (via adm-zip)
- `fc_checksum` - File hashing (MD5, SHA-1, SHA-256, SHA-512) with optional compare
- `fc_set_safe_mode` - Toggle safety mode: route all deletes through Recycle Bin / Trash
- Expand `fc_convert_format`: add YAML, TOML, XML, and TOON support (was JSON/CSV/INI only)
- Full i18n (DE/EN) for all new tools
- Total tools: 43

## [1.6.1] - 2026-02-17

### Added
- `mcpName` field in package.json for MCP Registry verification
- `server.json` for official MCP Registry publishing

## [1.6.0] - 2026-02-17

### Added
- `fc_md_to_pdf` - Real PDF generation via headless Edge/Chrome browser
- Cross-platform browser detection (Windows, macOS, Linux)
- Fallback to HTML output if no browser is available
- Total tools: 39

## [1.5.0] - 2026-02-15

### Added
- Complete internationalization (i18n) infrastructure with German (default) and English support
- New `fc_set_language` tool for runtime language switching
- `FC_LANGUAGE` environment variable for startup configuration
- ~270 translated strings (tool titles, descriptions, error messages, weekdays)
- i18n test suite (66 tests)
- Language priority: `fc_set_language` > `FC_LANGUAGE` env > `"de"` default

## [1.4.1] - 2026-02-14

### Fixed
- `fc_md_to_html` completely rewritten: line-by-line parser instead of regex chain
- Added: nested lists, ordered lists, blockquotes, checkboxes, badge images, standalone images
- Added: bold+italic combo (`***text***`), proper `<thead>/<tbody>` tables
- Professional CSS: dark code blocks, colored headers, print-ready layout

## [1.4.0] - 2026-02-14

### Added
- `fc_fix_json` - Repair common JSON errors (BOM, trailing commas, single quotes, comments, NUL bytes)
- `fc_validate_json` - Validate JSON with detailed error position and context
- `fc_cleanup_file` - Clean files: remove BOM, NUL bytes, trailing whitespace, normalize line endings
- `fc_fix_encoding` - Fix Mojibake and double-encoded UTF-8 (27+ patterns for German, French, Spanish)
- `fc_folder_diff` - Track directory changes (new/modified/deleted files) with snapshots
- `fc_batch_rename` - Pattern-based batch renaming (prefix/suffix removal, replace, auto-detect)
- `fc_convert_format` - Convert between JSON, CSV, and INI formats
- `fc_detect_duplicates` - Find duplicate files using SHA-256 hashing with size pre-filter
- `fc_md_to_html` - Convert Markdown to styled HTML (printable as PDF via browser)
- Total tools: 38

## [1.3.0] - 2026-02-14

### Changed
- Project prepared for public open-source release
- README rewritten in English for international audience
- Added LICENSE (MIT), SECURITY.md, CONTRIBUTING.md
- Package metadata updated for NPM publishing

## [1.2.1] - 2025-01-05

### Added
- `fc_str_replace` - String replacement tool with unique-match validation
- Total tools: 29

### Fixed
- `fc_safe_delete` PowerShell escaping for paths with special characters
- `&` character handling in Windows paths (PowerShell fallback)

## [1.2.0] - 2025-01-05

### Added
- Async Search system (5 tools): `fc_start_search`, `fc_get_search_results`, `fc_stop_search`, `fc_list_searches`, `fc_clear_search`
- `fc_safe_delete` - Moves files to Recycle Bin (Windows) or Trash (macOS/Linux) instead of permanent deletion

## [1.1.0] - 2025-01-05

### Added
- `fc_read_multiple_files` - Read multiple files in one call
- `fc_edit_file` - Line-based file editing (replace/insert/delete)
- `fc_list_processes` - List running system processes
- `fc_kill_process` - Terminate processes by PID or name
- Interactive Sessions (4 tools): `fc_start_session`, `fc_read_output`, `fc_send_input`, `fc_close_session`

## [1.0.0] - 2025-01-05

### Added
- Initial release with 13 filesystem tools
- File operations: read, write, list, create directory, delete, move, copy, file info, search
- Process execution: `fc_execute_command`, `fc_start_process`
- System: `fc_get_time`
