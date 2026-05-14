export class ScriptCommandNotFoundError extends Error {
  constructor() {
    super("The 'script' command is not available.");
    this.name = "ScriptCommandNotFoundError";
  }
}
