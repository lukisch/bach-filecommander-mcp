# BACH FileCommander MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/bach-filecommander-mcp.svg)](https://www.npmjs.com/package/bach-filecommander-mcp)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

A comprehensive **Model Context Protocol (MCP) server** that gives AI assistants full filesystem access, process management, interactive shell sessions, and async file search capabilities.

**43 tools** in a single server - everything an AI agent needs to interact with the local system.

---

## Why FileCommander?

Most filesystem MCP servers only cover basic read/write operations. FileCommander goes further:

- **Safe Delete** - Moves files to Recycle Bin (Windows) or Trash (macOS/Linux) instead of permanent deletion
- **Interactive Sessions** - Start and interact with REPLs (Python, Node.js, shells) through the MCP protocol
- **Async Search** - Search large directory trees in the background while the AI continues working
- **Process Management** - List, start, and terminate system processes
- **String Replace** - Edit files by matching unique strings with context validation
- **Format Conversion** - Convert between JSON, CSV, INI, YAML, TOML, XML, and TOON
- **ZIP Archives** - Create, extract, and list ZIP archives
- **File Checksums** - SHA-256, MD5, SHA-1, SHA-512 hashing with compare
- **OCR** - Extract text from images (optional tesseract.js dependency)
- **Safety Mode** - Toggle to route all deletes through Recycle Bin / Trash
- **Markdown Export** - Convert Markdown to professional HTML/PDF with code blocks, tables, nested lists, blockquotes
- **Cross-platform** - Works on Windows, macOS, and Linux with platform-specific optimizations

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- npm

### Option 1: Install from NPM

```bash
npm install -g bach-filecommander-mcp
```

### Option 2: Install from Source

```bash
git clone https://github.com/lukisch/bach-filecommander-mcp.git
cd bach-filecommander-mcp
npm install
npm run build
```

---

## Configuration

### Claude Desktop

Add to your `claude_desktop_config.json`:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

#### If installed globally via NPM:

```json
{
  "mcpServers": {
    "filecommander": {
      "command": "bach-filecommander"
    }
  }
}
```

#### If installed from source:

```json
{
  "mcpServers": {
    "filecommander": {
      "command": "node",
      "args": ["/absolute/path/to/filecommander-mcp/dist/index.js"]
    }
  }
}
```

Restart Claude Desktop after saving.

### Other MCP Clients

The server communicates via **stdio transport**. Point your MCP client to the `dist/index.js` entry point or the `bach-filecommander` binary.

---

## Tools Overview

### Filesystem Operations (14 tools)

| Tool | Description |
|------|-------------|
| `fc_read_file` | Read file contents with optional line limit |
| `fc_read_multiple_files` | Read up to 20 files in a single call |
| `fc_write_file` | Write/create/append to files |
| `fc_edit_file` | Line-based editing (replace, insert, delete lines) |
| `fc_str_replace` | Replace a unique string in a file with context validation |
| `fc_list_directory` | List directory contents (recursive, configurable depth) |
| `fc_create_directory` | Create directories (including parents) |
| `fc_delete_file` | Delete a file (permanent) |
| `fc_delete_directory` | Delete a directory (with optional recursive flag) |
| `fc_safe_delete` | Move to Recycle Bin / Trash (recoverable!) |
| `fc_move` | Move or rename files and directories |
| `fc_copy` | Copy files and directories |
| `fc_file_info` | Get detailed file metadata (size, dates, type) |
| `fc_search_files` | Synchronous file search with wildcard patterns |

### Async Search (5 tools)

| Tool | Description |
|------|-------------|
| `fc_start_search` | Start a background search (returns immediately) |
| `fc_get_search_results` | Retrieve results with pagination |
| `fc_stop_search` | Cancel a running search |
| `fc_list_searches` | List all active/completed searches |
| `fc_clear_search` | Remove completed searches from memory |

### Process Management (4 tools)

| Tool | Description |
|------|-------------|
| `fc_execute_command` | Execute a shell command (blocking, with timeout) |
| `fc_start_process` | Start a background process (non-blocking) |
| `fc_list_processes` | List running system processes |
| `fc_kill_process` | Terminate a process by PID or name |

### Interactive Sessions (5 tools)

| Tool | Description |
|------|-------------|
| `fc_start_session` | Start an interactive process (Python, Node, shell...) |
| `fc_read_output` | Read session output |
| `fc_send_input` | Send input to a running session |
| `fc_list_sessions` | List all sessions |
| `fc_close_session` | Terminate a session |

### File Maintenance & Repair (8 tools) - NEW in v1.4.0

| Tool | Description |
|------|-------------|
| `fc_fix_json` | Repair broken JSON (BOM, trailing commas, comments, single quotes) |
| `fc_validate_json` | Validate JSON with detailed error position and context |
| `fc_cleanup_file` | Remove BOM, NUL bytes, trailing whitespace, normalize line endings |
| `fc_fix_encoding` | Fix Mojibake / double-encoded UTF-8 (27+ character patterns) |
| `fc_folder_diff` | Track directory changes with snapshots (new/modified/deleted) |
| `fc_batch_rename` | Pattern-based batch renaming (prefix/suffix, replace, auto-detect) |
| `fc_convert_format` | Convert between JSON, CSV, INI, YAML, TOML, XML, and TOON formats |
| `fc_detect_duplicates` | Find duplicate files using SHA-256 hashing |
| `fc_checksum` | File hashing (MD5, SHA-1, SHA-256, SHA-512) with optional compare |

### Archive (1 tool)

| Tool | Description |
|------|-------------|
| `fc_archive` | Create, extract, and list ZIP archives |

### OCR (1 tool)

| Tool | Description |
|------|-------------|
| `fc_ocr` | Extract text from images via tesseract.js (optional dependency) |

### System (2 tools)

| Tool | Description |
|------|-------------|
| `fc_get_time` | Get current system time with timezone info |
| `fc_set_safe_mode` | Toggle safe mode: all deletes go through Recycle Bin / Trash |

### Export (2 tools)

| Tool | Description |
|------|-------------|
| `fc_md_to_html` | Markdown to standalone HTML with CSS styling (headers, code blocks, tables, nested lists, blockquotes, images, checkboxes) |
| `fc_md_to_pdf` | Markdown to PDF via headless browser (Edge/Chrome). Falls back to HTML if no browser is available |

**Total: 43 tools**

---

## Comparison with Alternatives

| Feature | FileCommander | [Desktop Commander](https://github.com/wonderwhy-er/DesktopCommanderMCP) | [Official Filesystem](https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem) |
|---------|:---:|:---:|:---:|
| File read/write/copy/move | 14 tools | Yes | Yes |
| Safe delete (Recycle Bin) | Yes | No | No |
| Async background search | 5 tools | No | No |
| Interactive sessions (REPL) | 5 tools | Yes | No |
| Process management | 4 tools | Yes | No |
| Shell command execution | Yes | Yes | No |
| String replace with validation | Yes | Yes | No |
| Line-based file editing | Yes | No | No |
| JSON repair & validation | 2 tools | No | No |
| Encoding fix (Mojibake) | Yes | No | No |
| Duplicate detection (SHA-256) | Yes | No | No |
| Folder diff / change tracking | Yes | No | No |
| Batch rename (pattern-based) | Yes | No | No |
| Format conversion (JSON/CSV/INI/YAML/TOML/XML/TOON) | Yes | No | No |
| ZIP archive (create/extract/list) | Yes | No | No |
| File checksums (SHA-256/MD5) | Yes | No | No |
| OCR (image to text) | Optional | No | No |
| Safety mode (delete → Recycle Bin) | Yes | No | No |
| Path allowlist / sandboxing | No | No | Yes |
| Excel / PDF support | PDF (via browser) | Yes | No |
| HTTP transport | No | No | No |
| Markdown to HTML/PDF export | Yes | No | No |
| **Total tools** | **43** | ~15 | ~11 |
| **Servers needed** | **1** | 1 | + extra for processes |

**Key differentiators:**
- Only MCP server with **recoverable delete** (Recycle Bin / Trash)
- Only MCP server with **async background search** with pagination
- Built-in **JSON repair**, **encoding fix**, and **duplicate detection**
- Most comprehensive single-server solution (43 tools)
- Built-in **safety mode** to prevent accidental permanent deletion

---

## Tool Prefix

All tools use the `fc_` prefix (FileCommander) to avoid conflicts with other MCP servers.

---

## Security

**This server has full filesystem access with the running user's permissions.**

See [SECURITY.md](SECURITY.md) for detailed security information and recommendations.

Key points:
- `fc_execute_command` runs arbitrary shell commands
- `fc_delete_*` tools perform permanent deletion by default (use `fc_safe_delete` or enable **safe mode** via `fc_set_safe_mode` to route all deletes through Recycle Bin / Trash)
- No built-in sandboxing - security is delegated to the MCP client layer
- Designed for local use via stdio transport only

---

## Development

```bash
# Install dependencies
npm install

# Watch mode (auto-rebuild on changes)
npm run dev

# One-time build
npm run build

# Start the server
npm start
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

---

## License

[MIT](LICENSE) - Lukas (BACH)
