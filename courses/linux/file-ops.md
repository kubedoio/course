---
id: linux-file-ops
course_id: linux
title: Files, Directories & Permissions
duration_minutes: 20
vm_compatible: true
---

# Files, Directories & Permissions

In this lab, you'll learn how to create and manage files and folders.

## Commands

- `mkdir`: Create a directory
- `touch`: Create an empty file
- `chmod`: Change permissions

## Lab Task

1. Create a folder named `workspace` in your home directory.
2. Create a file named `todo.txt` inside it.
3. Change the file permissions so only you can read it.

```bash
mkdir -p ~/workspace
touch ~/workspace/todo.txt
chmod 400 ~/workspace/todo.txt
ls -l ~/workspace/todo.txt
```

## Validation

Verify that the `workspace` directory exists.

```verify
[ -d ~/workspace ] && echo "FOUND"
FOUND
```
