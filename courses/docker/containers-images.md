---
id: docker-containers-images
course_id: docker
title: Containers and Images
duration_minutes: 25
vm_compatible: true
source:
  - content/2020-01-01-docker101-bolum1.markdown
  - content/2020-01-01-docker101-bolum2.markdown
---

# Containers and Images

Docker is available inside the browser VM. Use i386-compatible images because the VM is 32-bit x86.

## Goals

- Verify Docker is running.
- Run a short-lived container.
- List images and containers.
- Understand the difference between an image and a container.

## Lab

```bash
docker version
docker info
docker image ls
docker run --rm i386/alpine:3.22 echo browser-docker-ok
docker container ls -a
docker pull i386/alpine:3.22
docker image inspect i386/alpine:3.22 | head
```

## VM Notes

- Prefer `i386/alpine:3.22` for examples.
- Generic images such as `ubuntu:latest` may fail when they do not publish a 386 image.
- Keep containers small and remove them with `--rm` where possible.
