import { spawn } from "node:child_process";

import {
  ScriptCommandNotFoundError,
  type RecordProcessRunner,
} from "../../terminal-scripts.service.js";

export class ScriptProcessRunner implements RecordProcessRunner {
  async run(logPath: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const child = spawn("script", ["-q", "-f", logPath], {
        stdio: "inherit",
      });

      child.once("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "ENOENT") {
          reject(new ScriptCommandNotFoundError());
          return;
        }

        reject(error);
      });

      child.once("close", (code: number | null) => {
        resolve(code ?? 1);
      });
    });
  }
}
