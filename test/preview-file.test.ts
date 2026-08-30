import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  MAX_INLINE_PREVIEW_BYTES,
  previewFile,
  type PreviewReadFile,
} from "../src/preview-file.js";

describe("previewFile remote/headless fallback", () => {
  let tempDirectory: string;

  beforeEach(async () => {
    tempDirectory = await mkdtemp(join(tmpdir(), "filecommander-preview-file-"));
  });

  afterEach(async () => {
    await rm(tempDirectory, { recursive: true, force: true });
  });

  it("returns metadata first and an explicit content request without reading the file", async () => {
    const file = join(tempDirectory, "Notiz äöü.txt");
    await writeFile(file, "Remote sichtbar", "utf-8");
    const readFile = vi.fn<PreviewReadFile>();

    const result = await previewFile(file, { readFile });

    expect(readFile).not.toHaveBeenCalled();
    expect(result.structuredContent).toMatchObject({
      mime_type: "text/plain",
      preview_kind: "text",
      content_requested: false,
      content_included: false,
      max_inline_bytes: MAX_INLINE_PREVIEW_BYTES,
      reason: "metadata_only",
      content_request: {
        tool: "fc_preview_file",
        arguments: { path: result.structuredContent.path, include_content: true },
      },
    });
    expect(result.contentBlock).toBeUndefined();
  });

  it("returns explicitly requested text through a standard MCP text content block", async () => {
    const file = join(tempDirectory, "remote.md");
    await writeFile(file, "# Inline fallback", "utf-8");

    const result = await previewFile(file, { includeContent: true });

    expect(result.structuredContent).toMatchObject({
      mime_type: "text/markdown",
      preview_kind: "text",
      content_requested: true,
      content_included: true,
      reason: "included",
      content_request: null,
    });
    expect(result.contentBlock).toEqual({
      type: "text",
      text: "# Inline fallback",
      annotations: { audience: ["user", "assistant"], priority: 1 },
    });
  });

  it("returns explicitly requested images through a standard MCP image content block", async () => {
    const file = join(tempDirectory, "remote.png");
    const bytes = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
    await writeFile(file, bytes);

    const result = await previewFile(file, { includeContent: true });

    expect(result.structuredContent).toMatchObject({
      mime_type: "image/png",
      preview_kind: "image",
      content_included: true,
    });
    expect(result.contentBlock).toEqual({
      type: "image",
      data: bytes.toString("base64"),
      mimeType: "image/png",
      annotations: { audience: ["user", "assistant"], priority: 1 },
    });
  });

  it("returns explicitly requested PDFs as a bounded standard embedded resource", async () => {
    const file = join(tempDirectory, "remote.pdf");
    const bytes = Buffer.from("%PDF-1.7 fixture", "utf-8");
    await writeFile(file, bytes);

    const result = await previewFile(file, { includeContent: true });

    expect(result.structuredContent).toMatchObject({
      mime_type: "application/pdf",
      preview_kind: "resource",
      content_included: true,
    });
    expect(result.contentBlock).toMatchObject({
      type: "resource",
      resource: {
        uri: result.structuredContent.uri,
        mimeType: "application/pdf",
        blob: bytes.toString("base64"),
      },
    });
  });

  it("never reads or base64-encodes a file above the fixed inline limit", async () => {
    const file = join(tempDirectory, "zu-gross.png");
    await writeFile(file, Buffer.alloc(MAX_INLINE_PREVIEW_BYTES + 1, 0x41));
    const readFile = vi.fn<PreviewReadFile>();

    const result = await previewFile(file, { includeContent: true, readFile });

    expect(readFile).not.toHaveBeenCalled();
    expect(result.structuredContent).toMatchObject({
      preview_kind: "image",
      content_requested: true,
      content_included: false,
      reason: "file_too_large",
      content_request: null,
    });
    expect(result.contentBlock).toBeUndefined();
  });

  it("rechecks bytes after reading so a growing file never reaches Base64", async () => {
    const file = join(tempDirectory, "waechst.png");
    await writeFile(file, Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    const readFile = vi.fn<PreviewReadFile>().mockResolvedValue(
      Buffer.alloc(MAX_INLINE_PREVIEW_BYTES + 1, 0x41),
    );

    const result = await previewFile(file, { includeContent: true, readFile });

    expect(readFile).toHaveBeenCalledOnce();
    expect(result.structuredContent).toMatchObject({
      content_requested: true,
      content_included: false,
      reason: "file_too_large",
    });
    expect(result.contentBlock).toBeUndefined();
  });

  it("keeps non-displayable file types metadata-only even after a content request", async () => {
    const file = join(tempDirectory, "programm.exe");
    await writeFile(file, Buffer.from("MZ fixture", "utf-8"));
    const readFile = vi.fn<PreviewReadFile>();

    const result = await previewFile(file, { includeContent: true, readFile });

    expect(readFile).not.toHaveBeenCalled();
    expect(result.structuredContent).toMatchObject({
      mime_type: "application/vnd.microsoft.portable-executable",
      preview_kind: "unsupported",
      content_requested: true,
      content_included: false,
      reason: "unsupported_media_type",
      content_request: null,
    });
    expect(result.contentBlock).toBeUndefined();
  });
});
