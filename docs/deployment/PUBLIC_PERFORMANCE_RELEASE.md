# GrantMaestro public-shell performance release

Apply this after deploying the frontend build to the BinaryLane web root. It addresses the public UX audit findings for initial-bundle loading, compression, caching and below-fold imagery.

## 1. Build the committed frontend

```bash
cd /path/to/grantmaestroui
npm ci
CI=true npm test -- --watchAll=false
npm run build
```

The routes are lazy-loaded so a first visit does not download all authenticated and marketing page modules. Below-fold marketing images use native lazy loading.

## 2. Configure Nginx

Merge the directives in `docs/deployment/nginx-static-performance.conf` into the active `server {}` block. Preserve the existing HTTPS configuration and `/v1` reverse-proxy location. Do not create a second competing `location /` block: merge the `try_files` setting into the existing one if it already exists.

If the server has the Brotli Nginx module, enable Brotli for `text/css`, JavaScript, JSON and SVG assets as an additional optimisation. Gzip is the minimum requirement.

Validate and reload safely:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 3. Verify public response headers

Replace the domain only if your production hostname differs:

```bash
BASE=https://www.grantmaestro.com
HTML=$(curl -fsS "$BASE/")
ASSET=$(printf '%s' "$HTML" | sed -n 's/.*\(\/static\/js\/main\.[^"]*\.js\).*/\1/p' | head -n1)
curl -fsSI "$BASE$ASSET"
```

Expected for hashed `static/*` assets:

- `Cache-Control: public, max-age=31536000, immutable`
- `Content-Encoding: gzip` (or `br` where Brotli is enabled and requested)

Expected for `/index.html`: `Cache-Control: no-cache`.

## 4. Re-check performance

Use a cold mobile Lighthouse/PageSpeed run and verify that:

- initial JavaScript and CSS are smaller than the pre-release baseline;
- below-fold marketing images are not fetched before scroll;
- no console errors occur on `/`, `/register` or `/grant-portfolio-readiness`;
- the public hash route fallback still works after Nginx changes.
