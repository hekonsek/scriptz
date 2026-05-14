import { readFile } from "node:fs/promises";

export class VersionService {
  constructor(
    private readonly packageJsonUrl = new URL(
      "../../../package.json",
      import.meta.url,
    ),
  ) {}

  async packageVersion(): Promise<string> {
    const packageJsonRaw = await readFile(this.packageJsonUrl, "utf8");
    const packageJson = JSON.parse(packageJsonRaw) as { version?: string };

    return packageJson.version ?? "0.0.0";
  }
}
