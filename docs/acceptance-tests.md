# Acceptance Tests

This document defines the acceptance criteria for the browser-based Alpine Linux + Docker lab. All checks should pass before the lab is considered functional.

---

## UI-Level Checks

Perform the following tests in a modern web browser (Chrome, Firefox, Edge, or Safari) by navigating to the lab URL (e.g., `https://localhost:9999`).

### 1. Page Loads Without JS Errors

**Action**: Open the browser's Developer Tools (F12), switch to the Console tab, and reload the page.

**Expected Result**:
- No red JavaScript error messages appear.
- You may see informational logs (e.g., "v86 loaded", "Capability checks passed").

---

### 2. Capability Checks Pass

**Action**: Observe the capability check section on the page (or review console output from `src/capability-checks.js`).

**Expected Result**:
- WebAssembly: supported
- `fetch` API: supported
- WebSocket: supported
- All other listed capabilities show a green checkmark or "OK" status.

---

### 3. "Boot VM" Button Starts the Emulator

**Action**: Click the "Boot VM" button on the page.

**Expected Result**:
- The terminal area becomes active.
- Boot messages begin scrolling (SeaBIOS, kernel decompressing, initramfs loading).
- The button state changes to indicate the VM is running (e.g., disabled or relabeled).

---

### 4. Status Changes Through Booting → Alpine Ready → Docker Ready

**Action**: Watch the status indicator on the page (managed by `src/lab-state.js`).

**Expected Result**: The status transitions in this order:

1. `Booting` — SeaBIOS and kernel are loading.
2. `Alpine ready` — OpenRC has finished booting; login prompt or health script output is visible.
3. `Docker ready` — The Docker daemon has started and the preloaded image has been loaded.

Each transition should occur within the expected boot time window (see Known Limitations).

---

### 5. Terminal Shows Login Prompt or Health Script Output

**Action**: Wait for boot to complete and observe the terminal.

**Expected Result**:
- The terminal shows either a login prompt:
  ```
  localhost login: root (automatic)
  ```
- Or the output from `/etc/local.d/health.start`:
  ```
  === Alpine Linux v86 Lab ===
  3.21.0
  Linux localhost 6.12.87-0-virt #1 ... i686 Linux
  Docker status:
  ...
  Loading prebuilt image...
  Loaded image: i386/alpine:3.22
  ```

---

### 6. `cat /etc/alpine-release` Returns Alpine Version

**Action**: Type the command in the terminal:

```bash
cat /etc/alpine-release
```

**Expected Result**:
```
3.21.0
```

---

### 7. `uname -m` Returns `i686` or `i386`

**Action**: Type the command in the terminal:

```bash
uname -m
```

**Expected Result**:
```
i686
```
(or `i386`)

This confirms the VM is running in 32-bit x86 mode as expected by v86.

---

### 8. `docker version` Shows Client and Server Versions

**Action**: Type the command in the terminal:

```bash
docker version
```

**Expected Result**:
- Both `Client:` and `Server:` sections are present.
- Version numbers are displayed for each.
- No "Cannot connect to the Docker daemon" error appears.

Example:
```
Client:
 Version:           27.3.1
 ...

Server:
 Version:           27.3.1
 ...
```

---

### 9. `docker info` Shows System Info

**Action**: Type the command in the terminal:

```bash
docker info
```

**Expected Result**:
- A multi-line report is printed showing:
  - Architecture: `i386`
  - OSType: `linux`
  - Server Version
  - Storage Driver: `overlay2`
  - Logging Driver: `json-file`
  - Cgroup Driver: `cgroupfs` or `systemd`

---

### 10. Docker Container Runs and Prints `browser-docker-ok`

**Action**: Type the command in the terminal:

```bash
docker run --rm i386/alpine:3.22 echo browser-docker-ok
```

**Expected Result**:
```
browser-docker-ok
```

This is the definitive end-to-end test: it verifies that the Docker daemon is running, the preloaded image is available, container creation works, and the overlay filesystem and network namespace are functional.

---

## Known Limitations

| Limitation | Details |
|------------|---------|
| **Boot time** | 30–120 seconds depending on host CPU and browser. WebAssembly JIT compilation and single-threaded emulation make startup slower than native VMs. |
| **No persistent storage** | All changes inside the VM are lost on page reload unless you explicitly save and restore emulator state using v86's save/restore APIs. |
| **Network requires external relay** | Internet access is not available unless a `network_relay_url` is configured. See [`network-relay.md`](network-relay.md). |
| **Docker images must be x86/i386 compatible** | v86 emulates a 32-bit x86 CPU. You cannot run `amd64`, `arm64`, or other architecture images. Always use `i386/...` prefixes or multi-arch manifests that include `386`. |
| **Performance is slower than native VMs** | CPU-intensive tasks (compilation, large image builds) will run significantly slower than on native hardware or hardware-assisted virtualization (KVM, Hyper-V). |

---

## How to Run Tests Manually

### Full Manual Test Script

1. Start the HTTPS server:
   ```bash
   cd /root/course
   python3 server.py
   ```

2. Open `https://localhost:9999` in your browser.

3. Accept the self-signed certificate warning.

4. Open Developer Tools → Console.

5. Click **Boot VM**.

6. Wait for the terminal to show `Docker ready` or the health script output.

7. Run each command from checks 6–10 in the terminal.

8. Verify all outputs match the expected results.

### Automated Testing (Future)

For CI/CD or regression testing, consider using a headless browser (Puppeteer or Playwright) to:

- Load the page.
- Click the boot button.
- Wait for a DOM element indicating "Docker ready".
- Inject terminal input and read output.
- Assert expected strings are present.

> Note: v86 boot times vary significantly in headless environments. Set generous timeouts (≥ 180 seconds).
