---
id: linux-process-network
course_id: linux
title: Processes, Packages, and Networking
duration_minutes: 25
vm_compatible: true
source:
  - content/2020-01-01-linux101-bolum3-long.markdown
  - content/2020-01-01-linux101-bolum4-long.markdown
---

# Processes, Packages, and Networking

The VM is small, so prefer inspection commands and lightweight packages.

## Goals

- List processes with `ps` and `top`.
- Inspect disk and memory pressure with `df`, `du`, and `free`.
- Use Alpine package tools with `apk`.
- Check network configuration with `ip`, `ping`, and `wget` when network relay is enabled.

## Lab

```bash
ps aux | head
df -h
du -sh /var 2>/dev/null
free -m
apk info | head
ip addr
ping -c 2 1.1.1.1
```

## VM Notes

- `apt`, `yum`, and `dnf` examples from source lessons map to `apk` in this Alpine VM.
- Outbound network tests require the HTTP lab with WebSocket relay enabled.
- Avoid installing large packages; the VM has limited memory and browser-backed storage.
