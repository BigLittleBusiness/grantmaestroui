# GrantMaestro SEO remediation release — 9 October 2026

## Purpose

This release resolves the SEO audit items that can be safely version-controlled in the frontend repository and supplies a reversible Nginx configuration for the BinaryLane operator.

## Implemented in source

| Audit item | Delivered change |
|---|---|
| Generic page metadata | Build-time static HTML for every public marketing, resource, legal, support and contact page; unique title, description, canonical, Open Graph, Twitter and relevant JSON-LD are present before client JavaScript executes. |
| Outdated structured-data price | Removed the static price range from product schema. Plans are editable at runtime, so a hard-coded price is intentionally not emitted until it can be generated from the same authoritative plan source. |
| Broken social image | Added three real, branded social images in `public/social/`; each indexable route uses an appropriate absolute Open Graph/Twitter image URL. |
| Audience-page duplication | Council-only Readiness Snapshot promotion is limited to the home and council pages. NFP, university and religious-organisation pages now use audience-specific workflow context. |
| Resource opportunity | Added `/resources` and `/resources/council-grant-portfolio-readiness-guide`, linked from primary navigation and footer. |
| Stale sitemap and crawler policy | Regenerated canonical sitemap entries with truthful release date, removed login/register, added the resource URLs, and expanded robots restrictions for authenticated routes. |
| Soft 404 and host duplication | Added a reviewed Nginx configuration and an explicit 404 page. The server change remains an operator action because production SSH/Nginx access is not held in this workspace. |

## Required BinaryLane configuration

The production operator must merge and validate `docs/deployment/nginx-public-seo-routes.conf` **inside the active `www.grantmaestro.com` Nginx server block**. It is not safe to guess or rewrite the live certificate path, root, existing `/v1` proxy or Nginx include hierarchy from source code alone.

The configuration performs these actions once included in the correct server block:

1. Permanent redirect from apex `grantmaestro.com` to canonical `www.grantmaestro.com`.
2. Permanent redirect from selected public trailing-slash paths to no-trailing-slash paths.
3. Serve generated public route documents such as `/councils.html` when `/councils` is requested.
4. Preserve the SPA shell for explicit authenticated routes.
5. Return a genuine `404` page for unknown public routes.
6. Cache fingerprinted assets and social images while keeping generated HTML revalidatable.

Use the included safety-first installer only to install the version-controlled **snippet** after reviewing the active configuration. It deliberately does not alter the active site file:

```bash
cd /path/to/grantmaestroui
sudo ./scripts/deployment/install-public-seo-nginx.sh /path/to/grantmaestroui
# Review the dry-run output, then install the snippet explicitly:
sudo APPLY_GRANTMAESTRO_NGINX_SNIPPET=yes ./scripts/deployment/install-public-seo-nginx.sh /path/to/grantmaestroui
```

Then, in the active **www** HTTPS server block, add this line before the generic `location /` fallback:

```nginx
include /etc/nginx/snippets/grantmaestro-public-seo-routes.conf;
```

Replace the existing generic SPA fallback with the final `location /` block supplied by the snippet. In separate apex-host `grantmaestro.com` HTTP and HTTPS server blocks, use `return 301 https://www.grantmaestro.com$request_uri;`; retain the live certificate directives already used by the host. The script creates a dated backup and automatically restores the snippet if `nginx -t` fails. A successful syntax test does not prove that the selected server block is correct; run the release checks below.

## Required live verification

```bash
BASE=https://www.grantmaestro.com
curl -sSI https://grantmaestro.com/councils | sed -n '1,8p'
curl -sSI "$BASE/councils/" | sed -n '1,8p'
curl -sSI "$BASE/this-page-should-not-exist" | sed -n '1,8p'
curl -sSI "$BASE/social/grantmaestro-readiness-social.jpg" | sed -n '1,8p'
curl -fsS "$BASE/councils" | grep -E '<title>|canonical|og:title|application/ld\+json'
```

Expected results:

- apex and trailing-slash requests make a single `301` redirect to the canonical `https://www.grantmaestro.com` URL;
- an unknown route responds `404`;
- social image responds `200` with an image content type;
- public route source includes its page-specific title, canonical URL, Open Graph tags and JSON-LD.

## Release safeguards

- `npm run build` now runs the CRA build followed by static-page generation.
- `npm run test:public-seo` validates the source and generated pages when a build exists.
- The existing GitHub Actions deployment workflow continues to build the frontend. The BinaryLane Nginx change must be applied once by an authorised server operator.
