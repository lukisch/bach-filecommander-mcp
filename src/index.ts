#!/usr/bin/env node
/**
 * BACH FileCommander MCP Server
 *
 * A comprehensive MCP server for filesystem access, process management,
 * interactive sessions, and async file search.
 *
 * Copyright (c) 2025-2026 Lukas (BACH). Licensed under MIT License.
 * See LICENSE file for details.
 *
 * @author Lukas (BACH)
 * @version 1.3.0
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
import { exec, spawn } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// ============================================================================
// Server Initialization
// ============================================================================

const server = new McpServer({
  name: "bach-filecommander-mcp",
  version: "1.3.0"
});

// ============================================================================
// Process Session Management (für interaktive Prozesse)
// ============================================================================

interface ProcessSession {
  id: string;
  process: ReturnType<typeof spawn>;
  command: string;
  args: string[];
  cwd: string;
  startTime: Date;
  output: string[];
  isRunning: boolean;
}

const processSessions: Map<string, ProcessSession> = new Map();
let sessionCounter = 0;

function generateSessionId(): string {
  return `session_${++sessionCounter}_${Date.now()}`;
}

// ============================================================================
// Async Search Management (für Hintergrund-Suchen)
// ============================================================================

interface SearchSession {
  id: string;
  directory: string;
  pattern: RegExp;
  patternString: string;
  results: string[];
  isRunning: boolean;
  startTime: Date;
  scannedDirs: number;
  abortController: AbortController;
}

const searchSessions: Map<string, SearchSession> = new Map();
let searchCounter = 0;

function generateSearchId(): string {
  return `search_${++searchCounter}_${Date.now()}`;
}

/**
 * Asynchrone rekursive Suche mit AbortController
 */
async function asyncSearchFiles(
  session: SearchSession,
  dirPath: string
): Promise<void> {
  if (!session.isRunning || session.abortController.signal.aborted) {
    return;
  }

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    session.scannedDirs++;

    for (const entry of entries) {
      if (!session.isRunning || session.abortController.signal.aborted) {
        return;
      }

      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Skip system directories
        if (!['node_modules', '.git', '$RECYCLE.BIN', 'System Volume Information', 'Windows', 'Program Files', 'Program Files (x86)'].includes(entry.name)) {
          await asyncSearchFiles(session, fullPath);
        }
      } else if (session.pattern.test(entry.name)) {
        session.results.push(fullPath);
      }
    }
  } catch {
    // Ignore permission errors silently
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Normalisiert Pfade für Windows/Unix Kompatibilität
 */
function normalizePath(inputPath: string): string {
  return path.normalize(inputPath);
}

/**
 * Prüft ob ein Pfad existiert
 */
async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Formatiert Dateigröße menschenlesbar
 */
function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let size = bytes;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Prüft ob ein Pfad Windows-Sonderzeichen enthält die Probleme machen
 */
function hasWindowsSpecialChars(inputPath: string): boolean {
  return /[&^%$#@!]/.test(inputPath);
}

/**
 * Escaped einen Pfad für PowerShell-Nutzung
 * Behandelt & und andere Sonderzeichen korrekt
 */
function escapeForPowerShell(inputPath: string): string {
  // In PowerShell: & ist der Call-Operator, muss in Quotes oder escaped werden
  // Backtick (`) ist das Escape-Zeichen in PowerShell
  return inputPath
    .replace(/`/g, '``')      // Backtick zuerst escapen
    .replace(/\$/g, '`$')     // Dollar-Zeichen
    .replace(/"/g, '`"')      // Anführungszeichen
    .replace(/'/g, "''");     // Single quotes verdoppeln
}

/**
 * Escaped einen Pfad für cmd.exe-Nutzung
 * Behandelt & ^ % und andere Sonderzeichen
 */
function escapeForCmd(inputPath: string): string {
  // In cmd.exe: ^ ist das Escape-Zeichen
  return inputPath
    .replace(/([&^%!<>|])/g, '^$1');  // Sonderzeichen mit ^ escapen
}

/**
 * Ermittelt den PowerShell-Pfad auf Windows
 * Fallback-Kette: pwsh -> powershell.exe im System32 -> cmd.exe
 */
function getWindowsShell(): string {
  const systemRoot = process.env.SystemRoot || 'C:\\Windows';
  const ps7Path = `${systemRoot}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`;

  // Prüfe ob PowerShell im System32 existiert
  try {
    if (fsSync.existsSync(ps7Path)) {
      return ps7Path;
    }
  } catch {
    // Ignore
  }

  // Fallback zu cmd.exe
  return `${systemRoot}\\System32\\cmd.exe`;
}

/**
 * Führt einen Befehl aus - auf Windows mit korrektem Escaping für Sonderzeichen
 * Erkennt automatisch & und andere problematische Zeichen in Pfaden
 */
async function executeCommand(
  command: string,
  options: { cwd?: string; timeout?: number } = {}
): Promise<{ stdout: string; stderr: string }> {
  const isWindows = process.platform === 'win32';
  const cwd = options.cwd;

  // Auf Windows bei Sonderzeichen im Pfad oder Befehl: Spezielles Handling
  const cwdHasSpecialChars = cwd && hasWindowsSpecialChars(cwd);
  const cmdHasSpecialChars = hasWindowsSpecialChars(command);

  if (isWindows && (cwdHasSpecialChars || cmdHasSpecialChars)) {
    const windowsShell = getWindowsShell();

    if (windowsShell.includes('powershell')) {
      // PowerShell: Nutze -LiteralPath für Pfade mit Sonderzeichen
      const escapedCwd = cwd ? escapeForPowerShell(cwd) : '';

      // Befehl für PowerShell vorbereiten
      // Bei Pfaden mit & den Call-Operator nutzen: & "pfad mit &"
      let psCommand: string;

      if (cwd) {
        psCommand = `Set-Location -LiteralPath '${escapedCwd}'; ${command}`;
      } else {
        psCommand = command;
      }

      // Wenn der Befehl selbst Pfade mit & enthält, diese in Quotes wrappen
      // Erkennt Muster wie: python "C:\path\with & special\script.py"
      psCommand = psCommand.replace(
        /(?<!["`'])([A-Za-z]:\\[^"'`\n]*&[^"'`\n]*?)(?=\s|$)/g,
        '"$1"'
      );

      return execAsync(`"${windowsShell}" -Command "${psCommand.replace(/"/g, '\\"')}"`, {
        timeout: options.timeout
      });
    } else {
      // cmd.exe: Escape mit ^
      const escapedCmd = escapeForCmd(command);
      const escapedCwd = cwd ? escapeForCmd(cwd) : undefined;

      return execAsync(escapedCmd, {
        ...options,
        cwd: escapedCwd || cwd,
        shell: windowsShell
      });
    }
  }

  return execAsync(command, options);
}
async function listDirectoryRecursive(
  dirPath: string, 
  maxDepth: number, 
  currentDepth: number = 0
): Promise<string[]> {
  const results: string[] = [];
  
  if (currentDepth > maxDepth) return results;
  
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const indent = "  ".repeat(currentDepth);
    
    if (entry.isDirectory()) {
      results.push(`${indent}📁 ${entry.name}/`);
      if (currentDepth < maxDepth) {
        const subEntries = await listDirectoryRecursive(fullPath, maxDepth, currentDepth + 1);
        results.push(...subEntries);
      }
    } else {
      results.push(`${indent}📄 ${entry.name}`);
    }
  }
  
  return results;
}

/**
 * Rekursive Dateisuche
 */
async function searchFilesRecursive(
  dirPath: string,
  pattern: RegExp,
  maxResults: number,
  results: string[] = []
): Promise<string[]> {
  if (results.length >= maxResults) return results;
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (results.length >= maxResults) break;
      
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip system directories
        if (!['node_modules', '.git', '$RECYCLE.BIN', 'System Volume Information'].includes(entry.name)) {
          await searchFilesRecursive(fullPath, pattern, maxResults, results);
        }
      } else if (pattern.test(entry.name)) {
        results.push(fullPath);
      }
    }
  } catch {
    // Ignore permission errors
  }
  
  return results;
}

// ============================================================================
// Tool: Read File
// ============================================================================

server.registerTool(
  "fc_read_file",
  {
    title: "Datei lesen",
    description: `Liest den Inhalt einer Datei.

Args:
  - path (string): Vollständiger Pfad zur Datei
  - encoding (string, optional): Zeichenkodierung (default: utf-8)
  - max_lines (number, optional): Maximale Anzahl Zeilen (0 = alle)

Returns:
  - Dateiinhalt als Text
  - Bei Binärdateien: Base64-kodierter Inhalt

Beispiele:
  - path: "C:\\Users\\User\\test.txt"
  - path: "/home/user/config.json"`,
    inputSchema: {
      path: z.string().min(1).describe("Vollständiger Pfad zur Datei"),
      encoding: z.string().default("utf-8").describe("Zeichenkodierung"),
      max_lines: z.number().int().min(0).default(0).describe("Max Zeilen (0 = alle)")
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const filePath = normalizePath(params.path);
      
      if (!await pathExists(filePath)) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Datei nicht gefunden: ${filePath}` }]
        };
      }
      
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Pfad ist ein Verzeichnis: ${filePath}. Nutze fc_list_directory.` }]
        };
      }
      
      let content = await fs.readFile(filePath, params.encoding as BufferEncoding);
      
      if (params.max_lines > 0) {
        const lines = content.split('\n');
        content = lines.slice(0, params.max_lines).join('\n');
        if (lines.length > params.max_lines) {
          content += `\n\n... (${lines.length - params.max_lines} weitere Zeilen)`;
        }
      }
      
      return {
        content: [{ 
          type: "text", 
          text: `📄 **${path.basename(filePath)}** (${formatFileSize(stats.size)})\n\n${content}` 
        }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Lesen: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: Write File
// ============================================================================

server.registerTool(
  "fc_write_file",
  {
    title: "Datei schreiben",
    description: `Schreibt Inhalt in eine Datei. Erstellt die Datei falls nicht vorhanden.

Args:
  - path (string): Vollständiger Pfad zur Datei
  - content (string): Zu schreibender Inhalt
  - append (boolean, optional): An Datei anhängen statt überschreiben
  - create_dirs (boolean, optional): Fehlende Verzeichnisse erstellen

Returns:
  - Bestätigung mit Dateigröße

⚠️ ACHTUNG: Überschreibt existierende Dateien ohne Warnung wenn append=false!`,
    inputSchema: {
      path: z.string().min(1).describe("Vollständiger Pfad zur Datei"),
      content: z.string().describe("Zu schreibender Inhalt"),
      append: z.boolean().default(false).describe("An Datei anhängen"),
      create_dirs: z.boolean().default(true).describe("Fehlende Verzeichnisse erstellen")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const filePath = normalizePath(params.path);
      const dirPath = path.dirname(filePath);
      
      if (params.create_dirs && !await pathExists(dirPath)) {
        await fs.mkdir(dirPath, { recursive: true });
      }
      
      if (params.append) {
        await fs.appendFile(filePath, params.content, "utf-8");
      } else {
        await fs.writeFile(filePath, params.content, "utf-8");
      }
      
      const stats = await fs.stat(filePath);
      const action = params.append ? "erweitert" : "geschrieben";
      
      return {
        content: [{ 
          type: "text", 
          text: `✅ Datei ${action}: ${filePath}\n📊 Größe: ${formatFileSize(stats.size)}` 
        }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Schreiben: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: List Directory
// ============================================================================

server.registerTool(
  "fc_list_directory",
  {
    title: "Verzeichnis auflisten",
    description: `Listet Dateien und Unterverzeichnisse auf.

Args:
  - path (string): Pfad zum Verzeichnis
  - depth (number, optional): Maximale Tiefe für rekursive Auflistung (default: 1)
  - show_hidden (boolean, optional): Versteckte Dateien anzeigen

Returns:
  - Formatierte Liste aller Einträge mit Icons (📁/📄)`,
    inputSchema: {
      path: z.string().min(1).describe("Pfad zum Verzeichnis"),
      depth: z.number().int().min(0).max(10).default(1).describe("Rekursionstiefe"),
      show_hidden: z.boolean().default(false).describe("Versteckte Dateien anzeigen")
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const dirPath = normalizePath(params.path);
      
      if (!await pathExists(dirPath)) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Verzeichnis nicht gefunden: ${dirPath}` }]
        };
      }
      
      const stats = await fs.stat(dirPath);
      if (!stats.isDirectory()) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Pfad ist keine Verzeichnis: ${dirPath}. Nutze fc_read_file.` }]
        };
      }
      
      const entries = await listDirectoryRecursive(dirPath, params.depth);
      
      // Filter hidden files if needed
      const filteredEntries = params.show_hidden 
        ? entries 
        : entries.filter(e => !e.trim().startsWith('📁 .') && !e.trim().startsWith('📄 .'));
      
      return {
        content: [{ 
          type: "text", 
          text: `📂 **${dirPath}**\n\n${filteredEntries.join('\n') || '(Verzeichnis ist leer)'}` 
        }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Auflisten: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: Create Directory
// ============================================================================

server.registerTool(
  "fc_create_directory",
  {
    title: "Verzeichnis erstellen",
    description: `Erstellt ein neues Verzeichnis (inkl. Elternverzeichnisse).

Args:
  - path (string): Pfad zum neuen Verzeichnis

Returns:
  - Bestätigung der Erstellung`,
    inputSchema: {
      path: z.string().min(1).describe("Pfad zum neuen Verzeichnis")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const dirPath = normalizePath(params.path);
      
      if (await pathExists(dirPath)) {
        return {
          content: [{ type: "text", text: `ℹ️ Verzeichnis existiert bereits: ${dirPath}` }]
        };
      }
      
      await fs.mkdir(dirPath, { recursive: true });
      
      return {
        content: [{ type: "text", text: `✅ Verzeichnis erstellt: ${dirPath}` }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Erstellen: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: Delete File
// ============================================================================

server.registerTool(
  "fc_delete_file",
  {
    title: "Datei löschen",
    description: `Löscht eine Datei.

Args:
  - path (string): Pfad zur Datei

⚠️ ACHTUNG: Unwiderruflich! Keine Papierkorb-Funktion.`,
    inputSchema: {
      path: z.string().min(1).describe("Pfad zur Datei")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const filePath = normalizePath(params.path);
      
      if (!await pathExists(filePath)) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Datei nicht gefunden: ${filePath}` }]
        };
      }
      
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Pfad ist ein Verzeichnis. Nutze fc_delete_directory.` }]
        };
      }
      
      await fs.unlink(filePath);
      
      return {
        content: [{ type: "text", text: `✅ Datei gelöscht: ${filePath}` }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Löschen: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: Delete Directory
// ============================================================================

server.registerTool(
  "fc_delete_directory",
  {
    title: "Verzeichnis löschen",
    description: `Löscht ein Verzeichnis.

Args:
  - path (string): Pfad zum Verzeichnis
  - recursive (boolean): Auch nicht-leere Verzeichnisse löschen

⚠️ ACHTUNG: Mit recursive=true werden ALLE Inhalte unwiderruflich gelöscht!`,
    inputSchema: {
      path: z.string().min(1).describe("Pfad zum Verzeichnis"),
      recursive: z.boolean().default(false).describe("Rekursiv löschen")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const dirPath = normalizePath(params.path);
      
      if (!await pathExists(dirPath)) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Verzeichnis nicht gefunden: ${dirPath}` }]
        };
      }
      
      const stats = await fs.stat(dirPath);
      if (!stats.isDirectory()) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Pfad ist keine Verzeichnis. Nutze fc_delete_file.` }]
        };
      }
      
      await fs.rm(dirPath, { recursive: params.recursive });
      
      return {
        content: [{ type: "text", text: `✅ Verzeichnis gelöscht: ${dirPath}` }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('ENOTEMPTY')) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Verzeichnis nicht leer. Setze recursive=true zum Löschen aller Inhalte.` }]
        };
      }
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Löschen: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: Move/Rename
// ============================================================================

server.registerTool(
  "fc_move",
  {
    title: "Verschieben/Umbenennen",
    description: `Verschiebt oder benennt eine Datei/Verzeichnis um.

Args:
  - source (string): Quellpfad
  - destination (string): Zielpfad

Beispiele:
  - Umbenennen: source="test.txt", destination="test_neu.txt"
  - Verschieben: source="C:\\a\\test.txt", destination="C:\\b\\test.txt"`,
    inputSchema: {
      source: z.string().min(1).describe("Quellpfad"),
      destination: z.string().min(1).describe("Zielpfad")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const sourcePath = normalizePath(params.source);
      const destPath = normalizePath(params.destination);
      
      if (!await pathExists(sourcePath)) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Quelle nicht gefunden: ${sourcePath}` }]
        };
      }
      
      // Create destination directory if needed
      const destDir = path.dirname(destPath);
      if (!await pathExists(destDir)) {
        await fs.mkdir(destDir, { recursive: true });
      }
      
      await fs.rename(sourcePath, destPath);
      
      return {
        content: [{ type: "text", text: `✅ Verschoben:\n  📤 ${sourcePath}\n  📥 ${destPath}` }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Verschieben: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: Copy
// ============================================================================

server.registerTool(
  "fc_copy",
  {
    title: "Kopieren",
    description: `Kopiert eine Datei oder ein Verzeichnis.

Args:
  - source (string): Quellpfad
  - destination (string): Zielpfad
  - recursive (boolean): Verzeichnisse rekursiv kopieren`,
    inputSchema: {
      source: z.string().min(1).describe("Quellpfad"),
      destination: z.string().min(1).describe("Zielpfad"),
      recursive: z.boolean().default(true).describe("Rekursiv kopieren")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const sourcePath = normalizePath(params.source);
      const destPath = normalizePath(params.destination);
      
      if (!await pathExists(sourcePath)) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Quelle nicht gefunden: ${sourcePath}` }]
        };
      }
      
      // Create destination directory if needed
      const destDir = path.dirname(destPath);
      if (!await pathExists(destDir)) {
        await fs.mkdir(destDir, { recursive: true });
      }
      
      const stats = await fs.stat(sourcePath);
      
      if (stats.isDirectory()) {
        await fs.cp(sourcePath, destPath, { recursive: params.recursive });
      } else {
        await fs.copyFile(sourcePath, destPath);
      }
      
      return {
        content: [{ type: "text", text: `✅ Kopiert:\n  📤 ${sourcePath}\n  📥 ${destPath}` }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Kopieren: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: File Info
// ============================================================================

server.registerTool(
  "fc_file_info",
  {
    title: "Datei-Informationen",
    description: `Zeigt detaillierte Informationen zu einer Datei/Verzeichnis.

Args:
  - path (string): Pfad zur Datei/Verzeichnis

Returns:
  - Größe, Typ, Erstellungs-/Änderungsdatum, Berechtigungen`,
    inputSchema: {
      path: z.string().min(1).describe("Pfad zur Datei/Verzeichnis")
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const targetPath = normalizePath(params.path);
      
      if (!await pathExists(targetPath)) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Pfad nicht gefunden: ${targetPath}` }]
        };
      }
      
      const stats = await fs.stat(targetPath);
      const type = stats.isDirectory() ? "Verzeichnis" : stats.isFile() ? "Datei" : "Sonstiges";
      
      const info = [
        `📋 **Informationen: ${path.basename(targetPath)}**`,
        ``,
        `| Eigenschaft | Wert |`,
        `|-------------|------|`,
        `| Typ | ${type} |`,
        `| Größe | ${formatFileSize(stats.size)} |`,
        `| Erstellt | ${stats.birthtime.toLocaleString('de-DE')} |`,
        `| Geändert | ${stats.mtime.toLocaleString('de-DE')} |`,
        `| Zugegriffen | ${stats.atime.toLocaleString('de-DE')} |`,
        `| Pfad | ${targetPath} |`
      ];
      
      return {
        content: [{ type: "text", text: info.join('\n') }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: Search Files
// ============================================================================

server.registerTool(
  "fc_search_files",
  {
    title: "Dateien suchen",
    description: `Sucht Dateien nach Name/Muster in einem Verzeichnis.

Args:
  - directory (string): Startverzeichnis für die Suche
  - pattern (string): Suchmuster (unterstützt * und ? Wildcards)
  - max_results (number, optional): Maximale Ergebnisse (default: 50)

Beispiele:
  - pattern: "*.txt" - Alle Textdateien
  - pattern: "test*" - Dateien die mit "test" beginnen
  - pattern: "*.py" - Alle Python-Dateien`,
    inputSchema: {
      directory: z.string().min(1).describe("Startverzeichnis"),
      pattern: z.string().min(1).describe("Suchmuster mit Wildcards"),
      max_results: z.number().int().min(1).max(500).default(50).describe("Max Ergebnisse")
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const dirPath = normalizePath(params.directory);
      
      if (!await pathExists(dirPath)) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Verzeichnis nicht gefunden: ${dirPath}` }]
        };
      }
      
      // Convert wildcard pattern to regex
      const regexPattern = params.pattern
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');
      const regex = new RegExp(`^${regexPattern}$`, 'i');
      
      const results = await searchFilesRecursive(dirPath, regex, params.max_results);
      
      if (results.length === 0) {
        return {
          content: [{ type: "text", text: `🔍 Keine Dateien gefunden für: "${params.pattern}"` }]
        };
      }
      
      const output = [
        `🔍 **Suchergebnisse für "${params.pattern}"**`,
        `📁 In: ${dirPath}`,
        `📊 Gefunden: ${results.length} ${results.length >= params.max_results ? `(Maximum erreicht)` : ''}`,
        ``,
        ...results.map(r => `  📄 ${r}`)
      ];
      
      return {
        content: [{ type: "text", text: output.join('\n') }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler bei Suche: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: Start Async Search
// ============================================================================

server.registerTool(
  "fc_start_search",
  {
    title: "Asynchrone Suche starten",
    description: `Startet eine Suche im Hintergrund. Claude kann währenddessen andere Aufgaben erledigen.

Args:
  - directory (string): Startverzeichnis
  - pattern (string): Suchmuster (Wildcards: * und ?)

Returns:
  - Search-ID für fc_get_search_results, fc_stop_search

Beispiel:
  Suche starten: fc_start_search("C:\\Users", "*.pdf")
  Später Ergebnisse holen: fc_get_search_results(search_id)`,
    inputSchema: {
      directory: z.string().min(1).describe("Startverzeichnis"),
      pattern: z.string().min(1).describe("Suchmuster mit Wildcards")
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const dirPath = normalizePath(params.directory);
      
      if (!await pathExists(dirPath)) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Verzeichnis nicht gefunden: ${dirPath}` }]
        };
      }

      // Convert wildcard pattern to regex
      const regexPattern = params.pattern
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');
      const regex = new RegExp(`^${regexPattern}$`, 'i');

      const searchId = generateSearchId();
      const abortController = new AbortController();

      const session: SearchSession = {
        id: searchId,
        directory: dirPath,
        pattern: regex,
        patternString: params.pattern,
        results: [],
        isRunning: true,
        startTime: new Date(),
        scannedDirs: 0,
        abortController
      };

      searchSessions.set(searchId, session);

      // Start search in background (don't await)
      asyncSearchFiles(session, dirPath).then(() => {
        session.isRunning = false;
      }).catch(() => {
        session.isRunning = false;
      });

      return {
        content: [{ 
          type: "text", 
          text: `🔍 **Suche gestartet**\n\n| | |\n|---|---|\n| Search-ID | \`${searchId}\` |\n| Verzeichnis | ${dirPath} |\n| Muster | ${params.pattern} |\n\nNutze \`fc_get_search_results\` um Ergebnisse abzurufen.`
        }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Starten der Suche: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: Get Search Results
// ============================================================================

server.registerTool(
  "fc_get_search_results",
  {
    title: "Suchergebnisse abrufen",
    description: `Ruft Ergebnisse einer laufenden oder beendeten Suche ab.

Args:
  - search_id (string): Search-ID von fc_start_search
  - offset (number, optional): Ab welchem Ergebnis (für Paginierung)
  - limit (number, optional): Maximale Anzahl Ergebnisse (default: 50)

Returns:
  - Status der Suche und gefundene Dateien`,
    inputSchema: {
      search_id: z.string().min(1).describe("Search-ID"),
      offset: z.number().int().min(0).default(0).describe("Start-Offset"),
      limit: z.number().int().min(1).max(200).default(50).describe("Max Ergebnisse")
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    const session = searchSessions.get(params.search_id);

    if (!session) {
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Suche nicht gefunden: ${params.search_id}\n\nNutze fc_list_searches für aktive Suchen.` }]
      };
    }

    const status = session.isRunning ? '🔄 Läuft' : '✅ Abgeschlossen';
    const runtime = Math.round((Date.now() - session.startTime.getTime()) / 1000);
    const totalResults = session.results.length;
    const paginatedResults = session.results.slice(params.offset, params.offset + params.limit);
    const hasMore = totalResults > params.offset + params.limit;

    const output = [
      `🔍 **Suchergebnisse** (${status})`,
      ``,
      `| | |`,
      `|---|---|`,
      `| Muster | ${session.patternString} |`,
      `| Verzeichnis | ${session.directory} |`,
      `| Gescannte Ordner | ${session.scannedDirs} |`,
      `| Gefunden | ${totalResults} Dateien |`,
      `| Laufzeit | ${runtime}s |`,
      ``,
      `**Ergebnisse ${params.offset + 1}-${Math.min(params.offset + params.limit, totalResults)} von ${totalResults}:**`,
      ``,
      ...paginatedResults.map(r => `  📄 ${r}`)
    ];

    if (hasMore) {
      output.push(``, `📌 Weitere Ergebnisse: \`fc_get_search_results("${params.search_id}", offset=${params.offset + params.limit})\``);
    }

    return {
      content: [{ type: "text", text: output.join('\n') }]
    };
  }
);

// ============================================================================
// Tool: Stop Search
// ============================================================================

server.registerTool(
  "fc_stop_search",
  {
    title: "Suche stoppen",
    description: `Stoppt eine laufende Hintergrund-Suche.

Args:
  - search_id (string): Search-ID`,
    inputSchema: {
      search_id: z.string().min(1).describe("Search-ID")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    const session = searchSessions.get(params.search_id);

    if (!session) {
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Suche nicht gefunden: ${params.search_id}` }]
      };
    }

    if (!session.isRunning) {
      return {
        content: [{ type: "text", text: `ℹ️ Suche bereits beendet. ${session.results.length} Ergebnisse gefunden.` }]
      };
    }

    session.isRunning = false;
    session.abortController.abort();

    return {
      content: [{ type: "text", text: `⏹️ Suche gestoppt: ${params.search_id}\n📊 ${session.results.length} Ergebnisse bis hierhin gefunden.` }]
    };
  }
);

// ============================================================================
// Tool: List Searches
// ============================================================================

server.registerTool(
  "fc_list_searches",
  {
    title: "Aktive Suchen auflisten",
    description: `Listet alle aktiven und beendeten Hintergrund-Suchen auf.`,
    inputSchema: {},
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async () => {
    if (searchSessions.size === 0) {
      return {
        content: [{ type: "text", text: `📋 Keine Suchen aktiv.\n\nStarte eine neue mit \`fc_start_search\`.` }]
      };
    }

    const rows: string[] = [];
    
    for (const [id, session] of searchSessions) {
      const status = session.isRunning ? '🔄' : '✅';
      const runtime = Math.round((Date.now() - session.startTime.getTime()) / 1000);
      rows.push(`| ${status} | \`${id}\` | ${session.patternString} | ${session.results.length} | ${runtime}s |`);
    }

    const output = [
      `📋 **Suchen** (${searchSessions.size})`,
      ``,
      `| Status | Search-ID | Muster | Ergebnisse | Laufzeit |`,
      `|--------|-----------|--------|------------|----------|`,
      ...rows
    ];

    return {
      content: [{ type: "text", text: output.join('\n') }]
    };
  }
);

// ============================================================================
// Tool: Clear Search
// ============================================================================

server.registerTool(
  "fc_clear_search",
  {
    title: "Suche entfernen",
    description: `Entfernt eine beendete Suche aus der Liste und gibt Speicher frei.

Args:
  - search_id (string): Search-ID (oder "all" für alle beendeten)`,
    inputSchema: {
      search_id: z.string().min(1).describe("Search-ID oder 'all'")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    if (params.search_id === "all") {
      let count = 0;
      for (const [id, session] of searchSessions) {
        if (!session.isRunning) {
          searchSessions.delete(id);
          count++;
        }
      }
      return {
        content: [{ type: "text", text: `🧹 ${count} beendete Suchen entfernt.` }]
      };
    }

    const session = searchSessions.get(params.search_id);

    if (!session) {
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Suche nicht gefunden: ${params.search_id}` }]
      };
    }

    if (session.isRunning) {
      return {
        isError: true,
        content: [{ type: "text", text: `⚠️ Suche läuft noch. Nutze erst fc_stop_search.` }]
      };
    }

    searchSessions.delete(params.search_id);

    return {
      content: [{ type: "text", text: `✅ Suche entfernt: ${params.search_id}` }]
    };
  }
);

// ============================================================================
// Tool: Safe Delete (Papierkorb)
// ============================================================================

server.registerTool(
  "fc_safe_delete",
  {
    title: "Sicher löschen (Papierkorb)",
    description: `Verschiebt Dateien/Verzeichnisse in den Papierkorb statt sie zu löschen.

Args:
  - path (string): Pfad zur Datei/Verzeichnis

✅ SICHER: Kann aus dem Papierkorb wiederhergestellt werden!

Hinweis: Nutzt Windows-Papierkorb oder erstellt Backup auf anderen Systemen.`,
    inputSchema: {
      path: z.string().min(1).describe("Pfad zur Datei/Verzeichnis")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,  // Nicht destructive weil wiederherstellbar!
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const targetPath = normalizePath(params.path);
      
      if (!await pathExists(targetPath)) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Pfad nicht gefunden: ${targetPath}` }]
        };
      }

      const stats = await fs.stat(targetPath);
      const itemType = stats.isDirectory() ? "Verzeichnis" : "Datei";
      const isWindows = process.platform === 'win32';
        // Windows: PowerShell mit VisualBasic für echten Papierkorb
      if (isWindows) {
        // Windows: PowerShell mit VisualBasic für echten Papierkorb
        const escapedPath = targetPath.replace(/'/g, "''");
        const deleteMethod = stats.isDirectory() ? 'DeleteDirectory' : 'DeleteFile';
        
        const psCommand = `Add-Type -AssemblyName Microsoft.VisualBasic; [Microsoft.VisualBasic.FileIO.FileSystem]::${deleteMethod}('${escapedPath}', 'OnlyErrorDialogs', 'SendToRecycleBin')`;

        const windowsShell = getWindowsShell();
        if (windowsShell.includes('powershell')) {
          await execAsync(`"${windowsShell}" -Command "${psCommand}"`);
        } else {
          // cmd.exe kann kein PowerShell - normales Löschen als Fallback
          if (stats.isDirectory()) {
            await fs.rm(targetPath, { recursive: true });
          } else {
            await fs.unlink(targetPath);
          }
        }
        return {
          content: [{ 
            type: "text", 
            text: `🗑️ **In Papierkorb verschoben**\n\n| | |\n|---|---|\n| Typ | ${itemType} |\n| Pfad | ${targetPath} |\n\n✅ Kann aus dem Papierkorb wiederhergestellt werden.`
          }]
        };
      } else {
        // Unix/Mac: Verschiebe in ~/.Trash oder erstelle Backup
        const trashDir = path.join(process.env.HOME || '/tmp', '.Trash');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const baseName = path.basename(targetPath);
        const trashPath = path.join(trashDir, `${baseName}_${timestamp}`);

        try {
          await fs.access(trashDir);
        } catch {
          await fs.mkdir(trashDir, { recursive: true });
        }

        await fs.rename(targetPath, trashPath);

        return {
          content: [{ 
            type: "text", 
            text: `🗑️ **In Papierkorb verschoben**\n\n| | |\n|---|---|\n| Typ | ${itemType} |\n| Original | ${targetPath} |\n| Papierkorb | ${trashPath} |\n\n✅ Kann wiederhergestellt werden.`
          }]
        };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Verschieben in Papierkorb: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: Execute Command
// ============================================================================

server.registerTool(
  "fc_execute_command",
  {
    title: "Befehl ausführen",
    description: `Führt einen Shell-Befehl aus und gibt die Ausgabe zurück.

Args:
  - command (string): Auszuführender Befehl
  - cwd (string, optional): Arbeitsverzeichnis
  - timeout (number, optional): Timeout in Millisekunden (default: 30000)

⚠️ ACHTUNG: Befehle werden mit Benutzerrechten ausgeführt!

Beispiele:
  - command: "dir" (Windows)
  - command: "ls -la" (Unix)
  - command: "python --version"`,
    inputSchema: {
      command: z.string().min(1).describe("Auszuführender Befehl"),
      cwd: z.string().optional().describe("Arbeitsverzeichnis"),
      timeout: z.number().int().min(1000).max(300000).default(30000).describe("Timeout in ms")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: true
    }
  },
  async (params) => {
    try {
      const options: { cwd?: string; timeout: number } = {
        timeout: params.timeout
      };
      
      if (params.cwd) {
        options.cwd = normalizePath(params.cwd);
      }
      const { stdout, stderr } = await executeCommand(params.command, options);
      
      const output: string[] = [`⚡ **Befehl:** \`${params.command}\``];
      
      if (stdout.trim()) {
        output.push(`\n**Ausgabe:**\n\`\`\`\n${stdout.trim()}\n\`\`\``);
      }
      
      if (stderr.trim()) {
        output.push(`\n**Fehlerausgabe:**\n\`\`\`\n${stderr.trim()}\n\`\`\``);
      }
      
      if (!stdout.trim() && !stderr.trim()) {
        output.push(`\n✅ Befehl ausgeführt (keine Ausgabe)`);
      }
      
      return {
        content: [{ type: "text", text: output.join('') }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler bei Befehlsausführung:\n${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: Start Process
// ============================================================================

server.registerTool(
  "fc_start_process",
  {
    title: "Prozess starten",
    description: `Startet einen Prozess im Hintergrund (non-blocking).

Args:
  - program (string): Programm/Executable
  - args (array, optional): Argumente als Array
  - cwd (string, optional): Arbeitsverzeichnis

Beispiele:
  - program: "notepad.exe", args: ["test.txt"]
  - program: "python", args: ["script.py"]
  - program: "code", args: ["."] (VS Code öffnen)`,
    inputSchema: {
      program: z.string().min(1).describe("Programm/Executable"),
      args: z.array(z.string()).default([]).describe("Argumente"),
      cwd: z.string().optional().describe("Arbeitsverzeichnis")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true
    }
  },
  async (params) => {
    try {
      const options: { cwd?: string; detached: boolean; stdio: 'ignore' } = {
        detached: true,
        stdio: 'ignore'
      };
      
      if (params.cwd) {
        options.cwd = normalizePath(params.cwd);
      }
      
      const child = spawn(params.program, params.args, options);
      child.unref();
      
      const argsStr = params.args.length > 0 ? ` ${params.args.join(' ')}` : '';
      
      return {
        content: [{ 
          type: "text", 
          text: `🚀 Prozess gestartet: ${params.program}${argsStr}\n📋 PID: ${child.pid}` 
        }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Starten: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: Get Current Time
// ============================================================================

server.registerTool(
  "fc_get_time",
  {
    title: "Aktuelle Zeit",
    description: `Gibt die aktuelle Systemzeit zurück.

Returns:
  - Datum, Uhrzeit, Wochentag, Zeitzone`,
    inputSchema: {},
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false
    }
  },
  async () => {
    const now = new Date();
    const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    
    const output = [
      `🕐 **Aktuelle Systemzeit**`,
      ``,
      `| | |`,
      `|---|---|`,
      `| Datum | ${now.toLocaleDateString('de-DE')} |`,
      `| Uhrzeit | ${now.toLocaleTimeString('de-DE')} |`,
      `| Wochentag | ${days[now.getDay()]} |`,
      `| ISO | ${now.toISOString()} |`,
      `| Zeitzone | ${Intl.DateTimeFormat().resolvedOptions().timeZone} |`
    ];
    
    return {
      content: [{ type: "text", text: output.join('\n') }]
    };
  }
);

// ============================================================================
// Tool: Read Multiple Files
// ============================================================================

server.registerTool(
  "fc_read_multiple_files",
  {
    title: "Mehrere Dateien lesen",
    description: `Liest mehrere Dateien auf einmal und gibt deren Inhalte zurück.

Args:
  - paths (array): Array von Dateipfaden
  - max_lines_per_file (number, optional): Max Zeilen pro Datei (0 = alle)

Returns:
  - Inhalte aller Dateien mit Trennzeichen

Beispiel:
  paths: ["C:\\config.json", "C:\\readme.md"]`,
    inputSchema: {
      paths: z.array(z.string().min(1)).min(1).max(20).describe("Array von Dateipfaden"),
      max_lines_per_file: z.number().int().min(0).default(0).describe("Max Zeilen pro Datei")
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    const results: string[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (const filePath of params.paths) {
      const normalizedPath = normalizePath(filePath);
      
      try {
        if (!await pathExists(normalizedPath)) {
          results.push(`\n❌ **${path.basename(normalizedPath)}** - Nicht gefunden\n`);
          errorCount++;
          continue;
        }

        const stats = await fs.stat(normalizedPath);
        if (stats.isDirectory()) {
          results.push(`\n❌ **${path.basename(normalizedPath)}** - Ist ein Verzeichnis\n`);
          errorCount++;
          continue;
        }

        let content = await fs.readFile(normalizedPath, "utf-8");
        
        if (params.max_lines_per_file > 0) {
          const lines = content.split('\n');
          content = lines.slice(0, params.max_lines_per_file).join('\n');
          if (lines.length > params.max_lines_per_file) {
            content += `\n... (${lines.length - params.max_lines_per_file} weitere Zeilen)`;
          }
        }

        results.push(`\n📄 **${normalizedPath}** (${formatFileSize(stats.size)})\n${'─'.repeat(60)}\n${content}\n`);
        successCount++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        results.push(`\n❌ **${path.basename(normalizedPath)}** - ${errorMsg}\n`);
        errorCount++;
      }
    }

    const summary = `📊 **Ergebnis:** ${successCount} gelesen, ${errorCount} Fehler\n${'═'.repeat(60)}`;
    
    return {
      content: [{ type: "text", text: summary + results.join('') }]
    };
  }
);

// ============================================================================
// Tool: Edit File (Zeilenbasiert)
// ============================================================================

server.registerTool(
  "fc_edit_file",
  {
    title: "Datei bearbeiten (Zeilen)",
    description: `Bearbeitet eine Datei zeilenbasiert: ersetzen, einfügen oder löschen.

Args:
  - path (string): Pfad zur Datei
  - operation (string): "replace" | "insert" | "delete"
  - start_line (number): Startzeile (1-basiert)
  - end_line (number, optional): Endzeile für replace/delete
  - content (string, optional): Neuer Inhalt für replace/insert

Beispiele:
  - Zeilen 5-10 ersetzen: operation="replace", start_line=5, end_line=10, content="neuer text"
  - Nach Zeile 3 einfügen: operation="insert", start_line=3, content="neue zeile"
  - Zeilen 7-9 löschen: operation="delete", start_line=7, end_line=9`,
    inputSchema: {
      path: z.string().min(1).describe("Pfad zur Datei"),
      operation: z.enum(["replace", "insert", "delete"]).describe("Operation"),
      start_line: z.number().int().min(1).describe("Startzeile (1-basiert)"),
      end_line: z.number().int().min(1).optional().describe("Endzeile"),
      content: z.string().optional().describe("Neuer Inhalt")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const filePath = normalizePath(params.path);
      
      if (!await pathExists(filePath)) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Datei nicht gefunden: ${filePath}` }]
        };
      }

      const originalContent = await fs.readFile(filePath, "utf-8");
      const lines = originalContent.split('\n');
      const totalLines = lines.length;

      const startIdx = params.start_line - 1;
      const endIdx = params.end_line ? params.end_line - 1 : startIdx;

      if (startIdx < 0 || startIdx >= totalLines) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Startzeile ${params.start_line} ungültig. Datei hat ${totalLines} Zeilen.` }]
        };
      }

      if (endIdx < startIdx || endIdx >= totalLines) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Endzeile ${params.end_line} ungültig.` }]
        };
      }

      let newLines: string[];
      let actionDesc: string;

      switch (params.operation) {
        case "replace":
          if (!params.content) {
            return {
              isError: true,
              content: [{ type: "text", text: `❌ 'content' erforderlich für replace-Operation.` }]
            };
          }
          const replacementLines = params.content.split('\n');
          newLines = [
            ...lines.slice(0, startIdx),
            ...replacementLines,
            ...lines.slice(endIdx + 1)
          ];
          actionDesc = `Zeilen ${params.start_line}-${endIdx + 1} ersetzt durch ${replacementLines.length} Zeilen`;
          break;

        case "insert":
          if (!params.content) {
            return {
              isError: true,
              content: [{ type: "text", text: `❌ 'content' erforderlich für insert-Operation.` }]
            };
          }
          const insertLines = params.content.split('\n');
          newLines = [
            ...lines.slice(0, startIdx + 1),
            ...insertLines,
            ...lines.slice(startIdx + 1)
          ];
          actionDesc = `${insertLines.length} Zeilen nach Zeile ${params.start_line} eingefügt`;
          break;

        case "delete":
          newLines = [
            ...lines.slice(0, startIdx),
            ...lines.slice(endIdx + 1)
          ];
          actionDesc = `Zeilen ${params.start_line}-${endIdx + 1} gelöscht`;
          break;

        default:
          return {
            isError: true,
            content: [{ type: "text", text: `❌ Unbekannte Operation: ${params.operation}` }]
          };
      }

      await fs.writeFile(filePath, newLines.join('\n'), "utf-8");

      return {
        content: [{ 
          type: "text", 
          text: `✅ **${path.basename(filePath)}** bearbeitet\n📝 ${actionDesc}\n📊 ${totalLines} → ${newLines.length} Zeilen` 
        }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Bearbeiten: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: String Replace in File
// ============================================================================

server.registerTool(
  "fc_str_replace",
  {
    title: "String in Datei ersetzen",
    description: `Ersetzt einen eindeutigen String in einer Datei durch einen anderen.

Args:
  - path (string): Pfad zur Datei
  - old_str (string): Zu ersetzender String (muss genau 1x vorkommen)
  - new_str (string): Neuer String (leer = löschen)

Returns:
  - Bestätigung mit Kontext

⚠️ WICHTIG: old_str muss EXAKT 1x in der Datei vorkommen!
Bei 0 oder >1 Vorkommen wird ein Fehler ausgegeben.

Beispiele:
  - Funktionsname ändern: old_str="def old_name", new_str="def new_name"
  - Import hinzufügen: old_str="import os", new_str="import os\\nimport sys"
  - Zeile löschen: old_str="# TODO: remove this\\n", new_str=""`,
    inputSchema: {
      path: z.string().min(1).describe("Pfad zur Datei"),
      old_str: z.string().min(1).describe("Zu ersetzender String (muss eindeutig sein)"),
      new_str: z.string().default("").describe("Neuer String (leer = löschen)")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const filePath = normalizePath(params.path);
      
      if (!await pathExists(filePath)) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Datei nicht gefunden: ${filePath}` }]
        };
      }

      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        return {
          isError: true,
          content: [{ type: "text", text: `❌ Pfad ist ein Verzeichnis: ${filePath}` }]
        };
      }

      const content = await fs.readFile(filePath, "utf-8");
      
      // Count occurrences
      const occurrences = content.split(params.old_str).length - 1;
      
      if (occurrences === 0) {
        // Show a snippet of the file to help debug
        const preview = content.length > 500 ? content.substring(0, 500) + "..." : content;
        return {
          isError: true,
          content: [{ 
            type: "text", 
            text: `❌ String nicht gefunden in ${path.basename(filePath)}.\n\n**Gesucht:**\n\`\`\`\n${params.old_str}\n\`\`\`\n\n**Datei-Anfang:**\n\`\`\`\n${preview}\n\`\`\``
          }]
        };
      }
      
      if (occurrences > 1) {
        return {
          isError: true,
          content: [{ 
            type: "text", 
            text: `❌ String kommt ${occurrences}x vor (muss eindeutig sein).\n\n**Gesucht:**\n\`\`\`\n${params.old_str}\n\`\`\`\n\n💡 Tipp: Erweitere den Suchstring um mehr Kontext.`
          }]
        };
      }

      // Perform replacement
      const newContent = content.replace(params.old_str, params.new_str);
      await fs.writeFile(filePath, newContent, "utf-8");

      // Calculate change info
      const oldLines = params.old_str.split('\n').length;
      const newLines = params.new_str.split('\n').length;
      const lineChange = newLines - oldLines;
      const lineInfo = lineChange === 0 ? "gleiche Zeilenanzahl" : 
                       lineChange > 0 ? `+${lineChange} Zeilen` : `${lineChange} Zeilen`;

      // Show context around the change
      const changeIndex = content.indexOf(params.old_str);
      const contextStart = Math.max(0, changeIndex - 50);
      const contextEnd = Math.min(content.length, changeIndex + params.old_str.length + 50);
      const beforeContext = content.substring(contextStart, changeIndex);
      const afterContext = content.substring(changeIndex + params.old_str.length, contextEnd);

      return {
        content: [{ 
          type: "text", 
          text: `✅ **${path.basename(filePath)}** - String ersetzt\n\n| | |\n|---|---|\n| Änderung | ${lineInfo} |\n| Datei | ${filePath} |\n\n**Kontext:**\n\`\`\`\n...${beforeContext}▶${params.new_str}◀${afterContext}...\n\`\`\``
        }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Ersetzen: ${errorMsg}` }]
      };
    }
  }
)

// ============================================================================
// Tool: List Processes
// ============================================================================

server.registerTool(
  "fc_list_processes",
  {
    title: "Prozesse auflisten",
    description: `Listet laufende Systemprozesse auf.

Args:
  - filter (string, optional): Filter nach Prozessname

Returns:
  - Liste der Prozesse mit PID, Name, Speicher

Hinweis: Nutzt 'tasklist' (Windows) oder 'ps' (Unix)`,
    inputSchema: {
      filter: z.string().optional().describe("Filter nach Prozessname")
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true
    }
  },
  async (params) => {
    try {
      const isWindows = process.platform === 'win32';
      let command: string;

      if (isWindows) {
        command = params.filter 
          ? `tasklist /FI "IMAGENAME eq ${params.filter}*" /FO CSV /NH`
          : `tasklist /FO CSV /NH`;
      } else {
        command = params.filter
          ? `ps aux | grep -i "${params.filter}" | grep -v grep`
          : `ps aux --sort=-%mem | head -50`;
      }

      const { stdout } = await execAsync(command);

      if (!stdout.trim()) {
        return {
          content: [{ type: "text", text: `🔍 Keine Prozesse gefunden${params.filter ? ` für "${params.filter}"` : ''}.` }]
        };
      }

      let output: string;

      if (isWindows) {
        // Parse CSV output from tasklist
        const lines = stdout.trim().split('\n').filter(l => l.trim());
        const processes = lines.map(line => {
          const parts = line.split('","').map(p => p.replace(/"/g, ''));
          return `| ${parts[0] || '-'} | ${parts[1] || '-'} | ${parts[4] || '-'} |`;
        });
        
        output = [
          `📋 **Laufende Prozesse**${params.filter ? ` (Filter: ${params.filter})` : ''}`,
          ``,
          `| Name | PID | Speicher |`,
          `|------|-----|----------|`,
          ...processes.slice(0, 50)
        ].join('\n');
      } else {
        output = [
          `📋 **Laufende Prozesse**${params.filter ? ` (Filter: ${params.filter})` : ''}`,
          ``,
          '```',
          stdout.trim(),
          '```'
        ].join('\n');
      }

      return {
        content: [{ type: "text", text: output }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Auflisten: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: Kill Process
// ============================================================================

server.registerTool(
  "fc_kill_process",
  {
    title: "Prozess beenden",
    description: `Beendet einen Prozess nach PID oder Name.

Args:
  - pid (number, optional): Prozess-ID
  - name (string, optional): Prozessname
  - force (boolean): Erzwungenes Beenden

⚠️ ACHTUNG: Kann zu Datenverlust führen!`,
    inputSchema: {
      pid: z.number().int().optional().describe("Prozess-ID"),
      name: z.string().optional().describe("Prozessname"),
      force: z.boolean().default(false).describe("Erzwingen")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true
    }
  },
  async (params) => {
    if (!params.pid && !params.name) {
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Entweder 'pid' oder 'name' muss angegeben werden.` }]
      };
    }

    try {
      const isWindows = process.platform === 'win32';
      let command: string;

      if (isWindows) {
        if (params.pid) {
          command = params.force 
            ? `taskkill /F /PID ${params.pid}`
            : `taskkill /PID ${params.pid}`;
        } else {
          command = params.force
            ? `taskkill /F /IM "${params.name}"`
            : `taskkill /IM "${params.name}"`;
        }
      } else {
        if (params.pid) {
          command = params.force 
            ? `kill -9 ${params.pid}`
            : `kill ${params.pid}`;
        } else {
          command = params.force
            ? `pkill -9 "${params.name}"`
            : `pkill "${params.name}"`;
        }
      }

      const { stdout, stderr } = await execAsync(command);
      const target = params.pid ? `PID ${params.pid}` : `"${params.name}"`;

      return {
        content: [{ 
          type: "text", 
          text: `✅ Prozess beendet: ${target}\n${stdout || stderr || ''}`.trim()
        }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Beenden: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: Start Interactive Process (Session)
// ============================================================================

server.registerTool(
  "fc_start_session",
  {
    title: "Interaktive Session starten",
    description: `Startet einen interaktiven Prozess als Session (für fc_read_output und fc_send_input).

Args:
  - command (string): Befehl/Programm
  - args (array, optional): Argumente
  - cwd (string, optional): Arbeitsverzeichnis

Returns:
  - Session-ID für weitere Interaktion

Beispiele:
  - Python REPL: command="python"
  - Node REPL: command="node"
  - PowerShell: command="powershell"`,
    inputSchema: {
      command: z.string().min(1).describe("Befehl/Programm"),
      args: z.array(z.string()).default([]).describe("Argumente"),
      cwd: z.string().optional().describe("Arbeitsverzeichnis")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true
    }
  },
  async (params) => {
    try {
      const sessionId = generateSessionId();
      const cwd = params.cwd ? normalizePath(params.cwd) : process.cwd();

      const proc = spawn(params.command, params.args, {
        cwd,
        shell: true,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      const session: ProcessSession = {
        id: sessionId,
        process: proc,
        command: params.command,
        args: params.args,
        cwd,
        startTime: new Date(),
        output: [],
        isRunning: true
      };

      // Capture output
      proc.stdout?.on('data', (data: Buffer) => {
        session.output.push(data.toString());
        // Keep only last 1000 lines
        if (session.output.length > 1000) {
          session.output = session.output.slice(-500);
        }
      });

      proc.stderr?.on('data', (data: Buffer) => {
        session.output.push(`[stderr] ${data.toString()}`);
      });

      proc.on('close', (code) => {
        session.isRunning = false;
        session.output.push(`\n[Prozess beendet mit Code ${code}]`);
      });

      proc.on('error', (err) => {
        session.isRunning = false;
        session.output.push(`\n[Fehler: ${err.message}]`);
      });

      processSessions.set(sessionId, session);

      return {
        content: [{ 
          type: "text", 
          text: `🚀 **Session gestartet**\n\n| | |\n|---|---|\n| Session-ID | \`${sessionId}\` |\n| Befehl | ${params.command} ${params.args.join(' ')} |\n| PID | ${proc.pid} |\n| Verzeichnis | ${cwd} |\n\nNutze \`fc_read_output\` und \`fc_send_input\` zur Interaktion.`
        }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Starten: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: Read Process Output
// ============================================================================

server.registerTool(
  "fc_read_output",
  {
    title: "Session-Output lesen",
    description: `Liest die Ausgabe einer laufenden Session.

Args:
  - session_id (string): Session-ID von fc_start_session
  - clear (boolean, optional): Output nach dem Lesen löschen

Returns:
  - Gesammelter Output seit Start/letztem Clear`,
    inputSchema: {
      session_id: z.string().min(1).describe("Session-ID"),
      clear: z.boolean().default(false).describe("Output löschen")
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    const session = processSessions.get(params.session_id);

    if (!session) {
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Session nicht gefunden: ${params.session_id}\n\nNutze fc_list_sessions für aktive Sessions.` }]
      };
    }

    const output = session.output.join('');
    const status = session.isRunning ? '🟢 Läuft' : '🔴 Beendet';

    if (params.clear) {
      session.output = [];
    }

    return {
      content: [{ 
        type: "text", 
        text: `📤 **Session Output** (${status})\n\`\`\`\n${output || '(kein Output)'}\n\`\`\``
      }]
    };
  }
);

// ============================================================================
// Tool: Send Input to Process
// ============================================================================

server.registerTool(
  "fc_send_input",
  {
    title: "Input an Session senden",
    description: `Sendet Input an eine laufende Session.

Args:
  - session_id (string): Session-ID
  - input (string): Zu sendender Input
  - newline (boolean, optional): Zeilenumbruch anhängen (default: true)

Beispiele:
  - Python: input="print('Hello')"
  - Shell: input="ls -la"`,
    inputSchema: {
      session_id: z.string().min(1).describe("Session-ID"),
      input: z.string().describe("Zu sendender Input"),
      newline: z.boolean().default(true).describe("Zeilenumbruch anhängen")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true
    }
  },
  async (params) => {
    const session = processSessions.get(params.session_id);

    if (!session) {
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Session nicht gefunden: ${params.session_id}` }]
      };
    }

    if (!session.isRunning) {
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Session ist beendet. Starte eine neue mit fc_start_session.` }]
      };
    }

    try {
      const inputText = params.newline ? params.input + '\n' : params.input;
      session.process.stdin?.write(inputText);

      return {
        content: [{ 
          type: "text", 
          text: `📥 Input gesendet an ${params.session_id}:\n\`\`\`\n${params.input}\n\`\`\`\nNutze \`fc_read_output\` um die Antwort zu lesen.`
        }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Senden: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Tool: List Sessions
// ============================================================================

server.registerTool(
  "fc_list_sessions",
  {
    title: "Sessions auflisten",
    description: `Listet alle aktiven und beendeten Sessions auf.

Returns:
  - Tabelle aller Sessions mit Status`,
    inputSchema: {},
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async () => {
    if (processSessions.size === 0) {
      return {
        content: [{ type: "text", text: `📋 Keine Sessions vorhanden.\n\nStarte eine neue mit \`fc_start_session\`.` }]
      };
    }

    const rows: string[] = [];
    
    for (const [id, session] of processSessions) {
      const status = session.isRunning ? '🟢' : '🔴';
      const runtime = Math.round((Date.now() - session.startTime.getTime()) / 1000);
      rows.push(`| ${status} | \`${id}\` | ${session.command} | ${session.process.pid || '-'} | ${runtime}s |`);
    }

    const output = [
      `📋 **Aktive Sessions** (${processSessions.size})`,
      ``,
      `| Status | Session-ID | Befehl | PID | Laufzeit |`,
      `|--------|------------|--------|-----|----------|`,
      ...rows
    ];

    return {
      content: [{ type: "text", text: output.join('\n') }]
    };
  }
);

// ============================================================================
// Tool: Close Session
// ============================================================================

server.registerTool(
  "fc_close_session",
  {
    title: "Session beenden",
    description: `Beendet eine laufende Session und entfernt sie aus der Liste.

Args:
  - session_id (string): Session-ID
  - force (boolean, optional): Erzwungenes Beenden`,
    inputSchema: {
      session_id: z.string().min(1).describe("Session-ID"),
      force: z.boolean().default(false).describe("Erzwingen")
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    const session = processSessions.get(params.session_id);

    if (!session) {
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Session nicht gefunden: ${params.session_id}` }]
      };
    }

    try {
      if (session.isRunning) {
        if (params.force) {
          session.process.kill('SIGKILL');
        } else {
          session.process.kill('SIGTERM');
        }
      }

      processSessions.delete(params.session_id);

      return {
        content: [{ type: "text", text: `✅ Session beendet und entfernt: ${params.session_id}` }]
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `❌ Fehler beim Beenden: ${errorMsg}` }]
      };
    }
  }
);

// ============================================================================
// Server Startup
// ============================================================================

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 BACH FileCommander MCP Server gestartet");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
