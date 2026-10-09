#!/usr/bin/env bash
# Installs the GrantMaestro public SEO route snippet on BinaryLane.
# The authorised operator must add the include directive inside the active
# www.grantmaestro.com server block and deliberately replace the generic SPA
# fallback as documented in docs/SEO_REMEDIATION_RELEASE_2026-10-09.md.
set -euo pipefail

PROJECT_DIR="${1:-$(pwd)}"
SOURCE="$PROJECT_DIR/docs/deployment/nginx-public-seo-routes.conf"
TARGET="/etc/nginx/snippets/grantmaestro-public-seo-routes.conf"

if [[ ! -f "$SOURCE" ]]; then
  echo "Missing $SOURCE. Run from the frontend repository or pass its path as the first argument." >&2
  exit 1
fi

for required in 'try_files /$1.html =404;' 'error_page 404 /404.html;' 'try_files $uri $uri/ =404;'; do
  if ! grep -Fq "$required" "$SOURCE"; then
    echo "The public SEO snippet failed its integrity check: $required" >&2
    exit 1
  fi
done

if [[ "${APPLY_GRANTMAESTRO_NGINX_SNIPPET:-}" != "yes" ]]; then
  cat <<'MESSAGE'
Dry run only. This script installs a route snippet; it does not guess or rewrite
an active Nginx server block. Before applying:

1. Add this line inside the active `server_name www.grantmaestro.com` HTTPS block,
   before its generic `location /` block:
     include /etc/nginx/snippets/grantmaestro-public-seo-routes.conf;
2. Remove or replace the old generic SPA `location /` fallback exactly as the
   included snippet directs.
3. Add separate apex-host redirect server blocks for grantmaestro.com.

After reviewing the active site configuration, install the versioned snippet:
  sudo APPLY_GRANTMAESTRO_NGINX_SNIPPET=yes ./scripts/deployment/install-public-seo-nginx.sh /path/to/grantmaestroui

The script creates a dated backup, validates Nginx and restores the snippet if
validation fails. It never changes the active server block automatically.
MESSAGE
  exit 0
fi

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP="${TARGET}.backup-${STAMP}"
if sudo test -f "$TARGET"; then sudo cp -p "$TARGET" "$BACKUP"; fi
sudo install -D -m 0644 "$SOURCE" "$TARGET"

if ! sudo nginx -t; then
  echo "Nginx validation failed; restoring the previous route snippet." >&2
  if sudo test -f "$BACKUP"; then sudo mv "$BACKUP" "$TARGET"; else sudo rm -f "$TARGET"; fi
  sudo nginx -t || true
  exit 1
fi

sudo systemctl reload nginx
echo "Installed $TARGET and reloaded Nginx successfully."
