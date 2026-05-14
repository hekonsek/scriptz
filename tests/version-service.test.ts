import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { describe, expect, it } from "vitest";

import { VersionService } from "../src/services/version/version.service.js";

describe("VersionService", () => {
  it("reads the package version", async () => {
    const tempRoot = await mkdtemp(join(tmpdir(), "scriptz-"));
    const packageJsonPath = join(tempRoot, "package.json");

    try {
      await writeFile(packageJsonPath, '{"version":"1.2.3"}', "utf8");

      const version = await new VersionService(
        pathToFileURL(packageJsonPath),
      ).packageVersion();

      expect(version).toBe("1.2.3");
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });

  it("falls back when package version is missing", async () => {
    const tempRoot = await mkdtemp(join(tmpdir(), "scriptz-"));
    const packageJsonPath = join(tempRoot, "package.json");

    try {
      await writeFile(packageJsonPath, "{}", "utf8");

      const version = await new VersionService(
        pathToFileURL(packageJsonPath),
      ).packageVersion();

      expect(version).toBe("0.0.0");
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });
});
