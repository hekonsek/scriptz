import { describe, expect, it } from "vitest";

import packageJson from "../../../package.json" with { type: "json" };
import { VersionService } from "../../../src/services/version/version.service.js";

describe("VersionService", () => {
  it("reads the package version", () => {
    expect(new VersionService().packageVersion()).toBe(packageJson.version);
  });
});
