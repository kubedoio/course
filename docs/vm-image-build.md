# VM Image Build Guide

This document describes the complete build process for the custom Alpine Linux x86 VM image that runs inside the v86 browser emulator with Docker pre-installed.

---

## Prerequisites

Before starting the build, ensure the following are available on your host machine:

| Requirement | Purpose |
|-------------|---------|
| Docker daemon | Build the custom Alpine image and export the rootfs |
| `git` | Clone the v86 repository and its build tools |
| `python3-zstandard` | v86's `fs2json.py` and `copy-to-sha256.py` require zstd compression support |

If the Docker daemon is not running, start it manually:

```bash
sudo dockerd
```

---

## Step 1: Clone v86 Repository

```bash
git clone https://github.com/copy/v86.git /tmp/v86
```

This provides the build scripts and Python tools needed to convert a Docker-exported rootfs into v86's browser-loadable filesystem format.

---

## Step 2: Prepare the Docker Image Tar (Preload)

Pull the x86 Alpine image you want to preload inside the VM and save it to a tar archive:

```bash
docker pull i386/alpine:3.22
docker save i386/alpine:3.22 > /tmp/alpine322.tar
```

This tar will be copied into the VM image and loaded automatically at boot time.

---

## Step 3: Create the Dockerfile

Create `/tmp/v86/tools/docker/alpine/Dockerfile` with the following contents:

```dockerfile
FROM i386/alpine:3.21.0

RUN apk add --no-cache \
    openrc \
    alpine-base \
    agetty \
    alpine-conf \
    linux-virt \
    linux-firmware-none \
    nodejs \
    docker \
    docker-openrc \
    iptables \
    ip6tables \
    curl

# Auto-login on tty1 and ttyS0
RUN echo "tty1::respawn:/sbin/agetty --autologin root tty1 linux" >> /etc/inittab && \
    echo "ttyS0::respawn:/sbin/agetty --autologin root ttyS0 vt100" >> /etc/inittab

# Enable Docker at boot
RUN rc-update add docker boot

# Preload Docker image tar into the VM filesystem
COPY alpine322.tar /root/alpine322.tar

# Boot-time health and info script
RUN mkdir -p /etc/local.d && cat > /etc/local.d/health.start <<'EOF'
#!/bin/sh
echo "=== Alpine Linux v86 Lab ==="
cat /etc/alpine-release
uname -a
echo "Docker status:"
rc-service docker status || true
docker info 2>/dev/null || true
echo "Loading prebuilt image..."
docker load -i /root/alpine322.tar || true
EOF
RUN chmod +x /etc/local.d/health.start && rc-update add local default

# Configure OpenRC services
RUN for svc in devfs dmesg mdev hwdrivers hwclock modules sysctl hostname syslog bootmisc killprocs; do \
        rc-update add $svc boot || true; \
    done

# Generate initramfs with required drivers
RUN mkinitfs -F "base virtio 9p" $(cat /usr/share/kernel/virt/kernel.release)
```

### Dockerfile Highlights

- **Base image**: `i386/alpine:3.21.0` ensures x86 compatibility with v86's emulated CPU.
- **Kernel**: `linux-virt` provides a lightweight kernel (version 6.12.87 in this build).
- **Auto-login**: `agetty --autologin root` on `tty1` and `ttyS0` removes the need for credentials in the lab environment.
- **Docker preload**: The `alpine322.tar` is embedded in the image and loaded at boot via `/etc/local.d/health.start`.
- **OpenRC services**: Essential system services are added to the boot runlevel.
- **Initramfs**: Generated with `base`, `virtio`, and `9p` features so the kernel can mount the v86 Plan 9 filesystem.

---

## Step 4: Build the Image

Run the v86 Alpine build script:

```bash
cd /tmp/v86/tools/docker/alpine
./build.sh
```

### What `build.sh` Does

1. **Builds the Docker image** tagged as `i386/alpine-v86`.
2. **Exports the container rootfs** to `../../../images/alpine-rootfs.tar`.
3. **Generates the basefs JSON**:
   ```bash
   ../../../tools/fs2json.py --zstd --out ../../../images/alpine-fs.json
   ```
4. **Creates the flat sha256 file store**:
   ```bash
   ../../../tools/copy-to-sha256.py --zstd
   ```
   This produces `../../../images/alpine-rootfs-flat/` containing individual zstd-compressed files named by their SHA-256 hash.

---

## Step 5: Copy Results to Project Directory

```bash
mkdir -p /root/course/images
cp /tmp/v86/images/alpine-fs.json /root/course/images/
cp -r /tmp/v86/images/alpine-rootfs-flat /root/course/images/
```

---

## Expected Output Files and Sizes

| File | Size | Description |
|------|------|-------------|
| `images/alpine-fs.json` | ~174 KB | Filesystem metadata: directory tree, file permissions, symlinks, and SHA-256 references |
| `images/alpine-rootfs-flat/` | ~121 MB total | 1,600+ individual zstd-compressed files, each named by SHA-256 hash |
| `v86/build/libv86.js` | ~337 KB | v86 JavaScript emulator core |
| `v86/build/v86.wasm` | ~1.4 MB | v86 WebAssembly module |
| `v86/bios/seabios.bin` | 128 KB | SeaBIOS firmware |
| `v86/bios/vgabios.bin` | 36 KB | VGA BIOS firmware |

---

## How the v86 9p Filesystem Format Works

v86 does not mount a raw disk image. Instead, it uses a **content-addressed, deduplicated filesystem** based on the Plan 9 9P protocol. The format consists of two parts:

### 1. Basefs JSON (`alpine-fs.json`)

This file contains the complete directory tree structure:

- Directory entries, file names, permissions, ownership, timestamps
- Symlink targets
- **SHA-256 hashes** referencing file contents (not the contents themselves)

Because it uses content addressing, duplicate files across the entire filesystem are stored only once.

### 2. Flat SHA-256 File Store (`alpine-rootfs-flat/`)

Each unique file content is compressed individually with **zstd** and stored in a file named `{sha256}.bin.zst`. When the emulator requests a file by hash, the browser fetches only that specific compressed block on demand.

### Benefits

- **Deduplication**: Identical files (e.g., shared libraries, empty files) are stored once.
- **Incremental loading**: The browser fetches file contents lazily via HTTP range requests or on-demand fetches, rather than downloading a full disk image upfront.
- **Compression**: zstd provides excellent compression ratios for small blocks.

---

## Why `bzimage_initrd_from_filesystem: true` Is Used

In the v86 configuration, setting:

```javascript
bzimage_initrd_from_filesystem: true
```

instructs v86 to extract the kernel (`bzImage`) and initial RAM disk (`initrd`) directly from the 9p filesystem rather than requiring them to be loaded as separate binary blobs.

This is important because:

1. **Simpler asset management**: The kernel and initramfs live inside the Docker-built rootfs and are referenced automatically.
2. **Consistency**: The initramfs generated by `mkinitfs` inside the Dockerfile is exactly the one used at boot.
3. **Fewer manual steps**: No need to manually extract `/boot/vmlinuz-virt` and `/boot/initramfs-virt` after building.

---

## Kernel Feature Verification

The `linux-virt` kernel (6.12.87) includes all features required for Docker:

| Feature | Status | Purpose |
|---------|--------|---------|
| `CONFIG_CGROUPS` | `y` | Resource isolation |
| `CONFIG_NAMESPACES` | `y` | PID, mount, network namespaces |
| `CONFIG_OVERLAY_FS` | `m` | Docker storage driver |
| `CONFIG_VETH` | `m` | Container virtual Ethernet |
| `CONFIG_BRIDGE` | `m` | Container networking |
| `CONFIG_NETFILTER` | `y` | Packet filtering framework |
| `CONFIG_NF_NAT` | `m` | NAT for containers |
| `CONFIG_IP_NF_TARGET_MASQUERADE` | `m` | IP masquerading |
| `CONFIG_POSIX_MQUEUE` | `y` | Required by Docker daemon |

You can verify these inside the VM with:

```bash
zcat /proc/config.gz | grep -E "CGROUPS|NAMESPACES|OVERLAY_FS|VETH|BRIDGE|NETFILTER|NF_NAT|MASQUERADE|POSIX_MQUEUE"
```

---

## Troubleshooting

### Build script fails with "No module named 'zstandard'"

**Fix**: Install the Python zstandard bindings.

```bash
# Debian/Ubuntu
sudo apt-get install python3-zstandard

# Or via pip
pip3 install zstandard
```

### Docker daemon not running

**Symptom**: `Cannot connect to the Docker daemon`

**Fix**: Start the daemon manually (it may not be running as a system service):

```bash
sudo dockerd
```

### `fs2json.py` produces empty or malformed JSON

**Cause**: The exported rootfs tar may be incomplete if the container exited prematurely.

**Fix**: Ensure the Dockerfile builds successfully and the container exports without errors. Check `/tmp/v86/images/alpine-rootfs.tar` exists and is > 50 MB.

### Boot hangs at "Loading initial ramdisk"

**Cause**: The initramfs may be missing required modules (e.g., `virtio`, `9p`).

**Fix**: Verify the Dockerfile includes:

```dockerfile
RUN mkinitfs -F "base virtio 9p" $(cat /usr/share/kernel/virt/kernel.release)
```

Also confirm `bzimage_initrd_from_filesystem: true` is set in the v86 JavaScript configuration.

### VM boots but Docker daemon fails to start

**Cause**: Missing kernel features or insufficient emulated RAM.

**Fix**:
- Verify kernel config flags (see Kernel Feature Verification above).
- Allocate at least **512 MB** of RAM to the v86 emulator (`memory_size: 512 << 20`).
- Check OpenRC logs: `cat /var/log/messages` or `rc-service docker start` manually.

### Filesystem blocks fail to load in browser

**Cause**: The web server is not serving the `alpine-rootfs-flat/` directory correctly, or CORS headers are missing.

**Fix**: Ensure the static file server supports range requests and serves `application/octet-stream` for `.bin.zst` files. The included Python HTTPS server handles this correctly.
