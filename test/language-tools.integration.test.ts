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
  }, 20_000);

  afterAll(async () => {
    await client?.close();
  });

  it("lists exactly 48 tools and the complete read-only fc_get_language contract", async () => {
    const listed = await client.listTools();
    expect(listed.tools).toHaveLength(48);

    const getLanguageTool = listed.tools.find((tool) => tool.name === "fc_get_language");
    expect(getLanguageTool).toBeDefined();
    expect(getLanguageTool?.inputSchema).toMatchObject({ type: "object" });
    expect(getLanguageTool?.annotations).toMatchObject({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
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
