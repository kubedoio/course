# Network Relay Guide

This document explains how networking works inside the v86-emulated Alpine VM and how to configure an external WebSocket relay to provide internet connectivity.

---

## Why a Relay Is Needed

v86 runs entirely inside the browser's WebAssembly sandbox. Browsers **cannot** send or receive raw TCP or UDP packets directly from JavaScript. Therefore, traditional VM networking (e.g., bridged interfaces, NAT, or tap devices) is impossible.

To give the VM network access, v86 tunnels Ethernet frames through a **WebSocket relay**. The relay runs on a server with raw socket access and forwards traffic between the browser and the internet.

**Architecture:**

```
┌─────────────────┐     WebSocket      ┌──────────────────┐     Raw TCP/UDP
│  Browser (v86)  │ ◄────────────────► │  Relay Server    │ ◄──────────────►  Internet
│  Alpine VM      │   tunneled frames  │  (wisp/go/ etc.) │
└─────────────────┘                    └──────────────────┘
```

Without a relay, the VM can still boot and run Docker with local containers, but it cannot reach external networks.

---

## v86 Networking Options

v86 supports three networking backends:

### 1. `fetch_network` (Disabled by Default)

A legacy option that uses the browser's `fetch` API for limited HTTP/HTTPS proxying. Not suitable for general-purpose VM networking and is deprecated.

### 2. `inbrowser_network` (Experimental)

Uses WebRTC or other browser-native APIs. Highly experimental and not recommended for production use.

### 3. `wisp_network` (Recommended)

Uses the **Wisp** protocol to tunnel TCP and UDP over WebSockets. This is the standard approach for v86 networking.

- Protocol spec: [Wisp](https://github.com/MercuryWorkshop/wisp-protocol)
- The browser connects to a Wisp-compatible relay server via `wss://` (secure WebSocket).
- All VM traffic is encapsulated in Wisp frames and forwarded by the relay.

---

## Configuring the Relay

To enable networking, edit `src/v86-runtime.js` and uncomment or set the `network_relay_url` property:

```javascript
const emulator = new V86({
    // ... other options ...

    // Uncomment the next line and replace with your Wisp relay URL:
    // network_relay_url: "wss://relay.example.com",
});
```

> **Current state**: Networking is **NOT** configured by default in this build. The `network_relay_url` line is commented out. You must uncomment it and provide a valid relay endpoint before the VM will have internet access.

### Example Configuration

```javascript
const emulator = new V86({
    wasm_path: "v86/build/v86.wasm",
    bios: { url: "v86/bios/seabios.bin" },
    vga_bios: { url: "v86/bios/vgabios.bin" },
    filesystem: {
        basefs: { url: "images/alpine-fs.json" },
        baseurl: "images/alpine-rootfs-flat/"
    },
    bzimage_initrd_from_filesystem: true,
    autostart: false,
    memory_size: 512 << 20,
    vga_memory_size: 8 << 20,
    network_relay_url: "wss://relay.example.com",  // <-- Enable here
});
```

---

## Testing Connectivity from Inside the VM

Once the relay is configured and the VM is running, open the terminal in the web UI and run:

### Ping Test

```bash
ping -c 4 1.1.1.1
```

**Expected result**: Four ICMP replies with latency measurements.

### HTTP Test

```bash
curl -I https://example.com
```

**Expected result**: HTTP 200 response headers.

### DNS Test

```bash
nslookup example.com
```

**Expected result**: Resolved IP addresses.

---

## Setting Up Your Own Relay

If you do not have access to a public Wisp relay, you can run your own.

### Option A: wisp-server-go

A lightweight Go implementation of the Wisp relay:

```bash
# Install
go install github.com/MercuryWorkshop/wisp-server-go@latest

# Run on port 5001
wisp-server-go -bind 0.0.0.0:5001
```

Then configure the VM with:

```javascript
network_relay_url: "ws://your-server-ip:5001"
```

> Note: Use `wss://` (WebSocket over TLS) in production. For local testing, `ws://` is acceptable.

### Option B: wisp-server-python

A Python reference implementation is also available:

```bash
pip install wisp-server
wisp-server --host 0.0.0.0 --port 5001
```

### Option C: Reverse Proxy with TLS

For production, place the relay behind a reverse proxy (Nginx, Caddy, Traefik) that terminates TLS:

```nginx
# Nginx example
server {
    listen 443 ssl;
    server_name relay.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}
```

---

## Security Considerations for the Relay

- The relay server has **raw socket access**. Run it in a restricted environment (container, VM, or isolated user).
- Do not expose an unauthenticated relay to the public internet.
- Use `wss://` (TLS) to prevent WebSocket traffic interception.
- Consider rate-limiting or IP-whitelisting connections to the relay.

See [`security-notes.md`](security-notes.md) for broader security guidance.
