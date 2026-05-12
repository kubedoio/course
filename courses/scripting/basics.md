---
id: scripting-basics
course_id: scripting
title: Bash Script Basics
duration_minutes: 25
vm_compatible: true
source:
  - content/2021-01-01-scripting101en.markdown
---

# Bash Script Basics

Use scripts to turn repeated shell commands into reusable tools.

## Goals

- Create executable `.sh` files.
- Use variables and positional arguments.
- Print output with `echo` and `printf`.
- Read environment variables.

## Lab

```bash
mkdir -p ~/script-lab
cd ~/script-lab
cat > hello.sh <<'SCRIPT'
#!/bin/sh
name="${1:-student}"
printf "hello %s\n" "$name"
printf "shell: %s\n" "$SHELL"
SCRIPT
chmod +x hello.sh
./hello.sh browser
```

## Check

- What does `$1` mean?
- Why is `"${1:-student}"` useful?
- What changes when you remove execute permission?
