import { randomInt } from "node:crypto";

const promptNames = [
  "amber",
  "atlas",
  "cedar",
  "delta",
  "ember",
  "falcon",
  "harbor",
  "iris",
  "juno",
  "kepler",
  "lumen",
  "nova",
  "onyx",
  "orbit",
  "pixel",
  "quartz",
  "raven",
  "summit",
  "terra",
  "vector",
];

export function buildPromptAssignment(name = randomPromptName()): string {
  return `PS1='\\[\\e]0;\\u@${name}: \\w\\a\\]\${debian_chroot:+($debian_chroot)}\\[\\033[01;32m\\]\\u@${name}\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ '`;
}

function randomPromptName(): string {
  return promptNames[randomInt(promptNames.length)];
}
