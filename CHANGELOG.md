# Changelog

All notable changes to this project will be documented in this file.

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
