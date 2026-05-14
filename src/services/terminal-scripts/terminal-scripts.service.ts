import { join } from "node:path";

import { FileSystemTerminalScriptsStore } from "./adapters/out/file-system-terminal-scripts-store.js";
import { ScriptProcessRunner } from "./adapters/out/script-process-runner.js";
import { ScriptCommandNotFoundError } from "./terminal-scripts.errors.js";
import {
  noopTerminalScriptsListener,
  type TerminalScriptsListener,
} from "./terminal-scripts-listener.js";

export interface TerminalScriptsEntry {
  readonly name: string;
}

export interface TerminalScriptsStore {
  ensureDirectory(): Promise<void>;
  isDirectory(): Promise<boolean>;
  listFiles(): Promise<TerminalScriptsEntry[]>;
  modifiedAtMs(entryName: string): Promise<number>;
  remove(entryName: string): Promise<void>;
}

export interface RecordProcessRunner {
  run(logPath: string): Promise<number>;
}

export interface CleanResult {
  directoryExists: boolean;
  removed: number;
}

export class TerminalScriptsService {
  constructor(
    private readonly directory: string,
    private readonly listener: TerminalScriptsListener = noopTerminalScriptsListener,
    private readonly store: TerminalScriptsStore = new FileSystemTerminalScriptsStore(
      directory,
    ),
    private readonly processRunner: RecordProcessRunner = new ScriptProcessRunner(),
  ) {}

  async record(): Promise<number> {
    await this.store.ensureDirectory();

    const logPath = join(this.directory, `${buildTimestamp()}.log`);
    this.listener.onEvent({ type: "record_started", logPath });

    return this.processRunner.run(logPath);
  }

  async clean(maxAgeMinutes = 15): Promise<CleanResult> {
    if (!(await this.store.isDirectory())) {
      return { directoryExists: false, removed: 0 };
    }

    const entries = await this.store.listFiles();
    const cutoff = Date.now() - maxAgeMinutes * 60 * 1000;
    let removed = 0;

    for (const entry of entries) {
      let modifiedAtMs: number;

      try {
        modifiedAtMs = await this.store.modifiedAtMs(entry.name);
      } catch (error) {
        const reason = toErrorMessage(error);
        this.listener.onEvent({
          type: "entry_skipped",
          entryName: entry.name,
          reason,
        });
        continue;
      }

      if (modifiedAtMs >= cutoff) {
        continue;
      }

      try {
        await this.store.remove(entry.name);
        removed += 1;
      } catch (error) {
        const typedError = error as NodeJS.ErrnoException;
        if (typedError.code === "ENOENT") {
          continue;
        }

        const reason = toErrorMessage(error);
        this.listener.onEvent({
          type: "entry_remove_failed",
          entryName: entry.name,
          reason,
        });
      }
    }

    return { directoryExists: true, removed };
  }
}

function buildTimestamp(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = twoDigits(now.getMonth() + 1);
  const day = twoDigits(now.getDate());
  const hours = twoDigits(now.getHours());
  const minutes = twoDigits(now.getMinutes());
  const seconds = twoDigits(now.getSeconds());

  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
}

function twoDigits(value: number): string {
  return value.toString().padStart(2, "0");
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

    return String(error);
}

export { ScriptCommandNotFoundError };
export { TerminalScriptsService as TerminalScripts };
