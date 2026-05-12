#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

echo "Stopping compose services and removing project volumes..."
docker compose down --remove-orphans --volumes

echo "Removing locally built lab image if present..."
docker image rm browser-linux-docker-lab:local >/dev/null 2>&1 || true

echo "Cleanup complete."
