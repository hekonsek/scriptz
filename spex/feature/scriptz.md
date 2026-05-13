# Scriptz: record your terminal sessions with script

This project provides a Node.js + TypeScript CLI for working with terminal session recordings created by the Unix `script` command.

## How it works

- Recordings are stored in `~/.cache/script`.
- `record` starts a new `script` session and writes output to a timestamped `.log` file.
- `clean` removes recordings older than 15 minutes so only recent session data stays on disk.
