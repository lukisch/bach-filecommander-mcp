import { spawn as nodeSpawn } from "node:child_process";
import { realpath, stat } from "node:fs/promises";
import { resolve, win32 } from "node:path";

export type OpenPathErrorCode =
  | "PATH_NOT_FOUND"
  | "UNSUPPORTED_TARGET"
  | "UNSUPPORTED_PLATFORM"
  | "LAUNCH_FAILED";

export interface OpenPathSpawnOptions {
  detached: true;
  stdio: "ignore";
  shell: false;
  windowsHide?: boolean;
  env?: NodeJS.ProcessEnv;
}

export interface OpenPathSpawnedProcess {
  once(event: "spawn", listener: () => void): this;
  once(event: "error", listener: (error: Error) => void): this;
  unref(): void;
}

export type OpenPathSpawn = (
  command: string,
  args: readonly string[],
  options: OpenPathSpawnOptions,
) => OpenPathSpawnedProcess;

export interface OpenPathOptions {
  platform?: NodeJS.Platform;
  environment?: NodeJS.ProcessEnv;
  spawn?: OpenPathSpawn;
}

export interface OpenPathResult {
  resolvedPath: string;
  platform: NodeJS.Platform;
  targetType: "file" | "directory";
  launcher: "powershell.exe" | "open" | "xdg-open";
  launcherAccepted: true;
  userVisible: "unknown";
  fallback: OpenPathFallback;
}

export type OpenPathFallback =
  | {
    tool: "fc_preview_file";
    arguments: { path: string; include_content: false };
  }
  | {
    tool: "fc_list_directory";
    arguments: { path: string; depth: 1 };
  };

export interface OpenPathStructuredContent {
  [key: string]: unknown;
  launcher_accepted: boolean;
  user_visible: "unknown";
  path: string | null;
  platform: string | null;
  target_type: "file" | "directory" | null;
  launcher: OpenPathResult["launcher"] | null;
  fallback: OpenPathFallback | null;
  error_code: OpenPathErrorCode | null;
}

const WINDOWS_TARGET_ENV = "ELLMOS_FILECOMMANDER_OPEN_PATH";
const WINDOWS_OPEN_SCRIPT = [
  `$target = [Environment]::GetEnvironmentVariable('${WINDOWS_TARGET_ENV}', 'Process')`,
  "if ([String]::IsNullOrWhiteSpace($target)) { throw 'Missing FileCommander open-path target' }",
  "$startInfo = [System.Diagnostics.ProcessStartInfo]::new()",
  "$startInfo.FileName = $target",
  "$startInfo.UseShellExecute = $true",
  "[System.Diagnostics.Process]::Start($startInfo) | Out-Null",
].join("\n");

const defaultSpawn: OpenPathSpawn = (command, args, options) => (
  nodeSpawn(command, [...args], options) as OpenPathSpawnedProcess
);

export class OpenPathError extends Error {
  constructor(
    public readonly code: OpenPathErrorCode,
    message: string,
    public readonly targetPath?: string,
    public readonly platform?: NodeJS.Platform,
    public readonly targetType?: OpenPathResult["targetType"],
    public readonly fallback?: OpenPathFallback,
    public readonly launcher?: OpenPathResult["launcher"],
  ) {
    super(message);
    this.name = "OpenPathError";
  }
}

function fallbackFor(targetType: OpenPathResult["targetType"], resolvedPath: string): OpenPathFallback {
  return targetType === "file"
    ? {
      tool: "fc_preview_file",
      arguments: { path: resolvedPath, include_content: false },
    }
    : {
      tool: "fc_list_directory",
      arguments: { path: resolvedPath, depth: 1 },
    };
}

export function createOpenPathStructuredContent(result: OpenPathResult): OpenPathStructuredContent {
  return {
    launcher_accepted: result.launcherAccepted,
    user_visible: result.userVisible,
    path: result.resolvedPath,
    platform: result.platform,
    target_type: result.targetType,
    launcher: result.launcher,
    fallback: result.fallback,
    error_code: null,
  };
}

export function createOpenPathErrorStructuredContent(
  error: OpenPathError,
  requestedPath: string,
): OpenPathStructuredContent {
  return {
    launcher_accepted: false,
    user_visible: "unknown",
    path: error.targetPath ?? resolve(requestedPath),
    platform: error.platform ?? process.platform,
    target_type: error.targetType ?? null,
    launcher: error.launcher ?? null,
    fallback: error.fallback ?? null,
    error_code: error.code,
  };
}

export async function openPath(
  targetPath: string,
  options: OpenPathOptions = {},
): Promise<OpenPathResult> {
  const platform = options.platform ?? process.platform;
  const absolutePath = resolve(targetPath);
  let resolvedPath: string;
  let targetType: OpenPathResult["targetType"];

  try {
    resolvedPath = await realpath(absolutePath);
    const targetStats = await stat(resolvedPath);
    if (targetStats.isFile()) targetType = "file";
    else if (targetStats.isDirectory()) targetType = "directory";
    else {
      throw new OpenPathError(
        "UNSUPPORTED_TARGET",
        `Target is neither a regular file nor a directory: ${resolvedPath}`,
        resolvedPath,
        platform,
      );
    }
  } catch (error) {
    if (error instanceof OpenPathError) throw error;
    const errorCode = (error as NodeJS.ErrnoException).code;
    if (errorCode === "ENOENT" || errorCode === "ENOTDIR") {
      throw new OpenPathError(
        "PATH_NOT_FOUND",
        `Target does not exist: ${absolutePath}`,
        absolutePath,
        platform,
      );
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new OpenPathError(
      "PATH_NOT_FOUND",
      `Target cannot be resolved: ${absolutePath} (${message})`,
      absolutePath,
      platform,
    );
  }

  const environment = options.environment ?? process.env;
  const commonOptions: OpenPathSpawnOptions = {
    detached: true,
    stdio: "ignore",
    shell: false,
  };
  let command: string;
  let args: readonly string[];
  let launcher: OpenPathResult["launcher"];
  let spawnOptions = commonOptions;

  if (platform === "win32") {
    const systemRoot = environment.SystemRoot ?? environment.SYSTEMROOT ?? "C:\\Windows";
    command = win32.join(systemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
    args = [
      "-NoLogo",
      "-NoProfile",
      "-NonInteractive",
      "-EncodedCommand",
      Buffer.from(WINDOWS_OPEN_SCRIPT, "utf16le").toString("base64"),
    ];
    launcher = "powershell.exe";
    spawnOptions = {
      ...commonOptions,
      windowsHide: true,
      env: {
        ...environment,
        [WINDOWS_TARGET_ENV]: resolvedPath,
      },
    };
  } else if (platform === "darwin") {
    command = "open";
    args = [resolvedPath];
    launcher = "open";
  } else if (platform === "linux") {
    command = "xdg-open";
    args = [resolvedPath];
    launcher = "xdg-open";
  } else {
    throw new OpenPathError(
      "UNSUPPORTED_PLATFORM",
      `Unsupported platform: ${platform}`,
      resolvedPath,
      platform,
      targetType,
      fallbackFor(targetType, resolvedPath),
    );
  }

  const spawnProcess = options.spawn ?? defaultSpawn;
  let child: OpenPathSpawnedProcess;
  try {
    child = spawnProcess(command, args, spawnOptions);
    await new Promise<void>((resolveSpawn, rejectSpawn) => {
      child.once("spawn", resolveSpawn);
      child.once("error", rejectSpawn);
    });
    child.unref();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new OpenPathError(
      "LAUNCH_FAILED",
      `Default-handler launch request failed: ${message}`,
      resolvedPath,
      platform,
      targetType,
      fallbackFor(targetType, resolvedPath),
      launcher,
    );
  }

  return {
    resolvedPath,
    platform,
    targetType,
    launcher,
    launcherAccepted: true,
    userVisible: "unknown",
    fallback: fallbackFor(targetType, resolvedPath),
  };
}
