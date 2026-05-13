# scriptz prompt

This command changes current Bash prompt into the following standard WSL Ubuntu prompt...

```
PS1='\[\e]0;\u@NAME: \w\a\]${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@FOO\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
```

...but `NAME` should be replaced with randomly generated word.