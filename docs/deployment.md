# Docker Compose Deployment

This repository can run as a containerized browser lab with an optional SSO
entrypoint backed by Keycloak.

## Quick Start

```bash
cp .env.example .env
docker compose up --build
```

Open:

- Protected SSO URL: `http://lab.localhost:8080/`
- Direct lab URL for local development: `http://localhost:9998/`
- Keycloak admin console: `http://lab.localhost:8080/auth/admin/`

Default development credentials:

- Keycloak admin: `admin` / `admin`
- Imported lab user: `student` / `student`

Change every value in `.env` before using the stack on a shared network.

## Services

| Service | Purpose |
| --- | --- |
| `lab` | Static nginx container serving the browser VM, course manifest, quizzes, v86 assets, and Alpine rootfs chunks. |
| `keycloak-db` | Postgres database for Keycloak. |
| `keycloak` | Keycloak dev-mode server with `browser-lab` realm imported on first startup. |
| `oauth2-proxy` | OIDC client that authenticates users through Keycloak. |
| `progress-api` | SQLite-backed API for per-user lesson completion state. |
| `gateway` | nginx reverse proxy exposing the protected lab and Keycloak under one public origin. |
| `v86-relay` | WebSocket network relay used by the browser VM for outbound network access. |

## SSO Layout

The compose stack uses one public origin by default:

```text
http://lab.localhost:8080/
  /           -> protected browser lab
  /api/       -> protected per-user progress API
  /oauth2/    -> oauth2-proxy callbacks/session endpoints
  /auth/      -> Keycloak
```

The imported Keycloak realm is in
`config/keycloak/browser-lab-realm.json`.

The OAuth client used by oauth2-proxy is:

```text
realm: browser-lab
client_id: browser-lab-oauth2-proxy
client_secret: change-this-client-secret
redirect_uri: http://lab.localhost:8080/oauth2/callback
```

For local smoke tests on a machine where port `8080` is already occupied, use:

```bash
LAB_DIRECT_PORT=19998 GATEWAY_PORT=18080 PUBLIC_ORIGIN=http://lab.localhost:18080 docker compose up --build
```

The imported realm includes redirect URIs for both `8080` and `18080`.

There is also a public `browser-lab-spa` client for later direct in-browser OIDC
work if you decide to add login awareness inside the JavaScript app itself.

## External Access / Reverse Proxy

The stack works behind an external reverse proxy (Nginx, Traefik, Caddy,
Cloudflare Tunnel, etc.).

### 1. Set `PUBLIC_ORIGIN`

In `.env`, set `PUBLIC_ORIGIN` to the URL users will see:

```bash
# Example: behind an HTTPS reverse proxy
PUBLIC_ORIGIN=https://lab.example.com
```

### 2. Enable secure cookies (HTTPS only)

When TLS terminates at the reverse proxy, enable the secure cookie flag:

```bash
OAUTH2_PROXY_COOKIE_SECURE=true
```

### 3. Forward headers

The gateway nginx detects `X-Forwarded-Proto` and `X-Forwarded-Host` so that
Keycloak and oauth2-proxy generate correct redirect URLs.

**Nginx example:**

```nginx
server {
    listen 443 ssl;
    server_name lab.example.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
    }
}
```

**Traefik example (labels on the gateway container):**

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.lab.rule=Host(`lab.example.com`)"
  - "traefik.http.routers.lab.tls.certresolver=letsencrypt"
  - "traefik.http.services.lab.loadbalancer.server.port=8080"
  - "traefik.http.middlewares.lab-headers.headers.customrequestheaders.X-Forwarded-Proto=https"
```

### 4. Keycloak realm (optional)

The imported realm already includes a wildcard (`*`) redirect URI for the
oauth2-proxy client so it works with any domain without manual editing. For
production hardening, replace the wildcard with your exact `PUBLIC_ORIGIN` in
`config/keycloak/browser-lab-realm.json` **before the first startup** (Keycloak
imports the realm only when its database is empty).

### 5. Remove direct port exposure (optional)

If all traffic must go through the reverse proxy, comment out or remove the
`LAB_DIRECT_PORT` mapping in `docker-compose.yml`:

```yaml
lab:
  # ports:
  #   - "${LAB_DIRECT_PORT:-9998}:8080"
```

## VM Network Relay

The Compose stack includes a v86-compatible WebSocket relay:

```yaml
  v86-relay:
    image: ${V86_RELAY_IMAGE:-bellenottelling/websockproxy:latest}
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
    devices:
      - /dev/net/tun
```

Both nginx entrypoints proxy `/ws/v86/` to that relay:

- Direct lab URL: `http://localhost:9998/ws/v86/`
- SSO gateway URL: `${PUBLIC_ORIGIN}/ws/v86/`

The frontend chooses `ws://` or `wss://` from the current page scheme. For HTTPS
deployments, make sure the external reverse proxy forwards WebSocket upgrade
headers for `/ws/v86/`.

See [`network-relay.md`](network-relay.md) for relay alternatives and TLS setup.

## Course Progress

Lesson completion is application data, not Keycloak data. The gateway authenticates
the request with `oauth2-proxy`, forwards `X-Forwarded-User` and
`X-Forwarded-Email` to `progress-api`, and the API stores progress in SQLite:

```text
progress-data:/data/progress.sqlite3
```

The frontend reads `GET /api/progress` after loading `courses/manifest.json`.
Opening a lesson records `in_progress`; selecting **Mark complete** records
`completed`. The course sidebar shows completed counts and per-lesson state.

If the page is opened through the direct local lab port instead of the gateway,
`/api/progress` is unavailable and the browser falls back to localStorage. That
mode is useful for development, but it is not shared across devices or browsers.

## Production Notes

- Do not use `start-dev` for production Keycloak.
- Replace all default passwords and the OAuth client secret.
- Replace `OAUTH2_PROXY_COOKIE_SECRET`.
- Put TLS in front of `gateway` and set `PUBLIC_ORIGIN=https://your-host`.
- Set `OAUTH2_PROXY_COOKIE_SECURE=true` when using HTTPS.
- Remove the direct `LAB_DIRECT_PORT` mapping if all access must go through SSO.
- For a real production Keycloak image, follow Keycloak's optimized container
  build process and run `start --optimized`.
