# Browser Linux + Docker Lab

A browser-based Alpine Linux virtual machine with a working Docker Engine, running entirely client-side via the [v86](https://github.com/copy/v86) x86 emulator.

**No remote server compute is used after the initial page load.** The VM boots a real 32-bit x86 Linux kernel with Docker inside your browser using WebAssembly.

---

## Quick Start

### Docker Compose

The recommended way to run the lab now is Docker Compose:

```bash
cp .env.example .env
docker compose up --build
```

Open:

- **SSO-protected lab:** `http://lab.localhost:8080/`
- **Direct local lab:** `http://localhost:9998/`
- **Keycloak admin:** `http://lab.localhost:8080/auth/admin/`

Development credentials:

- Keycloak admin: `admin` / `admin`
- Imported lab user: `student` / `student`

For cleanup:

```bash
make clean
```

See [`docs/deployment.md`](docs/deployment.md) for the full Docker, Keycloak,
and SSO layout.

Course completion is saved per authenticated Keycloak user when you enter
through the SSO-protected lab. The `progress-api` service stores lesson state in
SQLite on the `progress-data` Docker volume. The direct local lab still works,
but uses browser-local progress because it bypasses the authenticated gateway.

### Legacy Python Server

1. **Open the lab:**
   - **With VM internet access:** `http://<server-ip>:9998/`
   - **HTTPS (offline Docker only):** `https://<server-ip>:9999/`

2. Click **Boot VM** and wait 30–120 seconds for Alpine Linux to boot.

3. Verify Docker works inside the VM terminal:
   ```bash
   cat /etc/alpine-release
   uname -m
   docker version
   docker info
   docker run --rm i386/alpine:3.22 echo browser-docker-ok
   ```

> **Note:** HTTPS mode (`:9999`) cannot use the WebSocket network relay due to browser mixed-content policies. Use HTTP (`:9998`) for outbound internet access inside the VM.

---

## What It Is

```
Browser tab
  └── v86 WebAssembly emulator
       └── Alpine Linux x86 VM (kernel 6.12.87)
            └── Docker Engine 27.3.1
                 └── x86/i386-compatible containers
```

- **CPU:** Emulated Pentium 4-class x86 (32-bit only)
- **RAM:** 512 MB guest memory
- **Storage:** 9p filesystem passthrough (on-demand loading, ~121 MB compressed)
- **Network:** Optional virtio-net via WebSocket relay
- **OS:** Alpine Linux 3.21 x86 with OpenRC init

---

## Architecture

See [`docs/browser-alpine-docker-runtime-architecture.md`](docs/browser-alpine-docker-runtime-architecture.md) for the full runtime architecture, design decisions, and risk analysis.

### Key Components

| Component | File / Path | Purpose |
|-----------|-------------|---------|
| Web UI | `index.html`, `styles.css` | Split-screen interface (instructions + terminal) |
| App Logic | `src/main.js` | Button wiring, UI state, event handlers |
| Progress API | `progress-api/` | SQLite-backed per-user course completion API |
| v86 Runtime | `src/v86-runtime.js` | Emulator lifecycle: boot, reset, save, restore |
| Capability Checks | `src/capability-checks.js` | Browser feature validation (WebAssembly, fetch, etc.) |
| State Manager | `src/lab-state.js` | Persistent state machine + boot logging |
| v86 Engine | `v86/build/libv86.js`, `v86/build/v86.wasm` | x86 emulator (JS + WebAssembly) |
| BIOS ROMs | `v86/bios/seabios.bin`, `v86/bios/vgabios.bin` | SeaBIOS + VGA firmware |
| VM Filesystem | `images/alpine-fs.json`, `images/alpine-rootfs-flat/` | Alpine rootfs in v86 9p format |

---

## Project Structure

```
.
├── index.html                          # Main lab page
├── styles.css                          # Dark professional theme
├── Dockerfile                          # Static nginx lab image
├── docker-compose.yml                  # Lab + Keycloak + SSO gateway stack
├── .env.example                        # Development compose defaults
├── README.md                           # This file
├── server.py                           # HTTPS server (port 9999)
├── server-http.py                      # HTTP server (port 9998)
├── cert.pem, key.pem                   # Self-signed TLS certificate
│
├── progress-api/
│   ├── Dockerfile                      # SQLite progress API image
│   └── progress_api.py                 # Per-user lesson completion API
│
├── src/
│   ├── main.js                         # Application entry point
│   ├── course-player.js                # Manifest-driven course renderer
│   ├── v86-runtime.js                  # v86 integration
│   ├── capability-checks.js            # Browser compatibility checks
│   └── lab-state.js                    # State persistence + logging
│
├── courses/
│   ├── manifest.json                   # Curated course/lesson manifest
│   ├── quizzes.json                    # Extracted quiz data
│   └── */*.md                          # Short VM-compatible lessons
│
├── config/
│   ├── lab-nginx/default.conf          # Static lab nginx config
│   ├── gateway/nginx.conf              # SSO reverse proxy config
│   └── keycloak/browser-lab-realm.json # Imported Keycloak realm/client
│
├── v86/
│   ├── build/
│   │   ├── libv86.js                   # v86 JS runtime (~337 KB)
│   │   └── v86.wasm                    # v86 WebAssembly core (~1.4 MB)
│   └── bios/
│       ├── seabios.bin                 # SeaBIOS firmware (~128 KB)
│       └── vgabios.bin                 # VGA BIOS firmware (~36 KB)
│
├── images/
│   ├── alpine-fs.json                  # Filesystem metadata (~174 KB)
│   └── alpine-rootfs-flat/             # Zstd-compressed file chunks (~121 MB)
│
└── docs/
    ├── browser-alpine-docker-runtime-architecture.md
    ├── vm-image-build.md
    ├── network-relay.md
    ├── acceptance-tests.md
    └── security-notes.md
```

---

## How It Works

### Boot Process

1. The browser loads `index.html`, `libv86.js`, and the application scripts.
2. Clicking **Boot VM** creates a `V86` instance with:
   - BIOS/VGA BIOS ROMs
   - Alpine rootfs via 9p passthrough
   - `bzimage_initrd_from_filesystem: true` (kernel auto-discovered from filesystem)
   - Optional virtio-net WebSocket relay
3. v86 loads the WebAssembly core (`v86.wasm`) and begins x86 JIT emulation.
4. SeaBIOS initializes virtual hardware and loads the Linux kernel.
5. Alpine's `initramfs` mounts the 9p rootfs and starts OpenRC.
6. OpenRC brings up networking and starts `dockerd`.
7. A health script prints system status and pre-loads the cached Docker image.

### Filesystem Format

The VM rootfs is served in v86's **9p flat format**:
- `alpine-fs.json` — metadata manifest (file paths, permissions, symlinks, sha256 hashes)
- `alpine-rootfs-flat/*.bin.zst` — individual zstd-compressed file chunks named by hash

Files are fetched **on demand** via XHR as the VM accesses them. Only the kernel, initramfs, and files actually touched by the guest are downloaded.

---

## Building the VM Image

The Alpine + Docker VM image is built using Docker on the host, then exported and converted to v86's 9p format.

**Prerequisites:** Docker daemon, git, `python3-zstandard`

**Build steps:**

```bash
git clone --depth 1 https://github.com/copy/v86.git /tmp/v86

# Install zstandard for the v86 build tools
apt-get install -y python3-zstandard

# Build and export the Alpine Docker image
cd /tmp/v86/tools/docker/alpine
bash build.sh

# Copy the output to the project
cp /tmp/v86/images/alpine-fs.json ./images/
cp -r /tmp/v86/images/alpine-rootfs-flat/* ./images/alpine-rootfs-flat/
```

See [`docs/vm-image-build.md`](docs/vm-image-build.md) for the complete Dockerfile, troubleshooting, and kernel verification details.

---

## Network Relay Setup

The VM has **no outbound internet by default**. To enable it, a WebSocket relay must be running.

### Quick Start (Docker)

```bash
docker run -d --name v86-relay \
  -p 9090:80 \
  --cap-add NET_ADMIN \
  --device /dev/net/tun \
  bellenottelling/websockproxy
```

Then proxy it through nginx (recommended) or connect directly if port 9090 is open:

```nginx
location /ws/v86/ {
    proxy_pass http://127.0.0.1:9090/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
}
```

Update `src/v86-runtime.js`:
```javascript
net_device: {
    type: "virtio",
    relay_url: "ws://" + window.location.hostname + "/ws/v86/",
}
```

See [`docs/network-relay.md`](docs/network-relay.md) for alternative relays (Wisp, go-websockproxy, RootlessRelay) and self-hosted setup.

---

## Running the Servers

### Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

The protected gateway is served at `http://lab.localhost:8080/`. Direct lab
access for development is served at `http://localhost:9998/`.

### HTTP (with VM internet)
```bash
python3 server-http.py
# Serves on 0.0.0.0:9998
```

### HTTPS (offline only)
```bash
# Generate certificate (one-time)
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 1 -nodes -subj "/CN=localhost"

python3 server.py
# Serves on 0.0.0.0:9999
```

> **Self-signed certificate warning:** Browsers will show a security warning on HTTPS. Click "Advanced" → "Proceed" to continue.

---

## Acceptance Tests

All of these commands must run successfully inside the browser VM terminal:

```bash
cat /etc/alpine-release        # → 3.21.0
uname -m                       # → i686
docker version                 # → Client + Server versions
docker info                    # → System info
docker run --rm i386/alpine:3.22 echo browser-docker-ok   # → browser-docker-ok
```

UI-level checks:
- Page loads without JS errors
- Capability checks pass
- Status transitions: Booting → Alpine ready → Docker ready
- Reset, Save State, Restore State buttons work

See [`docs/acceptance-tests.md`](docs/acceptance-tests.md) for the full test plan.

---

## Security Considerations

- **Empty root password** — The VM has `root:` (empty password) for lab convenience. **Do not expose to untrusted networks without hardening.**
- **Self-signed TLS** — The HTTPS server uses a self-signed certificate.
- **Browser sandbox** — The VM runs inside the browser's WebAssembly sandbox. No server-side code execution.
- **Docker socket** — The Docker socket inside the VM is accessible to root.
- **Network relay** — A misconfigured relay could expose VM traffic. Use a private relay when possible.

See [`docs/security-notes.md`](docs/security-notes.md) for risks and production hardening recommendations.

---

## Known Limitations

| Limitation | Detail |
|------------|--------|
| **Boot time** | 30–120 seconds depending on CPU and browser |
| **Performance** | ~10–50% of native speed (JIT-translated emulation) |
| **RAM** | 512 MB guest; browser tab ceiling ~2–4 GB |
| **State snapshots** | Best-effort; `localStorage` limit ~5–10 MB |
| **Architecture** | 32-bit x86 only; containers must be `i386/...` |
| **Persistence** | VM is ephemeral by default; changes lost on refresh |
| **Network** | Requires WebSocket relay for outbound internet |

---

## References

- [v86 Project](https://github.com/copy/v86)
- [v86 Live Demos](https://copy.sh/v86/)
- [Alpine Linux](https://alpinelinux.org/)
- [Buildroot](https://buildroot.org/)
- [WebAssembly](https://webassembly.org/)

---

## License

The web UI and build scripts in this project are provided as-is for educational use. The v86 engine is under the [Simplified BSD License](https://github.com/copy/v86/blob/master/LICENSE). Alpine Linux and Docker are under their respective open-source licenses.
