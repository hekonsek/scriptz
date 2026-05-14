import { describe, expect, it } from "vitest";

import { buildPromptAssignment } from "../src/services/shell-prompt/shell-prompt.service.js";

describe("shell prompt", () => {
  it("builds the requested Bash prompt assignment", () => {
    expect(buildPromptAssignment("ember")).toBe(
      "PS1='\\[\\e]0;\\u@ember: \\w\\a\\]${debian_chroot:+($debian_chroot)}\\[\\033[01;32m\\]\\u@ember\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ '",
    );
  });

  it("uses a generated word for the terminal title name", () => {
    const assignment = buildPromptAssignment();
    const match = /^PS1='\\\[\\e\]0;\\u@([a-z]+):/.exec(assignment);

    expect(match?.[1]).toBeDefined();
    expect(assignment).toContain(`\\u@${match?.[1]}\\[\\033[00m\\]`);
  });
});
