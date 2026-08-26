import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

const ROOT = resolve(__dirname, '..');
const sourceText = readFileSync(resolve(ROOT, 'src/index.ts'), 'utf-8');

type AnnotationMap = Record<string, boolean>;

function registeredToolAnnotations(): Map<string, AnnotationMap> {
  const sourceFile = ts.createSourceFile(
    'src/index.ts',
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const tools = new Map<string, AnnotationMap>();

  function visit(node: ts.Node): void {
    if (
      ts.isCallExpression(node)
      && ts.isPropertyAccessExpression(node.expression)
      && node.expression.expression.getText(sourceFile) === 'server'
      && node.expression.name.text === 'registerTool'
    ) {
      const nameNode = node.arguments[0];
      const configNode = node.arguments[1];
      if (!ts.isStringLiteral(nameNode) || !ts.isObjectLiteralExpression(configNode)) {
        throw new Error('Every registerTool call must use a literal name and configuration object');
      }
      const annotationsProperty = configNode.properties.find(
        (property) => property.name?.getText(sourceFile) === 'annotations',
      );
      if (!annotationsProperty || !ts.isPropertyAssignment(annotationsProperty)
        || !ts.isObjectLiteralExpression(annotationsProperty.initializer)) {
        throw new Error(`${nameNode.text} has no literal annotations object`);
      }

      const annotations: AnnotationMap = {};
      for (const property of annotationsProperty.initializer.properties) {
        if (!ts.isPropertyAssignment(property)) continue;
        const key = property.name.getText(sourceFile);
        if (property.initializer.kind === ts.SyntaxKind.TrueKeyword) annotations[key] = true;
        if (property.initializer.kind === ts.SyntaxKind.FalseKeyword) annotations[key] = false;
      }
      tools.set(nameNode.text, annotations);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return tools;
}

describe('MCP tool security contract', () => {
  it('registers all 47 tools with every standard boolean annotation', () => {
    const tools = registeredToolAnnotations();
    expect(tools.size).toBe(47);
    expect(sourceText).not.toMatch(/server\.tool\s*\(/);

    for (const [name, annotations] of tools) {
      expect(annotations, `${name} annotations`).toMatchObject({
        readOnlyHint: expect.any(Boolean),
        destructiveHint: expect.any(Boolean),
        idempotentHint: expect.any(Boolean),
        openWorldHint: expect.any(Boolean),
      });
    }
  });

  it('uses conservative annotations for command, session, OCR, and network boundaries', () => {
    const tools = registeredToolAnnotations();
    expect(tools.get('fc_execute_command')).toMatchObject({ destructiveHint: true, openWorldHint: true });
    expect(tools.get('fc_start_session')).toMatchObject({ destructiveHint: true, openWorldHint: true });
    expect(tools.get('fc_ocr')).toMatchObject({ readOnlyHint: false, destructiveHint: true });
    expect(tools.get('fc_web_fetch')).toMatchObject({ readOnlyHint: true, openWorldHint: true });
  });

  it('loads optional OCR without runtime code generation', () => {
    expect(sourceText).not.toMatch(/\bFunction\s*\(/);
    expect(sourceText).toContain('nodeRequire("tesseract.js")');
  });

  it('documents explicit egress and the exact safe-mode boundary bilingually', () => {
    const readmeEn = readFileSync(resolve(ROOT, 'README.md'), 'utf-8');
    const readmeDe = readFileSync(resolve(ROOT, 'README_de.md'), 'utf-8');
    const security = readFileSync(resolve(ROOT, 'SECURITY.md'), 'utf-8');

    for (const document of [readmeEn, readmeDe, security]) {
      expect(document).toContain('fc_web_fetch');
      expect(document).toContain('fc_start_session');
      expect(document).toContain('fc_execute_command');
    }
    expect(readmeEn).toContain('no automatic network egress');
    expect(readmeEn).toContain('does not sandbox commands or interactive sessions');
    expect(readmeDe).toContain('ohne automatischen Netzwerk-Egress');
    expect(readmeDe).toContain('schränkt Befehle oder interaktive Sitzungen nicht ein');
    expect(security).toContain('Explicit outbound access');
    expect(security).toContain('Expliziter ausgehender Zugriff');
  });
});
