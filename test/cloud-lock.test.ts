import { describe, expect, it } from "vitest";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { inspectCloudTargetState } from "../src/cloud-lock.js";

describe("inspectCloudTargetState", () => {
  it("classifies a missing target without treating it as a lock", async () => {
    const target = path.join(os.tmpdir(), "fc-cloud-lock-missing-" + Date.now());
    await expect(inspectCloudTargetState(target)).resolves.toEqual({ kind: "missing" });
  });

  it("reports ordinary file and directory state", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "fc-cloud-lock-"));
    try {
      const file = path.join(root, "target.txt");
      await fs.writeFile(file, "ok");
      await expect(inspectCloudTargetState(file)).resolves.toEqual({ kind: "file" });
      await expect(inspectCloudTargetState(root)).resolves.toEqual({ kind: "directory" });
    } finally {
      await fs.rm(root, { recursive: true, force: true });
    }
  });
});
