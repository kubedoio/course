# WASM Cloud Lab — File Inventory & Build Documentation

## Overview

This project runs a full x86 PC emulator ([v86](https://github.com/copy/v86)) directly in the browser using WebAssembly. It boots a real Linux kernel with a minimal userspace — all client-side, no server-side compute resources are used after the static files are served.

The environment currently runs **Buildroot Linux** (kernel 6.8.12) because the original Alpine Linux image URLs referenced in the first version of this page were **404 Not Found**, and building the v86 Alpine image requires a running Docker daemon (see [Alpine section](#alpine-linux-why-not-used) below).

---

## Downloaded Files

All binaries are fetched from the v86 project's own CDN (`copy.sh` / `i.copy.sh`) and served locally to avoid CORS and availability issues.

### 1. v86 WebAssembly Engine

| File | Source URL | Local Path | Size | SHA-256 |
|------|-----------|------------|------|---------|
| `libv86.js` | `https://copy.sh/v86/build/libv86.js` | `v86/build/libv86.js` | 337,697 B | `3a64f4dfef4f6ada802aa38bd05b1caf534fa3ca085c6ea297673a11d13b93df` |
| `v86.wasm` | `https://copy.sh/v86/build/v86.wasm` | `v86/build/v86.wasm` | 1,424,184 B | `93247ff03ed46dddf64fc7d2363a25858a76d22cb82c02a08df5c399ae03e2dd` |

**What it is:** The v86 emulator compiled to JavaScript and WebAssembly. `libv86.js` is the loader/runtime; `v86.wasm` is the compiled Rust/C core that does the actual x86 emulation.

---

### 2. PC Firmware (BIOS / VGA BIOS)

| File | Source URL | Local Path | Size | SHA-256 |
|------|-----------|------------|------|---------|
| `seabios.bin` | `https://copy.sh/v86/bios/seabios.bin` | `v86/bios/seabios.bin` | 131,072 B | `73e3f359102e3a9982c35fce98eb7cd08f18303ac7f1ba6ebfbe6cdc1c244d98` |
| `vgabios.bin` | `https://copy.sh/v86/bios/vgabios.bin` | `v86/bios/vgabios.bin` | 36,352 B | `a4bc0d80cc3ca028c73dafa8fee396b8d054ce87ebd8abfbd31b06b437607880` |

**What it is:** SeaBIOS (open-source x86 BIOS) and the Bochs VGA BIOS. v86 needs these ROM images to initialize the virtual motherboard, CPU, memory map, and VGA adapter before it can load an operating system.

---

### 3. Linux Kernel Image

| File | Source URL | Local Path | Size | SHA-256 |
|------|-----------|------------|------|---------|
| `buildroot-bzimage68.bin` | `https://i.copy.sh/buildroot-bzimage68.bin` | `v86/images/binaries/buildroot-bzimage68.bin` | 10,068,480 B | `507a759c70ab7a490a233be454d0b5b88bc667956a410b531cb4edc091e2eb1c` |

**What it is:** A pre-built **Buildroot Linux** kernel (bzImage format, version 6.8.12, built `Sat Aug 31 22:58:35 UTC 2024`). This is a standalone kernel that contains an embedded initramfs with a minimal BusyBox-based userspace. It is one of the standard test images shipped by the v86 project.

**Verification:**
```bash
file buildroot-bzimage68.bin
# → Linux kernel x86 boot executable bzImage, version 6.8.12 ...
```

---

## How the Environment Is Built

### Buildroot Linux Image

The `buildroot-bzimage68.bin` image is **not built in this project** — it is downloaded as a pre-built artifact from the v86 project. However, if you wanted to reproduce a similar image from scratch, the upstream process is:

1. **Toolchain:** Buildroot uses a cross-compilation toolchain (typically `i686-buildroot-linux-musl` or `i686-buildroot-linux-gnu`).
2. **Kernel:** Configures and compiles Linux 6.8.12 for x86 with essential drivers (IDE, VGA framebuffer, serial, NE2000/virtio-net).
3. **Rootfs:** Compiles BusyBox and selected packages into a minimal root filesystem.
4. **Packaging:** The rootfs is bundled into the kernel as an `initramfs` (cpio archive) so the entire OS fits in a single `bzImage` file. No separate disk image is required.

The v86 project publishes these pre-built kernels at `https://i.copy.sh/` for quick testing.

### v86 Engine Build

The v86 engine itself is built from the official repository:

```bash
git clone https://github.com/copy/v86.git
cd v86
make all
```

Requirements:
- Rust with `wasm32-unknown-unknown` target
- `clang` compatible with Rust
- `nodejs` (for build tooling)
- `make`

This produces:
- `build/libv86.js` — browser-ready loader
- `build/v86.wasm` — WebAssembly bytecode

We download the already-compiled release artifacts instead of building from source.

---

## Server Setup

A minimal Python HTTPS server is used to serve the files on port 9999, binding to `0.0.0.0` so it is reachable from outside:

```bash
# Self-signed certificate (required for HTTPS)
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 1 -nodes -subj "/CN=localhost"

# Start server
python3 server.py
```

The server script (`server.py`) is a plain `http.server.HTTPServer` wrapped in TLS. It serves the current directory (and all subdirectories) so `wasm_lab.html`, `v86/build/*`, `v86/bios/*`, and `v86/images/*` are all reachable.

**Access:** `https://<host-ip>:9999/wasm_lab.html`

> ⚠️ Because the certificate is self-signed, browsers will show a security warning. Accept the risk / click "Advanced" → "Proceed" to continue.

---

## Alpine Linux — Why Not Used

The original HTML claimed to run "Alpine Linux". The correct way to create a v86-compatible Alpine image is documented in the v86 repository at `tools/docker/alpine/`:

1. Build a Docker image from `i386/alpine:3.21.0`
2. Export the container filesystem to a tar archive
3. Run `tools/fs2json.py --zstd` to generate `alpine-fs.json`
4. Run `tools/copy-to-sha256.py --zstd` to generate `alpine-rootfs-flat/`
5. Serve those files alongside the kernel

**We could not use Alpine in this environment because:**
- The pre-built Alpine image URLs (`https://copy.sh/v86/images/binaries/bzImage-ix86-3.16.bin`, etc.) referenced in older examples are **404 Not Found**.
- Building the v86 Alpine image requires a running **Docker daemon** (`docker build --platform linux/386 ...`).
- This host does not have a functional Docker daemon available (`dockerd` is missing / not running).

Therefore we switched to the **Buildroot Linux** image (`buildroot-bzimage68.bin`), which is readily available, fully self-contained, and boots without any additional filesystem infrastructure.

---

## Disk Space Summary

| Category | Size |
|----------|------|
| v86 engine (JS + WASM) | ~1.8 MB |
| BIOS ROMs | ~167 KB |
| Buildroot Linux kernel | ~9.6 MB |
| **Total static assets** | **~11.6 MB** |

---

## References

- v86 Project: https://github.com/copy/v86
- v86 Live Demos: https://copy.sh/v86/
- Buildroot: https://buildroot.org/
- SeaBIOS: https://www.seabios.org/
