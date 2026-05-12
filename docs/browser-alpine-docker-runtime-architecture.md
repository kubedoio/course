# Browser Alpine + Docker Runtime Architecture

> Version: 1.0  
> Scope: In-browser x86 virtualization with Docker running inside the guest VM.  
> Status: Implemented.

---

## 1. Browser Runtime Choice

The runtime is **WebAssembly (Wasm) inside a standard web browser**.

- Wasm provides near-native performance for CPU-intensive emulation through JIT compilation.
- No browser plugins, extensions, or native binaries are required on the client.
- The entire execution sandbox is the browser's existing security model (CSP, CORS, same-origin policy).
- The server only serves static files (HTML, JS, Wasm, BIOS ROMs, disk image chunks). No server-side compute is used for the VM after the initial page load.

---

## 2. Why v86 Is Appropriate for the First Prototype

**v86** (`https://github.com/copy/v86`) is an open-source x86 PC emulator that compiles to WebAssembly and runs entirely in the browser.

| Criterion | v86 Fit |
|-----------|---------|
| **Maturity** | 10+ years old, 20k+ GitHub stars, actively maintained. |
| **CPU target** | 32-bit x86 (Pentium 4 level, SSE3). Matches our i386 requirement. |
| **Boot modes** | Supports bzImage, initrd, 9p filesystem passthrough, CD-ROM, floppy, hard disk. |
| **Networking** | Built-in virtio-net with pluggable WebSocket/Wisp relay backends. |
| **Terminal** | Real VGA text-mode / serial output rendered to a `<canvas>` or `<div>`. Not simulated. |
| **State save/restore** | Native `save_state()` / `restore_state()` API for snapshotting RAM and devices. |
| **Filesystem** | 9p (Plan 9) virtio filesystem lets the guest mount a host-provided directory tree as root. |

Alternatives considered and rejected:
- **JSLinux** (Fabrice Bellard): Smaller scope, no Docker-ready kernel configs documented.
- **x86js / other emulators**: Less mature, no networking, no save/restore.
- **Remote VM via SSH terminal**: Violates the constraint that Docker must run inside the user's browser VM.

---

## 3. Why the VM Image Must Be x86 / i386-Compatible

v86 emulates a **32-bit x86 CPU** (Pentium 4 class). It does **not** support:

- AMD64 / x86_64 long mode
- SSE4+ instructions
- Multicore / SMP
- Hardware virtualization extensions (Intel VT-x, AMD-V)

Therefore the guest operating system must be compiled for **i386 / i686 / x86** (32-bit) only. Alpine Linux still publishes x86 images and packages, making it a viable target. The kernel (`linux-virt`), userland (musl libc, busybox), and Docker binaries must all be 32-bit x86 binaries.

**Verification:** The `linux-virt` kernel config in Alpine 3.21 x86 includes `CONFIG_X86_32=y` and boots successfully inside v86.

---

## 4. Why Docker Scenarios Must Use x86-Compatible Images

Docker containers share the host kernel. They are **not** architecture-agnostic by default.

| Layer | Architecture |
|-------|--------------|
| Host (v86 emulated CPU) | 32-bit x86 (i686) |
| Guest kernel (Alpine `linux-virt`) | 32-bit x86 |
| Docker Engine (`dockerd`) | 32-bit x86 (Alpine `docker` package for x86) |
| Container images | **Must be i386/x86** or `i386/...` variants |

Running an `amd64` or `arm64` image inside the VM will fail with `exec format error` because the kernel cannot execute foreign-architecture binaries. The `i386/alpine:3.22` image is explicitly built for 32-bit x86 and works inside the VM.

**Note:** Docker's QEMU binfmt_misc support is **not available** in this environment because v86 does not emulate the binfmt_misc kernel subsystem, and QEMU user-mode emulation itself would need to run inside v86 (which is theoretically possible but out of scope for the first milestone).

---

## 5. VM Image Requirements

The VM image is built from `i386/alpine:3.21.0` using Docker on the host, then exported and converted to v86's 9p filesystem format.

### Required packages inside the VM

| Package | Purpose |
|---------|---------|
| `linux-virt` | Kernel with virtio, 9p, cgroups, netfilter modules. |
| `docker` + `docker-openrc` | Docker CLI + Engine + OpenRC integration. |
| `docker-cli-buildx` | Buildx plugin for multi-stage builds. |
| `iptables` + `ip6tables` | Packet filtering for Docker bridge networking. |
| `openrc` | Init system that starts `dockerd` at boot. |
| `alpine-base` | Base Alpine userspace (busybox, apk, etc.). |
| `agetty` | Console login manager. |
| `alpine-conf` | Alpine configuration utilities. |
| `nodejs` | Available for lab exercises. |
| `curl` | Network testing. |

### OpenRC services enabled

- `docker` (boot runlevel) — starts `dockerd`.
- `devfs`, `dmesg`, `mdev`, `hwdrivers` (sysinit) — hardware setup.
- `hwclock`, `modules`, `sysctl`, `hostname`, `syslog`, `bootmisc` (boot) — system setup.
- `local` (default) — runs custom boot-time health script.

### Boot-time health script (`/etc/local.d/health.start`)

Prints:
- Alpine version (`cat /etc/alpine-release`)
- Architecture (`uname -m`)
- Kernel version (`uname -r`)
- Docker daemon status
- Loads pre-cached `i386/alpine:3.22` image from `/root/alpine322.tar`

### Initramfs generation

```bash
mkinitfs -F "base virtio 9p" $(cat /usr/share/kernel/virt/kernel.release)
```

Modules `virtio` and `9p` are required for the root filesystem mount. The `base` feature ensures essential init scripts are included.

---

## 6. Browser Memory / Performance Limits

| Resource | Limit | Impact |
|----------|-------|--------|
| **Guest RAM** | 512 MB configured (v86 `memory_size`) | Enough for Alpine + Docker daemon + small containers. 1 GB is possible but increases state snapshot size. |
| **Browser tab memory** | ~2–4 GB practical ceiling | Wasm linear memory + JS heap + DOM + downloaded filesystem chunks. |
| **SharedArrayBuffer** | Required for multi-threaded Wasm (if enabled) | Needs COOP/COEP headers. Without it, v86 falls back to single-threaded JIT. |
| **CPU emulation speed** | ~10–50% of native host CPU | Depends on browser's Wasm engine and whether JIT compilation is active. |
| **Filesystem loading** | On-demand (lazy) | v86 9p only fetches files the guest actually accesses. The full image is ~120 MB compressed but not all loaded at once. |
| **State snapshot size** | 512 MB raw RAM → ~100–200 MB compressed | `localStorage` limit (~5–10 MB) makes full snapshots impractical. Use `IndexedDB` or server-side storage for production. |

### Performance mitigation strategies

- Use `zstd` compression for filesystem chunks (already implemented).
- Use `linux-virt` (minimal kernel) rather than `linux-lts` to reduce memory footprint.
- Disable unnecessary v86 devices (audio, floppy) if not needed.
- Avoid heavy Docker workloads (e.g., building from source inside the VM).

---

## 7. Network Relay Requirements

Browsers cannot open arbitrary TCP/UDP sockets. v86 implements a **virtio-net** device that forwards packets to a pluggable network backend.

### Available backends

| Backend | Protocol | Use Case |
|---------|----------|----------|
| `fetch_network` | HTTP `fetch()` | TCP-only, outgoing connections only. |
| `inbrowser_network` | WebSocket | Full packet forwarding through a relay server. |
| `wisp_network` | Wisp (`wisp.mercurywork.shop`) | Modern WebSocket-based tunneling protocol. |

### Current configuration

The network relay URL is **commented out** as a placeholder:

```javascript
// network_relay_url: "wss://relay.example.com",
```

To enable outbound internet:
1. Deploy or use a public Wisp/WebSocket relay.
2. Uncomment the line in `src/v86-runtime.js`.
3. The VM will DHCP via `udhcpc` and route through `virtio-net`.

### Relay setup (self-hosted)

A minimal relay can be deployed with `wisp-server-go`:

```bash
go install github.com/MercuryWorkshop/wisp-server-go@latest
wisp-server-go -bind 0.0.0.0:5001
```

Then set `network_relay_url: "wss://your-host:5001"`.

---

## 8. State Reset / Persistence Strategy

### Default: Disposable VM

By default, the VM is **ephemeral**. Any changes made inside the VM (installed packages, created files, running containers) are lost when the browser tab is closed or the page is refreshed. This is the safest and simplest model for a lab environment.

### Opt-in persistence: Save / Restore

v86 provides `save_state()` and `restore_state()` APIs that capture the full VM state (RAM, CPU registers, device states) to a `Uint8Array`.

| Aspect | Current Implementation | Limitation |
|--------|------------------------|------------|
| Storage medium | `localStorage` (base64) | ~5–10 MB limit. Full 512 MB RAM snapshots will not fit. |
| Better alternative | `IndexedDB` or server upload | Can handle 100–200 MB compressed snapshots. |
| UI | "Save State" / "Restore State" buttons | Best-effort; warns user if save fails. |

### Filesystem persistence

The 9p root filesystem is **read-only from the guest's perspective** unless `rootflags=trans=virtio,cache=loose` is used. Even then, changes are not persisted back to the host's `alpine-rootfs-flat/` directory. True persistence requires:
- A writable block device (hard disk image) mounted as overlay, or
- A `localStorage` / `IndexedDB` backed 9p writeback layer (not implemented in v86).

**Recommendation:** Treat the VM as disposable. Use `docker run` for stateless experiments. For persistence, save the VM state snapshot before closing the tab.

---

## 9. Risks That Could Block Docker Inside the VM

### Risk 1: Kernel missing Docker-required features
**Impact:** HIGH  
**Mitigation:** Verified `linux-virt` config includes `CONFIG_CGROUPS=y`, `CONFIG_NAMESPACES=y`, `CONFIG_OVERLAY_FS=m`, `CONFIG_VETH=m`, `CONFIG_BRIDGE=m`, `CONFIG_NETFILTER=y`, `CONFIG_NF_NAT=m`, `CONFIG_IP_NF_TARGET_MASQUERADE=m`. All present in Alpine 3.21 `linux-virt`.

### Risk 2: Docker package unavailable for x86 in Alpine
**Impact:** HIGH  
**Mitigation:** Verified `apk search docker` on `i386/alpine:3.21.0` returns `docker-27.3.1-r5` and dependencies. Package installs successfully.

### Risk 3: `dockerd` fails to start due to missing cgroup mount
**Impact:** MEDIUM  
**Mitigation:** Alpine's OpenRC mounts cgroup v2 at `/sys/fs/cgroup` during boot. The `docker` OpenRC service depends on this. Verified by booting the image in v86.

### Risk 4: Initramfs missing virtio/9p modules
**Impact:** HIGH (VM won't boot)  
**Mitigation:** `mkinitfs -F "base virtio 9p"` explicitly includes these modules. The initramfs is generated during the Docker build.

### Risk 5: Performance too slow for Docker to be usable
**Impact:** MEDIUM  
**Mitigation:** Docker daemon startup takes ~10–30 seconds inside v86. Container execution (`docker run`) is usable for lightweight images (Alpine, busybox). Building from source is not recommended.

### Risk 6: Out of memory during Docker operations
**Impact:** MEDIUM  
**Mitigation:** 512 MB RAM is sufficient for Docker daemon + 1–2 small containers. Memory usage is visible in the browser's task manager. The VM will OOM-kill processes if exceeded.

### Risk 7: Network not available without relay
**Impact:** LOW (feature degradation)  
**Mitigation:** Docker works offline for pre-cached images. Outbound pulls require a relay. The preloaded `i386/alpine:3.22` image is available offline.

### Risk 8: Container image architecture mismatch
**Impact:** MEDIUM  
**Mitigation:** All lab instructions explicitly use `i386/...` images. The acceptance test uses `i386/alpine:3.22`.

---

## 10. Acceptance Criteria

The implementation is **accepted** only when all of the following commands produce the expected output inside the browser VM terminal:

| # | Command | Expected Output |
|---|---------|-----------------|
| 1 | `cat /etc/alpine-release` | `3.21.0` (or the Alpine version built into the image) |
| 2 | `uname -m` | `i686` or `i386` |
| 3 | `docker version` | Client and Server versions both shown (proves `dockerd` is running) |
| 4 | `docker info` | System info, storage driver `overlay2`, cgroup driver `cgroupfs` or `systemd` |
| 5 | `docker run --rm i386/alpine:3.22 echo browser-docker-ok` | `browser-docker-ok` |

### Additional UI-level acceptance criteria

- [ ] Page loads without JavaScript errors.
- [ ] Capability checks pass (WebAssembly, fetch, URL, TextDecoder).
- [ ] "Boot VM" button initiates the emulator.
- [ ] Status pill transitions through: `Booting` → `Alpine ready` → `Docker ready`.
- [ ] Terminal displays the health script output including Alpine version and Docker status.
- [ ] "Reset VM" reboots the VM without requiring a page refresh.
- [ ] "Save State" and "Restore State" buttons are functional (best-effort given browser storage limits).

---

## Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────────┐
│                         Browser Tab                                  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  UI Layer (HTML/CSS/JS)                                        │  │
│  │  ┌─────────────┐  ┌─────────────────────────────────────────┐ │  │
│  │  │ Lab         │  │ Terminal + Boot Log + Status Pill       │ │  │
│  │  │ Instructions│  │                                         │ │  │
│  │  └─────────────┘  └─────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  v86 Runtime (libv86.js + v86.wasm)                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │  │
│  │  │ x86 CPU JIT │  │ SeaBIOS     │  │ VGA BIOS            │   │  │
│  │  │ (Wasm)      │  │ (128 KB)    │  │ (36 KB)             │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘   │  │
│  │                              │                                │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ 9p Filesystem Driver                                    │  │  │
│  │  │  → alpine-fs.json (metadata)                            │  │  │
│  │  │  → alpine-rootfs-flat/ (zstd-compressed chunks)         │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                              │                                │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ virtio-net → Optional WebSocket/Wisp Relay              │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Guest VM: Alpine Linux 3.21 x86 (linux-virt 6.12.87)        │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ OpenRC → dockerd (Docker Engine 27.3.1)                 │  │  │
│  │  │                           │                             │  │  │
│  │  │                    ┌──────┴──────┐                      │  │  │
│  │  │                    ▼             ▼                      │  │  │
│  │  │         i386/alpine:3.22    Other x86 containers        │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Emulator | v86 | Mature, Wasm-native, supports 9p fs + networking. |
| Guest OS | Alpine Linux 3.21 x86 | Still publishes x86 packages; minimal size; Docker package available. |
| Kernel flavor | `linux-virt` | Smaller than `linux-lts`; verified to include all Docker features. |
| Filesystem format | v86 9p (flat + JSON) | On-demand loading; no disk image required; kernel/initrd discovered automatically. |
| Init system | OpenRC | Native to Alpine; integrates cleanly with `docker-openrc`. |
| Network | Optional WebSocket relay | Browser security model requires it; disabled by default. |
| Persistence | Disposable default, opt-in save/restore | Simplicity first; snapshots are best-effort due to browser storage limits. |
