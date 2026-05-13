# scriptz prompt

This command generates shell command that can be used to change current Bash prompt into one that is easier to refer to.

The idea is to have Bash prompt similar to something like `hekonsek@summit:~/projects/scriptz$` and refer to it as "summit prompt logs" when talking to AI agent.

## Prompt format

Generated prompt is a standard WSL Ubuntu prompt...

```
\[\e]0;\u@\h: \w\a\]${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$
```

...but hostname is replaced with randomly generated word.

## Usage

This command only display shell command needed to change prompt...

```
PS1="..."
```

...because shell process cannot replace its parent prompt.

Generated pompt can be later applied using the following command:

```bash
eval "$(scriptz prompt)"
```

