---
id: scripting-control-flow
course_id: scripting
title: Control Flow and File Tests
duration_minutes: 30
vm_compatible: true
source:
  - content/2021-01-01-scripting101en.markdown
---

# Control Flow and File Tests

Conditionals and loops are enough to automate many small Linux tasks.

## Goals

- Use `if`, `then`, `else`, and `fi`.
- Test for files and directories.
- Loop over arguments.
- Exit with meaningful status codes.

## Lab

```bash
cd ~/script-lab
cat > check-paths.sh <<'SCRIPT'
#!/bin/sh
if [ "$#" -eq 0 ]; then
  echo "usage: $0 PATH..."
  exit 2
fi

for path in "$@"; do
  if [ -d "$path" ]; then
    echo "$path is a directory"
  elif [ -f "$path" ]; then
    echo "$path is a file"
  else
    echo "$path is missing"
  fi
done
SCRIPT
chmod +x check-paths.sh
./check-paths.sh /etc/passwd /tmp /no/such/path
```

## Check

- Which operator tests for a regular file?
- Why should variables be quoted in test expressions?
