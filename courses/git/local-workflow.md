---
id: git-local-workflow
course_id: git
title: Local Git Workflow
duration_minutes: 20
vm_compatible: true
source:
  - content/2024-03-29-git101en.markdown
---

# Local Git Workflow

Practice Git locally. Remote hosting is not required for this milestone.

## Goals

- Initialize a repository.
- Track changes with `git status`, `git add`, and `git commit`.
- Read history with `git log`.
- Create a branch and compare changes.

## Lab

```bash
mkdir -p ~/git-lab
cd ~/git-lab
git init
git config user.email "student@example.test"
git config user.name "Browser Lab Student"
printf "first line\n" > notes.txt
git status
git add notes.txt
git commit -m "Add notes"
git log --oneline --graph
git switch -c experiment
printf "second line\n" >> notes.txt
git diff
```

## Check

- What changed after `git add`?
- Which commit is `HEAD` pointing at?
- Why is a branch useful for experiments?
