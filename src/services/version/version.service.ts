import packageJson from "../../../package.json" with { type: "json" };

export class VersionService {
  packageVersion(): string {
    return packageJson.version;
  }
}
