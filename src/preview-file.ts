import { open, realpath, stat } from "node:fs/promises";
import { extname } from "node:path";
import { pathToFileURL } from "node:url";

export const MAX_INLINE_PREVIEW_BYTES = 1024 * 1024;

export type PreviewKind = "text" | "image" | "resource" | "unsupported";
export type PreviewReason =
  | "metadata_only"
  | "included"
  | "file_too_large"
  | "unsupported_media_type";

export type PreviewReadFile = (path: string) => Promise<Buffer>;

export interface PreviewContentRequest {
  tool: "fc_preview_file";
  arguments: {
    path: string;
    include_content: true;
  };
}

export interface PreviewStructuredContent {
  [key: string]: unknown;
  path: string;
  uri: string;
  mime_type: string;
  size_bytes: number;
  preview_kind: PreviewKind;
  content_requested: boolean;
  content_included: boolean;
  max_inline_bytes: number;
  reason: PreviewReason;
  content_request: PreviewContentRequest | null;
}

export type PreviewContentBlock =
  | {
    type: "text";
    text: string;
    annotations: { audience: Array<"user" | "assistant">; priority: number };
  }
  | {
    type: "image";
    data: string;
    mimeType: string;
    annotations: { audience: Array<"user" | "assistant">; priority: number };
  }
  | {
    type: "resource";
    resource: {
      uri: string;
      mimeType: string;
      blob: string;
    };
    annotations: { audience: Array<"user" | "assistant">; priority: number };
  };

export interface PreviewFileResult {
  structuredContent: PreviewStructuredContent;
  contentBlock?: PreviewContentBlock;
}

export interface PreviewFileOptions {
  includeContent?: boolean;
  readFile?: PreviewReadFile;
}

async function readAtMostInlineLimit(targetPath: string): Promise<Buffer> {
  const handle = await open(targetPath, "r");
  try {
    const buffer = Buffer.alloc(MAX_INLINE_PREVIEW_BYTES + 1);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

export type PreviewFileErrorCode = "PATH_NOT_FOUND" | "NOT_A_FILE" | "READ_FAILED";

export class PreviewFileError extends Error {
  constructor(
    public readonly code: PreviewFileErrorCode,
    message: string,
    public readonly targetPath: string,
  ) {
    super(message);
    this.name = "PreviewFileError";
  }
}

const MIME_TYPES: Readonly<Record<string, string>> = {
  ".bmp": "image/bmp",
  ".css": "text/css",
  ".csv": "text/csv",
  ".gif": "image/gif",
  ".htm": "text/html",
  ".html": "text/html",
  ".ini": "text/plain",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".log": "text/plain",
  ".md": "text/markdown",
  ".mjs": "text/javascript",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".py": "text/x-python",
  ".toml": "application/toml",
  ".ts": "text/typescript",
  ".txt": "text/plain",
  ".webp": "image/webp",
  ".xml": "application/xml",
  ".yaml": "application/yaml",
  ".yml": "application/yaml",
  ".exe": "application/vnd.microsoft.portable-executable",
};

function detectMimeType(targetPath: string): string {
  return MIME_TYPES[extname(targetPath).toLowerCase()] ?? "application/octet-stream";
}

function previewKindFor(mimeType: string): PreviewKind {
  if (mimeType.startsWith("text/") || [
    "application/json",
    "application/toml",
    "application/xml",
    "application/yaml",
  ].includes(mimeType)) return "text";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "resource";
  return "unsupported";
}

function contentRequest(path: string): PreviewContentRequest {
  return {
    tool: "fc_preview_file",
    arguments: { path, include_content: true },
  };
}

export async function previewFile(
  targetPath: string,
  options: PreviewFileOptions = {},
): Promise<PreviewFileResult> {
  let resolvedPath: string;
  let targetStats: Awaited<ReturnType<typeof stat>>;

  try {
    resolvedPath = await realpath(targetPath);
    targetStats = await stat(resolvedPath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new PreviewFileError("PATH_NOT_FOUND", `File cannot be resolved: ${targetPath} (${message})`, targetPath);
  }

  if (!targetStats.isFile()) {
    throw new PreviewFileError("NOT_A_FILE", `Target is not a regular file: ${resolvedPath}`, resolvedPath);
  }

  const includeContent = options.includeContent ?? false;
  const mimeType = detectMimeType(resolvedPath);
  const previewKind = previewKindFor(mimeType);
  const uri = pathToFileURL(resolvedPath).href;
  const sizeBytes = targetStats.size;
  const eligible = previewKind !== "unsupported" && sizeBytes <= MAX_INLINE_PREVIEW_BYTES;
  const structuredContent: PreviewStructuredContent = {
    path: resolvedPath,
    uri,
    mime_type: mimeType,
    size_bytes: sizeBytes,
    preview_kind: previewKind,
    content_requested: includeContent,
    content_included: false,
    max_inline_bytes: MAX_INLINE_PREVIEW_BYTES,
    reason: previewKind === "unsupported"
      ? "unsupported_media_type"
      : sizeBytes > MAX_INLINE_PREVIEW_BYTES
        ? "file_too_large"
        : "metadata_only",
    content_request: !includeContent && eligible ? contentRequest(resolvedPath) : null,
  };

  if (!includeContent || !eligible) return { structuredContent };

  let bytes: Buffer;
  try {
    bytes = await (options.readFile ?? readAtMostInlineLimit)(resolvedPath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new PreviewFileError("READ_FAILED", `File cannot be read: ${resolvedPath} (${message})`, resolvedPath);
  }

  if (bytes.length > MAX_INLINE_PREVIEW_BYTES) {
    structuredContent.content_included = false;
    structuredContent.reason = "file_too_large";
    structuredContent.content_request = null;
    return { structuredContent };
  }

  structuredContent.content_included = true;
  structuredContent.reason = "included";
  structuredContent.content_request = null;
  const annotations = { audience: ["user", "assistant"] as Array<"user" | "assistant">, priority: 1 };

  if (previewKind === "text") {
    return {
      structuredContent,
      contentBlock: { type: "text", text: bytes.toString("utf-8"), annotations },
    };
  }
  if (previewKind === "image") {
    return {
      structuredContent,
      contentBlock: { type: "image", data: bytes.toString("base64"), mimeType, annotations },
    };
  }
  return {
    structuredContent,
    contentBlock: {
      type: "resource",
      resource: { uri, mimeType, blob: bytes.toString("base64") },
      annotations,
    },
  };
}
