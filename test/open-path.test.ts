import { EventEmitter } from "node:events";
import { mkdtemp, mkdir, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  OpenPathError,
  openPath,
  type OpenPathSpawn,
  type OpenPathSpawnOptions,
  type OpenPathSpawnedProcess,
} from "../src/open-path.js";

interface SpawnCall {
  command: string;
  args: readonly string[];
  options: OpenPathSpawnOptions;
}

function recordingSpawn(outcome: "spawn" | Error = "spawn") {
  const calls: SpawnCall[] = [];
  const children: Array<EventEmitter & { unref: ReturnType<typeof vi.fn> }> = [];

  const spawn: OpenPathSpawn = (command, args, options) => {
    const child = new EventEmitter() as EventEmitter & { unref: ReturnType<typeof vi.fn> };
    child.unref = vi.fn();
    calls.push({ command, args, options });
    children.push(child);
    queueMicrotask(() => {
      if (outcome === "spawn") child.emit("spawn");
      else child.emit("error", outcome);
    });
    return child as OpenPathSpawnedProcess;
  };

  return { calls, children, spawn };
}

describe("openPath", () => {
  let tempDirectory: string;

  beforeEach(async () => {
    tempDirectory = await mkdtemp(join(tmpdir(), "filecommander-open-path-"));
  });

  afterEach(async () => {
    await rm(tempDirectory, { recursive: true, force: true });
  });

  it("opens a Windows file with spaces, OneDrive-style segments, and real umlauts without a shell", async () => {
    const directory = join(tempDirectory, "OneDrive - Team", "Prüfungen äöü");
    const file = join(directory, "Bericht mit Leerzeichen.pdf");
    await mkdir(directory, { recursive: true });
    await writeFile(file, "fixture", "utf-8");
    const expectedPath = await realpath(file);
    const launcher = recordingSpawn();

    const result = await openPath(file, {
      platform: "win32",
      environment: { SystemRoot: "C:\\Windows", SAFE_VALUE: "kept" },
      spawn: launcher.spawn,
    });

    expect(result).toEqual({
      resolvedPath: expectedPath,
      platform: "win32",
      targetType: "file",
      launcher: "powershell.exe",
    });
    expect(launcher.calls).toHaveLength(1);
    expect(launcher.calls[0].command).toBe("C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe");
    expect(launcher.calls[0].options).toMatchObject({
      detached: true,
      stdio: "ignore",
      shell: false,
      windowsHide: true,
      env: {
        SAFE_VALUE: "kept",
        ELLMOS_FILECOMMANDER_OPEN_PATH: expectedPath,
      },
    });
    expect(launcher.children[0].unref).toHaveBeenCalledOnce();
  });

  it("opens an existing directory and reports the directory target type", async () => {
    const directory = join(tempDirectory, "Ordner äöü mit Leerzeichen");
    await mkdir(directory);
    const expectedPath = await realpath(directory);
    const launcher = recordingSpawn();

    const result = await openPath(directory, { platform: "linux", spawn: launcher.spawn });

    expect(result.targetType).toBe("directory");
    expect(result.resolvedPath).toBe(expectedPath);
  });

  it("keeps a Windows target containing shell metacharacters out of command and arguments", async () => {
    const file = join(tempDirectory, "Bericht & Prüfung (final).pdf");
    await writeFile(file, "fixture", "utf-8");
    const expectedPath = await realpath(file);
    const launcher = recordingSpawn();

    await openPath(file, {
      platform: "win32",
      environment: { SystemRoot: "C:\\Windows" },
      spawn: launcher.spawn,
    });

    const call = launcher.calls[0];
    expect(call.command).not.toContain(expectedPath);
    expect(call.args.join(" ")).not.toContain(expectedPath);
    expect(call.options.env?.ELLMOS_FILECOMMANDER_OPEN_PATH).toBe(expectedPath);
    const encodedCommand = call.args[call.args.indexOf("-EncodedCommand") + 1];
    const decodedCommand = Buffer.from(encodedCommand, "base64").toString("utf16le");
    expect(decodedCommand).toContain("ELLMOS_FILECOMMANDER_OPEN_PATH");
    expect(decodedCommand).not.toContain(expectedPath);
  });

  it("uses macOS open with the resolved path as one literal argument", async () => {
    const file = join(tempDirectory, "macOS Datei ä.txt");
    await writeFile(file, "fixture", "utf-8");
    const expectedPath = await realpath(file);
    const launcher = recordingSpawn();

    const result = await openPath(file, { platform: "darwin", spawn: launcher.spawn });

    expect(result.launcher).toBe("open");
    expect(launcher.calls[0]).toMatchObject({
      command: "open",
      args: [expectedPath],
      options: { detached: true, stdio: "ignore", shell: false },
    });
  });

  it("uses Linux xdg-open with the resolved path as one literal argument", async () => {
    const file = join(tempDirectory, "Linux Datei ö.txt");
    await writeFile(file, "fixture", "utf-8");
    const expectedPath = await realpath(file);
    const launcher = recordingSpawn();

    const result = await openPath(file, { platform: "linux", spawn: launcher.spawn });

    expect(result.launcher).toBe("xdg-open");
    expect(launcher.calls[0]).toMatchObject({
      command: "xdg-open",
      args: [expectedPath],
      options: { detached: true, stdio: "ignore", shell: false },
    });
  });

  it("rejects a missing target before invoking the native launcher", async () => {
    const missing = resolve(tempDirectory, "fehlt.pdf");
    const launcher = recordingSpawn();

    await expect(openPath(missing, { platform: "linux", spawn: launcher.spawn })).rejects.toMatchObject({
      name: "OpenPathError",
      code: "PATH_NOT_FOUND",
      targetPath: missing,
    });
    expect(launcher.calls).toHaveLength(0);
  });

  it("rejects an unsupported platform before invoking the native launcher", async () => {
    const file = join(tempDirectory, "fixture.txt");
    await writeFile(file, "fixture", "utf-8");
    const launcher = recordingSpawn();

    await expect(openPath(file, { platform: "aix", spawn: launcher.spawn })).rejects.toEqual(
      expect.objectContaining<Partial<OpenPathError>>({
        name: "OpenPathError",
        code: "UNSUPPORTED_PLATFORM",
        platform: "aix",
      }),
    );
    expect(launcher.calls).toHaveLength(0);
  });

  it("reports a native launcher startup failure without claiming the target application opened", async () => {
    const file = join(tempDirectory, "fixture.txt");
    await writeFile(file, "fixture", "utf-8");
    const launcher = recordingSpawn(new Error("launcher unavailable"));

    await expect(openPath(file, { platform: "linux", spawn: launcher.spawn })).rejects.toMatchObject({
      name: "OpenPathError",
      code: "LAUNCH_FAILED",
      platform: "linux",
    });
    expect(launcher.children[0].unref).not.toHaveBeenCalled();
  });
});
