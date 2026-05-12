---
id: linux-shell-files
course_id: linux
title: Shell, Files, and Permissions
duration_minutes: 20
vm_compatible: true
source:
  - content/2020-01-01-linux101-bolum2-long.markdown
---

# Shell, Files, and Permissions

Use the browser VM to get comfortable with the shell before moving into Docker.

## Goals

- Move around the filesystem with `pwd`, `ls`, and `cd`.
- Read files with `cat`, `less`, `head`, and `tail`.
- Create and organize files with `touch`, `mkdir`, `cp`, `mv`, and `rm`.
- Inspect permissions with `ls -l` and change them with `chmod`.

## Lab

```bash
pwd
ls -la /
mkdir -p ~/lab/notes
cd ~/lab
printf "browser linux lab\n" > notes/intro.txt
cat notes/intro.txt
cp notes/intro.txt notes/copy.txt
chmod 600 notes/copy.txt
ls -l notes
```

## Check

- What directory are you in after `cd ~/lab`?
- Which command changed `copy.txt` to owner-read/write only?
- Why is `rm -r` riskier than `rm`?
