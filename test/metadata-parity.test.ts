import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '..');

describe('Metadata, Registry Manifest and Discoverability Parity', () => {
  const pkgPath = resolve(ROOT, 'package.json');
  const serverPath = resolve(ROOT, 'server.json');
  const glamaPath = resolve(ROOT, 'glama.json');
  const llmsPath = resolve(ROOT, 'llms.txt');
  const srcIndexPath = resolve(ROOT, 'src/index.ts');
  const readmeEnPath = resolve(ROOT, 'README.md');
  const readmeDePath = resolve(ROOT, 'README_de.md');
  const changelogPath = resolve(ROOT, 'CHANGELOG.md');
  const securityPath = resolve(ROOT, 'SECURITY.md');

  it('all required manifests and discoverability files exist', () => {
    expect(existsSync(pkgPath)).toBe(true);
    expect(existsSync(serverPath)).toBe(true);
    expect(existsSync(glamaPath)).toBe(true);
    expect(existsSync(llmsPath)).toBe(true);
    expect(existsSync(srcIndexPath)).toBe(true);
    expect(existsSync(readmeEnPath)).toBe(true);
    expect(existsSync(readmeDePath)).toBe(true);
    expect(existsSync(changelogPath)).toBe(true);
    expect(existsSync(securityPath)).toBe(true);
  });

  it('maintains exact version parity across package.json, server.json, glama.json, and src/index.ts', () => {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const server = JSON.parse(readFileSync(serverPath, 'utf-8'));
    const glama = JSON.parse(readFileSync(glamaPath, 'utf-8'));
    const srcIndex = readFileSync(srcIndexPath, 'utf-8');

    expect(server.version).toBe(pkg.version);
    expect(glama.version).toBe(pkg.version);
    expect(server.packages[0].version).toBe(pkg.version);
    expect(srcIndex).toContain(`version: "${pkg.version}"`);
    expect(srcIndex).toContain(`* @version ${pkg.version}`);
  });

  it('manifests correctly reflect 47 tools and standard transport', () => {
    const glama = JSON.parse(readFileSync(glamaPath, 'utf-8'));
    const server = JSON.parse(readFileSync(serverPath, 'utf-8'));
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

    expect(glama.tools.count).toBe(47);
    expect(server.packages[0].transport.type).toBe('stdio');
    expect(pkg.description).toContain('47 tools');
  });

  it('package.json files array includes all essential artifacts and manifests', () => {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const files = pkg.files || [];

    expect(files).toContain('dist/');
    expect(files).toContain('README.md');
    expect(files).toContain('README_de.md');
    expect(files).toContain('CHANGELOG.md');
    expect(files).toContain('SECURITY.md');
    expect(files).toContain('server.json');
    expect(files).toContain('glama.json');
    expect(files).toContain('llms.txt');
  });

  it('llms.txt is synchronized with 2026-08-25 and accurate ecosystem tools', () => {
    const llms = readFileSync(llmsPath, 'utf-8');
    expect(llms).toContain('## Last-checked: 2026-08-25');
    expect(llms).toContain('47 tools');
    expect(llms).toContain('fc_search_content');
    expect(llms).toContain('safe-delete');
    expect(llms).toContain('SECURITY.md');
    expect(llms).toContain('CHANGELOG.md');
    expect(llms).toContain('ellmos-controlcenter-mcp');
    expect(llms).toContain('31 tools');
    expect(llms).toContain('n8n-manager-mcp');
    expect(llms).toContain('19 tools');
    expect(llms).toContain('open-compute-mcp');
    expect(llms).toContain('16 tools');
  });

  it('SECURITY.md contains bilingual policy, zero-egress guarantees, and contact endpoints', () => {
    const sec = readFileSync(securityPath, 'utf-8');
    expect(sec).toContain('Security Policy / Sicherheitsrichtlinie');
    expect(sec).toContain('English: Security Policy');
    expect(sec).toContain('Deutsch: Sicherheitsrichtlinie');
    expect(sec).toContain('Zero-Egress');
    expect(sec).toContain('Local-First');
    expect(sec).toContain('fc_set_safe_mode');
    expect(sec).toContain('fc_check_cloud_lock');
    expect(sec).toContain('security@ellmos.ai');
    expect(sec).toContain('support@lukasgeiger.com');
    expect(sec).toContain('1.10.x');
  });

  it('GitHub Actions CI workflow uses multi-OS matrix, v4 actions, and concurrency control', () => {
    const ciPath = resolve(ROOT, '.github/workflows/tests.yml');
    expect(existsSync(ciPath)).toBe(true);
    const ci = readFileSync(ciPath, 'utf-8');
    expect(ci).toContain('ubuntu-latest');
    expect(ci).toContain('windows-latest');
    expect(ci).toContain('macos-latest');
    expect(ci).toContain('actions/checkout@v4');
    expect(ci).toContain('actions/setup-node@v4');
    expect(ci).toContain('concurrency:');
    expect(ci).toContain('cancel-in-progress: true');
    expect(ci).toContain('npm test');
  });

  it('README files contain valid badges, quick navigation, and architecture diagrams', () => {
    const en = readFileSync(readmeEnPath, 'utf-8');
    const de = readFileSync(readmeDePath, 'utf-8');

    expect(en).toContain('ellmos-ai');
    expect(en).toContain('open-bricks');
    expect(en).toContain('mermaid');
    expect(en).toContain('47');
    expect(en).toContain('tests-253%20passed');
    expect(en).toContain('Quick Navigation:');
    expect(en).toContain('#core-capabilities--safety-invariants');
    expect(en).toContain('## Core Capabilities & Safety Invariants');

    expect(de).toContain('ellmos-ai');
    expect(de).toContain('open-bricks');
    expect(de).toContain('mermaid');
    expect(de).toContain('47');
    expect(de).toContain('tests-253%20passed');
    expect(de).toContain('Schnellnavigation:');
    expect(de).toContain('#kernfähigkeiten--sicherheitsinvarianten');
    expect(de).toContain('## Kernfähigkeiten & Sicherheitsinvarianten');

    // Sibling server tools counts
    expect(en).toContain('ControlCenter');
    expect(en).toContain('31');
    expect(en).toContain('n8n Manager');
    expect(en).toContain('19');

    expect(de).toContain('ControlCenter');
    expect(de).toContain('31');
    expect(de).toContain('n8n Manager');
    expect(de).toContain('19');
  });

  it('verifies bilingual core capabilities and safety invariants matrix parity', () => {
    const en = readFileSync(readmeEnPath, 'utf-8');
    const de = readFileSync(readmeDePath, 'utf-8');

    expect(en).toContain('100% Local-First & Zero-Egress');
    expect(en).toContain('Safe Deletion & Trash Protection');
    expect(en).toContain('Cloud-Lock Resilient Move');
    expect(en).toContain('Bounded Multi-File Content Search');
    expect(en).toContain('Automated Secret & Token Redaction');
    expect(en).toContain('Lossless Multi-Format Engine');
    expect(en).toContain('Mojibake & File Repair Engine');
    expect(en).toContain('Unprivileged Non-Elevation Execution');

    expect(de).toContain('100% Local-First & Zero-Egress');
    expect(de).toContain('Sicheres Löschen & Papierkorb-Schutz');
    expect(de).toContain('Cloud-Lock-robuste Verschiebung');
    expect(de).toContain('Begrenzte Mehrdatei-Inhaltssuche');
    expect(de).toContain('Automatische Geheimnis- & Token-Schwärzung');
    expect(de).toContain('Verlustfreie Multi-Format-Engine');
    expect(de).toContain('Mojibake- & Dateireparatur-Engine');
    expect(de).toContain('Unprivilegierter Non-Elevation-Betrieb');
  });
});
