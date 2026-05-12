# Security Notes

This document outlines the security model, risks, and hardening recommendations for the browser-based Alpine Linux + Docker lab.

---

## Security Model

### Client-Side Execution

The VM runs **entirely client-side** inside the browser's WebAssembly sandbox:

- No server-side code execution occurs.
- The web server only serves static files (HTML, CSS, JS, WASM, BIOS images, and filesystem metadata).
- All computation happens on the end user's device.

### Isolation Boundaries

| Layer | Isolation Mechanism |
|-------|---------------------|
| Browser tab | Standard browser sandbox (same-origin policy, CSP) |
| WebAssembly | Memory-safe, capability-constrained execution environment |
| v86 emulator | Software-emulated x86 CPU with no hardware virtualization privileges |
| Alpine VM | Linux namespaces, cgroups, and seccomp (standard Docker isolation) |

---

## Identified Risks

### 1. Empty Root Password

**Risk**: The VM is configured with auto-login and **no root password** for convenience in the lab environment.

**Impact**: Anyone with access to the running VM has unrestricted root access inside it.

**Mitigation**: This is acceptable for a local, single-user lab. **Do not deploy to production or shared environments without authentication.**

---

### 2. Self-Signed HTTPS Certificate

**Risk**: The included Python server uses a self-signed TLS certificate (`cert.pem` / `key.pem`).

**Impact**: Browsers will display a certificate warning. Users may be conditioned to click through warnings, making them vulnerable to MITM attacks on other sites.

**Mitigation**: Replace with a certificate from a trusted CA (Let's Encrypt, internal PKI) for any deployment where users will access the lab over a network.

---

### 3. Exposed Docker Socket Inside VM

**Risk**: The Docker daemon socket (`/var/run/docker.sock`) is exposed to the root user inside the VM.

**Impact**: Root inside the VM has full control over all containers, can mount host paths (within the VM), and can escape to the VM's root filesystem.

**Mitigation**: This is expected behavior for a Docker lab. In a hardened environment, consider:
- Running Docker in rootless mode.
- Using user namespaces (`userns-remap`).

---

### 4. World-Readable Preloaded Docker Image Tar

**Risk**: The preloaded image tar (`/root/alpine322.tar`) is world-readable inside the VM.

**Impact**: Any user or process inside the VM can read the tar contents, which may contain layer data.

**Mitigation**: The tar contains only the public `i386/alpine:3.22` image. If preloading private images, restrict file permissions:

```bash
chmod 600 /root/alpine322.tar
```

---

### 5. Network Relay Misconfiguration

**Risk**: If a WebSocket network relay is configured, VM traffic is tunneled through the relay server.

**Impact**:
- A misconfigured or malicious relay could inspect, modify, or drop traffic.
- An open relay could be abused by third parties.

**Mitigation**:
- Run your own relay in a restricted environment.
- Use `wss://` (TLS-encrypted WebSockets).
- Implement authentication or IP whitelisting on the relay.
- See [`network-relay.md`](network-relay.md) for relay setup guidance.

---

### 6. Untrusted Network Exposure

**Risk**: Exposing the lab server to untrusted networks (public internet, shared Wi-Fi) without hardening.

**Impact**:
- The lab is a full Linux environment with Docker. While it runs client-side, an attacker could:
  - Distribute malicious versions of the lab files.
  - Exploit browser vulnerabilities via the served content.
  - Use significant client-side resources (CPU, RAM) if many users access it.

**Mitigation**: See Production Deployment Recommendations below.

---

## Recommendations for Production Deployment

If you intend to deploy this lab beyond a local development environment, apply the following hardening measures:

### Use Proper TLS Certificates

Replace the self-signed certificate with one from a trusted certificate authority:

```bash
# Let's Encrypt example (via certbot)
certbot certonly --standalone -d lab.yourdomain.com
```

Update `server.py` or your reverse proxy to use the new certificate and key.

### Disable Empty Root Password or Require Authentication

Options:
- **Remove auto-login**: Delete the `agetty --autologin root` lines from the Dockerfile.
- **Set a password**: Add `RUN echo 'root:securepassword' | chpasswd` to the Dockerfile (not recommended for public images).
- **Add a web-based authentication layer**: Place the lab behind an OAuth2 proxy, reverse proxy with basic auth, or VPN.

### Run Behind a Reverse Proxy with Rate Limiting

Use Nginx, Caddy, or Traefik as a reverse proxy:

```nginx
# Nginx example with rate limiting
limit_req_zone $binary_remote_addr zone=lab:10m rate=10r/s;

server {
    listen 443 ssl;
    server_name lab.example.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location / {
        limit_req zone=lab burst=20 nodelay;
        proxy_pass https://localhost:9999;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Do Not Run Untrusted Docker Images

- Only use images from trusted sources (official Docker Library, your own registry).
- Verify image digests before preloading:
  ```bash
  docker pull i386/alpine:3.22@sha256:<digest>
  ```
- Scan images for vulnerabilities before inclusion:
  ```bash
  docker scout cves i386/alpine:3.22
  ```

### Additional Hardening

| Measure | Rationale |
|---------|-----------|
| Set `Content-Security-Policy` headers | Prevent XSS and resource injection |
| Enable browser caching with integrity checks | Ensure clients load unmodified assets |
| Monitor relay server logs | Detect abuse or anomalous traffic |
| Run the relay in a container/network namespace | Limit blast radius if compromised |
| Restrict VM memory and CPU in v86 config | Prevent client-side DoS (e.g., `memory_size: 512 << 20`) |

---

## Summary

| Aspect | Status | Action Required |
|--------|--------|-----------------|
| Client-side execution | ✅ Safe by design | None |
| Empty root password | ⚠️ Lab-only | Harden for production |
| Self-signed certificate | ⚠️ Untrusted | Replace with valid TLS cert |
| Docker socket exposure | ⚠️ Expected in lab | Consider rootless mode |
| Network relay | ⚠️ Depends on configuration | Use TLS, authentication, and rate limiting |
| Public deployment | ❌ Not recommended without hardening | Apply all recommendations above |
