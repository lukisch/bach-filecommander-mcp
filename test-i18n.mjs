#!/usr/bin/env node
/**
 * i18n Test for BACH FileCommander MCP Server
 * Tests: default language, setLanguage(), getLanguage(), t() translations, weekdays
 */

import { t, setLanguage, getLanguage } from './dist/i18n/index.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ ${testName}`);
    passed++;
  } else {
    console.log(`  ❌ ${testName}`);
    failed++;
  }
}

console.log('🧪 FileCommander i18n Tests\n');

// === Test 1: Default language ===
console.log('--- Default Language ---');
assert(getLanguage() === 'de', 'Default language is "de"');

// === Test 2: German translations ===
console.log('\n--- German Translations ---');
const deT = t();
assert(typeof deT.common.fileNotFound === 'function', 'common.fileNotFound is a function');
assert(deT.common.fileNotFound('/test').includes('Datei nicht gefunden'), 'common.fileNotFound returns German text');
assert(deT.common.error('test').includes('Fehler'), 'common.error returns German text');
assert(typeof deT.common.weekdays === 'object', 'common.weekdays is an array');
assert(deT.common.weekdays.length === 7, 'common.weekdays has 7 entries');
assert(deT.common.weekdays[0] === 'Sonntag', 'First weekday is "Sonntag"');
assert(deT.common.weekdays[1] === 'Montag', 'Second weekday is "Montag"');

// === Test 3: Switch to English ===
console.log('\n--- Switch to English ---');
setLanguage('en');
assert(getLanguage() === 'en', 'Language switched to "en"');

const enT = t();
assert(enT.common.fileNotFound('/test').includes('File not found'), 'common.fileNotFound returns English text');
assert(enT.common.error('test').includes('Error'), 'common.error returns English text');
assert(enT.common.weekdays[0] === 'Sunday', 'First weekday is "Sunday"');
assert(enT.common.weekdays[1] === 'Monday', 'Second weekday is "Monday"');

// === Test 4: Switch back to German ===
console.log('\n--- Switch back to German ---');
setLanguage('de');
assert(getLanguage() === 'de', 'Language switched back to "de"');
assert(t().common.weekdays[0] === 'Sonntag', 'After switch-back, German weekday returned');

// === Test 5: All tool sections exist ===
console.log('\n--- All Tool Sections Exist ---');
const sections = [
  'common', 'fc_read_file', 'fc_write_file', 'fc_list_directory', 'fc_create_directory',
  'fc_delete_file', 'fc_delete_directory', 'fc_move', 'fc_copy', 'fc_file_info',
  'fc_search_files', 'fc_start_search', 'fc_get_search_results', 'fc_stop_search',
  'fc_list_searches', 'fc_clear_search', 'fc_safe_delete', 'fc_execute_command',
  'fc_start_process', 'fc_get_time', 'fc_read_multiple_files', 'fc_edit_file',
  'fc_str_replace', 'fc_list_processes', 'fc_kill_process', 'fc_start_session',
  'fc_read_output', 'fc_send_input', 'fc_list_sessions', 'fc_close_session',
  'fc_fix_json', 'fc_validate_json', 'fc_cleanup_file', 'fc_fix_encoding',
  'fc_folder_diff', 'fc_batch_rename', 'fc_convert_format', 'fc_detect_duplicates',
  'fc_md_to_html', 'server'
];
for (const section of sections) {
  assert(t()[section] !== undefined, `Section "${section}" exists`);
}

// === Test 6: Template functions ===
console.log('\n--- Template Functions ---');
setLanguage('de');
assert(t().fc_read_file.fileHeader('test.txt', '1 KB').includes('test.txt'), 'fc_read_file.fileHeader includes filename');
assert(t().fc_write_file.success('geschrieben', '/test').includes('/test'), 'fc_write_file.success includes path');
assert(t().fc_search_files.found(42).includes('42'), 'fc_search_files.found includes count');
assert(t().fc_move.moved('/a', '/b').includes('/a'), 'fc_move.moved includes source');
assert(t().server.languageSet('en').includes('en'), 'server.languageSet includes lang');

setLanguage('en');
assert(t().fc_read_file.fileHeader('test.txt', '1 KB').includes('test.txt'), 'EN: fc_read_file.fileHeader includes filename');
assert(t().fc_search_files.found(42).includes('42'), 'EN: fc_search_files.found includes count');

// === Test 7: DE and EN return different strings ===
console.log('\n--- DE vs EN differ ---');
setLanguage('de');
const deErr = t().common.fileNotFound('/x');
const deWeekday = t().common.weekdays[0];
setLanguage('en');
const enErr = t().common.fileNotFound('/x');
const enWeekday = t().common.weekdays[0];
assert(deErr !== enErr, 'DE and EN error messages differ');
assert(deWeekday !== enWeekday, `DE weekday "${deWeekday}" != EN weekday "${enWeekday}"`);

// === Test 8: fc_get_time labels ===
console.log('\n--- fc_get_time labels ---');
setLanguage('de');
assert(t().fc_get_time.header.length > 0, 'DE: fc_get_time.header exists');
setLanguage('en');
assert(t().fc_get_time.header.length > 0, 'EN: fc_get_time.header exists');

// === Summary ===
console.log(`\n${'='.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
if (failed > 0) {
  console.log('❌ SOME TESTS FAILED');
  process.exit(1);
} else {
  console.log('✅ ALL TESTS PASSED');
  process.exit(0);
}
