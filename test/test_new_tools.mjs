/**
 * Test-Script fuer die neuen Tools des bach-filecommander-mcp Servers
 *
 * Testet: fc_convert_format, fc_ocr, fc_archive, fc_checksum, fc_set_safe_mode
 * Kommunikation: JSON-RPC ueber stdin/stdout (zeilenbasiertes Framing)
 */

import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES = path.join(__dirname, 'fixtures');
const SERVER_PATH = path.join(__dirname, '..', 'dist', 'index.js');

// ===========================================================================
// Test Framework
// ===========================================================================

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    failures.push(message);
    console.log(`  FAIL: ${message}`);
  }
}

function assertIncludes(text, substr, message) {
  if (typeof text === 'string' && text.includes(substr)) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    failures.push(`${message} (expected "${substr}" in response)`);
    console.log(`  FAIL: ${message} (expected "${substr}" in: "${String(text).substring(0, 200)}...")`);
  }
}

/** Check if text includes ANY of the given substrings (for multi-language support) */
function assertIncludesAny(text, substrs, message) {
  const textStr = String(text);
  const found = substrs.some(s => textStr.includes(s));
  if (found) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    failures.push(`${message} (expected one of [${substrs.join(', ')}] in response)`);
    console.log(`  FAIL: ${message} (expected one of [${substrs.join(', ')}] in: "${textStr.substring(0, 200)}...")`);
  }
}

// ===========================================================================
// MCP Client
// ===========================================================================

class McpTestClient {
  constructor() {
    this.process = null;
    this.buffer = '';
    this.pendingRequests = new Map();
    this.nextId = 1;
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.process = spawn('node', [SERVER_PATH], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
      });

      this.process.stdout.on('data', (chunk) => {
        this.buffer += chunk.toString();
        this._processBuffer();
      });

      this.process.stderr.on('data', (chunk) => {
        // Server debug output -- ignorieren
      });

      this.process.on('error', (err) => {
        reject(err);
      });

      // Initialize the MCP connection
      setTimeout(async () => {
        try {
          const initResult = await this.call('initialize', {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'test-runner', version: '1.0.0' }
          });
          // Send initialized notification (no id = notification)
          this._send({ jsonrpc: '2.0', method: 'notifications/initialized' });
          resolve(initResult);
        } catch (err) {
          reject(err);
        }
      }, 500);
    });
  }

  _processBuffer() {
    const lines = this.buffer.split('\n');
    // Keep the incomplete last line in the buffer
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const msg = JSON.parse(trimmed);
        if (msg.id !== undefined && this.pendingRequests.has(msg.id)) {
          const { resolve, reject } = this.pendingRequests.get(msg.id);
          this.pendingRequests.delete(msg.id);
          if (msg.error) {
            reject(new Error(`RPC Error ${msg.error.code}: ${msg.error.message}`));
          } else {
            resolve(msg.result);
          }
        }
      } catch {
        // Not valid JSON, ignore
      }
    }
  }

  _send(msg) {
    const json = JSON.stringify(msg) + '\n';
    this.process.stdin.write(json);
  }

  call(method, params, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      const timer = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Timeout waiting for response to ${method} (id=${id})`));
      }, timeoutMs);

      this.pendingRequests.set(id, {
        resolve: (result) => { clearTimeout(timer); resolve(result); },
        reject: (err) => { clearTimeout(timer); reject(err); }
      });

      this._send({ jsonrpc: '2.0', id, method, params });
    });
  }

  async callTool(name, args) {
    const result = await this.call('tools/call', { name, arguments: args });
    return result;
  }

  async stop() {
    if (this.process) {
      this.process.stdin.end();
      this.process.kill();
      this.process = null;
    }
  }
}

// ===========================================================================
// Helper: Response-Text extrahieren
// ===========================================================================

function getText(result) {
  if (result && result.content && result.content.length > 0) {
    return result.content.map(c => c.text || '').join('\n');
  }
  return JSON.stringify(result);
}

// ===========================================================================
// Tests
// ===========================================================================

async function runTests() {
  console.log('=== BACH FileCommander MCP - New Tools Test Suite ===\n');

  const client = new McpTestClient();

  try {
    console.log('Starting MCP server...');
    await client.start();
    console.log('Server initialized.\n');

    // ------------------------------------------------------------------
    // Test 1: JSON -> YAML
    // ------------------------------------------------------------------
    console.log('--- Test 1: fc_convert_format JSON -> YAML ---');
    const yamlOut = path.join(FIXTURES, 'test_output.yaml');
    try {
      const r1 = await client.callTool('fc_convert_format', {
        input_path: path.join(FIXTURES, 'test.json'),
        output_path: yamlOut,
        input_format: 'json',
        output_format: 'yaml'
      });
      const t1 = getText(r1);
      assertIncludes(t1, 'JSON', 'Conversion response mentions JSON');
      assertIncludes(t1, 'YAML', 'Conversion response mentions YAML');
      assert(!r1.isError, 'No error flag');

      // Verify YAML content
      const yamlContent = await fs.readFile(yamlOut, 'utf-8');
      assertIncludes(yamlContent, 'name: test', 'YAML contains name field');
      assertIncludes(yamlContent, 'version: 1', 'YAML contains version field');
      assertIncludes(yamlContent, 'key: value', 'YAML contains nested key');
      console.log('  YAML output:\n' + yamlContent.split('\n').map(l => '    ' + l).join('\n'));
    } catch (err) {
      failed++;
      failures.push(`Test 1 error: ${err.message}`);
      console.log(`  FAIL: Test 1 error: ${err.message}`);
    }

    // ------------------------------------------------------------------
    // Test 2: JSON -> TOML
    // ------------------------------------------------------------------
    console.log('\n--- Test 2: fc_convert_format JSON -> TOML ---');
    const tomlOut = path.join(FIXTURES, 'test_output.toml');
    try {
      const r2 = await client.callTool('fc_convert_format', {
        input_path: path.join(FIXTURES, 'test.json'),
        output_path: tomlOut,
        input_format: 'json',
        output_format: 'toml'
      });
      const t2 = getText(r2);
      assertIncludes(t2, 'TOML', 'Conversion response mentions TOML');
      assert(!r2.isError, 'No error flag');

      const tomlContent = await fs.readFile(tomlOut, 'utf-8');
      assertIncludes(tomlContent, 'name', 'TOML contains name');
      assertIncludes(tomlContent, 'test', 'TOML contains value "test"');
      console.log('  TOML output:\n' + tomlContent.split('\n').map(l => '    ' + l).join('\n'));
    } catch (err) {
      failed++;
      failures.push(`Test 2 error: ${err.message}`);
      console.log(`  FAIL: Test 2 error: ${err.message}`);
    }

    // ------------------------------------------------------------------
    // Test 3: JSON -> XML
    // ------------------------------------------------------------------
    console.log('\n--- Test 3: fc_convert_format JSON -> XML ---');
    const xmlOut = path.join(FIXTURES, 'test_output.xml');
    try {
      const r3 = await client.callTool('fc_convert_format', {
        input_path: path.join(FIXTURES, 'test.json'),
        output_path: xmlOut,
        input_format: 'json',
        output_format: 'xml'
      });
      const t3 = getText(r3);
      assertIncludes(t3, 'XML', 'Conversion response mentions XML');
      assert(!r3.isError, 'No error flag');

      const xmlContent = await fs.readFile(xmlOut, 'utf-8');
      assertIncludes(xmlContent, '<name>', 'XML contains <name> tag');
      assertIncludes(xmlContent, 'test', 'XML contains value "test"');
      console.log('  XML output:\n' + xmlContent.split('\n').map(l => '    ' + l).join('\n'));
    } catch (err) {
      failed++;
      failures.push(`Test 3 error: ${err.message}`);
      console.log(`  FAIL: Test 3 error: ${err.message}`);
    }

    // ------------------------------------------------------------------
    // Test 4: JSON -> TOON -> JSON Roundtrip
    // ------------------------------------------------------------------
    console.log('\n--- Test 4: fc_convert_format JSON -> TOON -> JSON Roundtrip ---');
    const toonOut = path.join(FIXTURES, 'test_output.toon');
    const jsonRoundtrip = path.join(FIXTURES, 'test_roundtrip.json');
    try {
      // JSON -> TOON
      const r4a = await client.callTool('fc_convert_format', {
        input_path: path.join(FIXTURES, 'test.json'),
        output_path: toonOut,
        input_format: 'json',
        output_format: 'toon'
      });
      assert(!r4a.isError, 'JSON -> TOON: No error');

      const toonContent = await fs.readFile(toonOut, 'utf-8');
      console.log('  TOON output:\n' + toonContent.split('\n').map(l => '    ' + l).join('\n'));
      assertIncludes(toonContent, 'name = test', 'TOON contains name = test');

      // TOON -> JSON
      const r4b = await client.callTool('fc_convert_format', {
        input_path: toonOut,
        output_path: jsonRoundtrip,
        input_format: 'toon',
        output_format: 'json'
      });
      assert(!r4b.isError, 'TOON -> JSON: No error');

      const roundtripContent = await fs.readFile(jsonRoundtrip, 'utf-8');
      const roundtripData = JSON.parse(roundtripContent);
      console.log('  Roundtrip JSON:\n    ' + JSON.stringify(roundtripData, null, 2).split('\n').map(l => '    ' + l).join('\n'));

      assert(roundtripData.name === 'test', 'Roundtrip: name preserved');
      assert(roundtripData.version === 1, 'Roundtrip: version preserved (as number)');
      assert(roundtripData.nested && roundtripData.nested.key === 'value', 'Roundtrip: nested.key preserved');
      // TOON uses key[] notation for arrays, check if tags survived
      assert(Array.isArray(roundtripData.tags), 'Roundtrip: tags is still an array');
      if (Array.isArray(roundtripData.tags)) {
        assert(roundtripData.tags[0] === 'a' && roundtripData.tags[1] === 'b', 'Roundtrip: tag values preserved');
      }
    } catch (err) {
      failed++;
      failures.push(`Test 4 error: ${err.message}`);
      console.log(`  FAIL: Test 4 error: ${err.message}`);
    }

    // ------------------------------------------------------------------
    // Test 5: OCR ohne tesseract.js
    // ------------------------------------------------------------------
    console.log('\n--- Test 5: fc_ocr ohne tesseract.js ---');
    try {
      // Create a dummy image file for the test
      const dummyImg = path.join(FIXTURES, 'dummy.png');
      await fs.writeFile(dummyImg, 'not a real image');

      const r5 = await client.callTool('fc_ocr', {
        file_path: dummyImg,
        language: 'eng'
      });
      const t5 = getText(r5);
      assertIncludes(t5, 'tesseract.js', 'OCR returns tesseract.js not installed message');
      assertIncludes(t5, 'npm install', 'OCR suggests installation');
      assert(!r5.isError, 'OCR "not installed" is not an error (graceful handling)');
    } catch (err) {
      failed++;
      failures.push(`Test 5 error: ${err.message}`);
      console.log(`  FAIL: Test 5 error: ${err.message}`);
    }

    // ------------------------------------------------------------------
    // Test 6: Archive - Create + List + Extract
    // ------------------------------------------------------------------
    console.log('\n--- Test 6: fc_archive - Create + List + Extract ---');
    const archiveFile1 = path.join(FIXTURES, 'archive_test_1.txt');
    const archiveFile2 = path.join(FIXTURES, 'archive_test_2.txt');
    const archivePath = path.join(FIXTURES, 'test_archive.zip');
    const extractDir = path.join(FIXTURES, 'extracted');
    try {
      // Create test files
      await fs.writeFile(archiveFile1, 'Content of file 1 for archive test.');
      await fs.writeFile(archiveFile2, 'Content of file 2 for archive test.');

      // Create ZIP
      const r6a = await client.callTool('fc_archive', {
        action: 'create',
        archive_path: archivePath,
        source_paths: [archiveFile1, archiveFile2]
      });
      const t6a = getText(r6a);
      assertIncludes(t6a, 'ZIP', 'Archive create response mentions ZIP');
      assert(!r6a.isError, 'Archive create: No error');
      // Check ZIP file exists
      assert(fsSync.existsSync(archivePath), 'ZIP file was created on disk');

      // List ZIP
      const r6b = await client.callTool('fc_archive', {
        action: 'list',
        archive_path: archivePath
      });
      const t6b = getText(r6b);
      assertIncludes(t6b, 'archive_test_1.txt', 'Archive list contains file 1');
      assertIncludes(t6b, 'archive_test_2.txt', 'Archive list contains file 2');
      assert(!r6b.isError, 'Archive list: No error');
      console.log('  Archive listing:\n' + t6b.split('\n').map(l => '    ' + l).join('\n'));

      // Extract ZIP
      const r6c = await client.callTool('fc_archive', {
        action: 'extract',
        archive_path: archivePath,
        extract_to: extractDir
      });
      const t6c = getText(r6c);
      assertIncludesAny(t6c, ['Extracted', 'Entpackt'], 'Archive extract response confirms extraction');
      assert(!r6c.isError, 'Archive extract: No error');

      // Check extracted files
      const ext1 = path.join(extractDir, 'archive_test_1.txt');
      const ext2 = path.join(extractDir, 'archive_test_2.txt');
      assert(fsSync.existsSync(ext1), 'Extracted file 1 exists');
      assert(fsSync.existsSync(ext2), 'Extracted file 2 exists');
      if (fsSync.existsSync(ext1)) {
        const content1 = await fs.readFile(ext1, 'utf-8');
        assert(content1 === 'Content of file 1 for archive test.', 'Extracted file 1 content matches');
      }
    } catch (err) {
      failed++;
      failures.push(`Test 6 error: ${err.message}`);
      console.log(`  FAIL: Test 6 error: ${err.message}`);
    }

    // ------------------------------------------------------------------
    // Test 7: Checksum - SHA256
    // ------------------------------------------------------------------
    console.log('\n--- Test 7: fc_checksum - SHA256 ---');
    const checksumFile = path.join(FIXTURES, 'checksum_test.txt');
    const checksumContent = 'Hello, BACH FileCommander!';
    try {
      await fs.writeFile(checksumFile, checksumContent);

      // Compute expected hash locally
      const expectedHash = createHash('sha256').update(Buffer.from(checksumContent)).digest('hex');
      console.log(`  Expected SHA256: ${expectedHash}`);

      const r7 = await client.callTool('fc_checksum', {
        file_path: checksumFile,
        algorithm: 'sha256'
      });
      const t7 = getText(r7);
      assertIncludes(t7, expectedHash, 'Checksum matches expected SHA256');
      assertIncludes(t7, 'SHA256', 'Response mentions SHA256 algorithm');
      assert(!r7.isError, 'Checksum: No error');
      console.log('  Response:\n' + t7.split('\n').map(l => '    ' + l).join('\n'));
    } catch (err) {
      failed++;
      failures.push(`Test 7 error: ${err.message}`);
      console.log(`  FAIL: Test 7 error: ${err.message}`);
    }

    // ------------------------------------------------------------------
    // Test 8: Checksum - Compare Match
    // ------------------------------------------------------------------
    console.log('\n--- Test 8: fc_checksum - Compare Match ---');
    try {
      const expectedHash = createHash('sha256').update(Buffer.from(checksumContent)).digest('hex');
      const r8 = await client.callTool('fc_checksum', {
        file_path: checksumFile,
        algorithm: 'sha256',
        compare: expectedHash
      });
      const t8 = getText(r8);
      assertIncludesAny(t8, ['match', 'stimmen'], 'Compare with correct hash reports match');
      assert(!r8.isError, 'Checksum compare match: No error');
    } catch (err) {
      failed++;
      failures.push(`Test 8 error: ${err.message}`);
      console.log(`  FAIL: Test 8 error: ${err.message}`);
    }

    // ------------------------------------------------------------------
    // Test 9: Checksum - Compare Mismatch
    // ------------------------------------------------------------------
    console.log('\n--- Test 9: fc_checksum - Compare Mismatch ---');
    try {
      const r9 = await client.callTool('fc_checksum', {
        file_path: checksumFile,
        algorithm: 'sha256',
        compare: 'deadbeef1234567890abcdef1234567890abcdef1234567890abcdef12345678'
      });
      const t9 = getText(r9);
      assertIncludesAny(t9, ['NOT match', 'NICHT'], 'Compare with wrong hash reports mismatch');
      assert(!r9.isError, 'Checksum compare mismatch: No error');
    } catch (err) {
      failed++;
      failures.push(`Test 9 error: ${err.message}`);
      console.log(`  FAIL: Test 9 error: ${err.message}`);
    }

    // ------------------------------------------------------------------
    // Test 10: Safe Mode Toggle
    // ------------------------------------------------------------------
    console.log('\n--- Test 10: fc_set_safe_mode ---');
    try {
      const r10a = await client.callTool('fc_set_safe_mode', {
        enabled: true
      });
      const t10a = getText(r10a);
      assertIncludes(t10a, 'Safe Mode', 'Enable safe mode mentions Safe Mode');
      assertIncludesAny(t10a, ['enabled', 'aktiviert'], 'Enable safe mode says enabled/aktiviert');
      assert(!r10a.isError, 'Enable safe mode: No error');

      const r10b = await client.callTool('fc_set_safe_mode', {
        enabled: false
      });
      const t10b = getText(r10b);
      assertIncludes(t10b, 'Safe Mode', 'Disable safe mode mentions Safe Mode');
      assertIncludesAny(t10b, ['disabled', 'deaktiviert'], 'Disable safe mode says disabled/deaktiviert');
      assert(!r10b.isError, 'Disable safe mode: No error');
    } catch (err) {
      failed++;
      failures.push(`Test 10 error: ${err.message}`);
      console.log(`  FAIL: Test 10 error: ${err.message}`);
    }

  } catch (err) {
    console.error(`\nFATAL: Server startup failed: ${err.message}`);
    failed++;
    failures.push(`Server startup: ${err.message}`);
  } finally {
    await client.stop();
  }

  // ===========================================================================
  // Cleanup
  // ===========================================================================
  console.log('\n--- Cleanup ---');
  const cleanupFiles = [
    path.join(FIXTURES, 'test_output.yaml'),
    path.join(FIXTURES, 'test_output.toml'),
    path.join(FIXTURES, 'test_output.xml'),
    path.join(FIXTURES, 'test_output.toon'),
    path.join(FIXTURES, 'test_roundtrip.json'),
    path.join(FIXTURES, 'dummy.png'),
    path.join(FIXTURES, 'archive_test_1.txt'),
    path.join(FIXTURES, 'archive_test_2.txt'),
    path.join(FIXTURES, 'test_archive.zip'),
    path.join(FIXTURES, 'checksum_test.txt'),
  ];
  for (const f of cleanupFiles) {
    try { await fs.unlink(f); } catch { /* ok */ }
  }
  // Remove extracted directory
  try { await fs.rm(path.join(FIXTURES, 'extracted'), { recursive: true, force: true }); } catch { /* ok */ }
  console.log('  Temporary files cleaned up.');

  // ===========================================================================
  // Summary
  // ===========================================================================
  console.log('\n' + '='.repeat(60));
  console.log(`RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log('='.repeat(60));
  if (failures.length > 0) {
    console.log('\nFailed tests:');
    for (const f of failures) {
      console.log(`  - ${f}`);
    }
  }
  console.log('');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
