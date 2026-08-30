import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { getDefaultEnvironment, StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const ROOT = resolve(__dirname, "..");
const LANGUAGES = ["de", "en", "es", "zh", "ja", "ru"] as const;

let client: Client;

function textContent(result: Awaited<ReturnType<Client["callTool"]>>): string {
  if (!("content" in result)) {
    throw new Error("Expected a direct MCP tool result");
  }
  return result.content
    .filter((item): item is Extract<typeof item, { type: "text" }> => item.type === "text")
    .map((item) => item.text)
    .join("\n");
}

describe("language tools over real stdio MCP transport", () => {
  beforeAll(async () => {
    client = new Client({ name: "filecommander-language-contract", version: "1.0.0" });
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [resolve(ROOT, "dist/index.js")],
      cwd: ROOT,
      env: {
        ...getDefaultEnvironment(),
        FC_LANGUAGE: "de",
        NO_UPDATE_NOTIFIER: "1",
      },
      stderr: "pipe",
    });
    await client.connect(transport);
  }, 40_000);

  afterAll(async () => {
    await client?.close();
  });

  it("lists exactly 50 tools and the complete language/open-path/preview contracts", async () => {
    const listed = await client.listTools();
    expect(listed.tools).toHaveLength(50);

    const getLanguageTool = listed.tools.find((tool) => tool.name === "fc_get_language");
    expect(getLanguageTool).toBeDefined();
    expect(getLanguageTool?.inputSchema).toMatchObject({ type: "object" });
    expect(getLanguageTool?.annotations).toMatchObject({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });

    const openPathTool = listed.tools.find((tool) => tool.name === "fc_open_path");
    expect(openPathTool).toBeDefined();
    expect(openPathTool?.annotations).toMatchObject({
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    });
    expect(openPathTool?.outputSchema).toMatchObject({
      type: "object",
      required: expect.arrayContaining(["launcher_accepted", "user_visible", "fallback"]),
    });

    const previewTool = listed.tools.find((tool) => tool.name === "fc_preview_file");
    expect(previewTool).toBeDefined();
    expect(previewTool?.inputSchema).toMatchObject({
      type: "object",
      properties: {
        include_content: { type: "boolean", default: false },
      },
    });
    expect(previewTool?.outputSchema).toMatchObject({
      type: "object",
      required: expect.arrayContaining(["mime_type", "size_bytes", "content_included"]),
    });
    expect(previewTool?.annotations).toMatchObject({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
  });

  it("serves metadata first and content only after an explicit preview request", async () => {
    const target = resolve(ROOT, "README.md");
    const metadata = await client.callTool({
      name: "fc_preview_file",
      arguments: { path: target },
    });
    expect("structuredContent" in metadata && metadata.structuredContent).toMatchObject({
      path: target,
      mime_type: "text/markdown",
      content_requested: false,
      content_included: false,
      content_request: {
        tool: "fc_preview_file",
        arguments: { path: target, include_content: true },
      },
    });
    expect("content" in metadata && metadata.content.some((item) => item.type !== "text")).toBe(false);

    const inline = await client.callTool({
      name: "fc_preview_file",
      arguments: { path: target, include_content: true },
    });
    expect("structuredContent" in inline && inline.structuredContent).toMatchObject({
      content_requested: true,
      content_included: true,
      reason: "included",
    });
    expect("content" in inline && inline.content.some((item) => item.type === "text" && item.text.includes("FileCommander"))).toBe(true);
  });

  it("returns launcher_accepted=false without visibility claims when opening cannot start", async () => {
    const missing = resolve(ROOT, "test", "fixtures", "does-not-exist.png");
    const result = await client.callTool({
      name: "fc_open_path",
      arguments: { path: missing },
    });

    expect("isError" in result && result.isError).toBe(true);
    expect("structuredContent" in result && result.structuredContent).toMatchObject({
      launcher_accepted: false,
      user_visible: "unknown",
      error_code: "PATH_NOT_FOUND",
      fallback: null,
    });
  });

  it("reports the active language after every supported runtime switch", async () => {
    const initial = await client.callTool({ name: "fc_get_language", arguments: {} });
    expect(textContent(initial)).toContain("Aktuelle Sprache: de");

    for (const language of LANGUAGES) {
      await client.callTool({ name: "fc_set_language", arguments: { language } });
      const current = await client.callTool({ name: "fc_get_language", arguments: {} });
      expect(textContent(current)).toContain(language);
      expect(textContent(current)).toContain(LANGUAGES.join(", "));
    }
  });
});
