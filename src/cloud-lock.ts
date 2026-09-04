import * as fs from "node:fs/promises";

export type CloudTargetKind = "missing" | "file" | "directory" | "reparse-point" | "other" | "unavailable";

export interface CloudTargetState {
  kind: CloudTargetKind;
  error?: string;
}

/**
 * Reads only target facts that Node can obtain without elevation.
 *
 * Cloud Files hydration flags and process handles intentionally remain outside
 * this helper: Node exposes neither reliably, and a destructive rename probe
 * would not be appropriate for a diagnostic tool.
 */
export async function inspectCloudTargetState(targetPath: string): Promise<CloudTargetState> {
  try {
    const stat = await fs.lstat(targetPath);
    if (stat.isSymbolicLink()) return { kind: "reparse-point" };
    if (stat.isFile()) return { kind: "file" };
    if (stat.isDirectory()) return { kind: "directory" };
    return { kind: "other" };
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
    if (code === "ENOENT") return { kind: "missing" };
    return { kind: "unavailable", error: error instanceof Error ? error.message : String(error) };
  }
}
