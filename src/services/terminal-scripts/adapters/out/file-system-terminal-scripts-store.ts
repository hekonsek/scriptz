import { mkdir, readdir, stat, unlink } from "node:fs/promises";
import { join } from "node:path";

import type {
  TerminalScriptsEntry,
  TerminalScriptsStore,
} from "../../terminal-scripts.service.js";

export class FileSystemTerminalScriptsStore implements TerminalScriptsStore {
  constructor(private readonly directory: string) {}

  async ensureDirectory(): Promise<void> {
    await mkdir(this.directory, { recursive: true });
  }

  async isDirectory(): Promise<boolean> {
    try {
      const directoryStat = await stat(this.directory);
      return directoryStat.isDirectory();
    } catch (error) {
      const typedError = error as NodeJS.ErrnoException;
      if (typedError.code === "ENOENT") {
        return false;
      }

      throw error;
    }
  }

  async listFiles(): Promise<TerminalScriptsEntry[]> {
    const entries = await readdir(this.directory, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => ({ name: entry.name }));
  }

  async modifiedAtMs(entryName: string): Promise<number> {
    const fileStat = await stat(join(this.directory, entryName));
    return fileStat.mtimeMs;
  }

  async remove(entryName: string): Promise<void> {
    await unlink(join(this.directory, entryName));
  }
}
