---
id: docker-build-network
course_id: docker
title: Builds, Volumes, and Networking
duration_minutes: 30
vm_compatible: true
source:
  - content/2020-01-01-docker101-bolum3.markdown
  - content/2020-01-01-docker101-bolum4.markdown
---

# Builds, Volumes, and Networking

This lesson keeps Docker work small enough for the browser VM.

## Goals

- Build a tiny image.
- Mount a host directory into a container.
- Inspect the default Docker network.

## Lab

```bash
mkdir -p ~/docker-lab/site
cd ~/docker-lab
printf "hello from a volume\n" > site/index.txt
cat > Dockerfile <<'DOCKERFILE'
FROM i386/alpine:3.22
CMD ["sh", "-c", "cat /site/index.txt 2>/dev/null || echo no-volume"]
DOCKERFILE
docker build -t browser-lab-volume .
docker run --rm -v "$PWD/site:/site:ro" browser-lab-volume
docker network ls
docker network inspect bridge | head -40
```

## VM Notes

- Avoid long-running service stacks until the VM memory budget is validated.
- Network egress depends on the lab server mode and relay availability.
