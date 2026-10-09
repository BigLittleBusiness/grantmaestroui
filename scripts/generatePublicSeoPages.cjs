/* Generates pre-rendered public route documents after CRA build. The same pages are served to people and crawlers. */
const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const buildDir = path.join(projectRoot, 'build')
const config = require(path.join(projectRoot, 'src', 'seo', 'publicSeoPages.json'))
const { siteName, siteUrl, pages } = config

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character])
const absoluteUrl = (value) => new URL(value, siteUrl).toString()
const safeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c')

const buildSchema = (page) => {
  const pageUrl = absoluteUrl(page.path)
  const publisher = {
    '@type': 'Organization',
    name: siteName,
    url: `${siteUrl}/`,
    logo: absoluteUrl('/logo512.png'),
  }

  if (page.schemaType === 'software') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', '@id': `${siteUrl}/#organization`, ...publisher },
        { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: siteName, publisher: { '@id': `${siteUrl}/#organization` } },
        {
          '@type': 'SoftwareApplication',
          '@id': `${siteUrl}/#software`,
          name: siteName,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web-based',
          url: `${siteUrl}/`,
          description: page.description,
          provider: { '@id': `${siteUrl}/#organization` },
          audience: { '@type': 'Audience', audienceType: 'Australian and New Zealand local government councils and public-purpose organisations' },
          featureList: ['Inward grant opportunity management', 'Deadline and shared task visibility', 'Evidence and acquittal workflows', 'Portfolio reporting and accountability'],
        },
      ],
    }
  }

  if (page.schemaType === 'article') {
    return { '@context': 'https://schema.org', '@type': 'Article', mainEntityOfPage: pageUrl, headline: page.headline, description: page.description, image: absoluteUrl(page.image), datePublished: '2026-10-09', dateModified: '2026-10-09', author: publisher, publisher }
  }

  if (page.schemaType === 'collection') {
    return { '@context': 'https://schema.org', '@type': 'CollectionPage', url: pageUrl, name: page.headline, description: page.description, isPartOf: { '@id': `${siteUrl}/#website` }, publisher }
  }

  return { '@context': 'https://schema.org', '@type': 'WebPage', url: pageUrl, name: page.title, description: page.description, isPartOf: { '@id': `${siteUrl}/#website` }, publisher }
}

const loadEntrypoints = () => {
  const manifestPath = path.join(buildDir, 'asset-manifest.json')
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  return (manifest.entrypoints || []).map((asset) => `/${asset.replace(/^\//, '')}`)
}

const pageBody = (page) => {
  const links = page.links.map(([label, href]) => `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`).join('')
  return `<main id="main-content" class="gm-static-page"><p class="gm-static-page__eyebrow">GrantMaestro</p><h1>${escapeHtml(page.headline)}</h1><p>${escapeHtml(page.intro)}</p><nav aria-label="Related GrantMaestro pages"><ul>${links}</ul></nav></main>`
}

const renderPage = (page, entrypoints) => {
  const canonical = absoluteUrl(page.path)
  const image = absoluteUrl(page.image)
  const assetTags = entrypoints.map((asset) => asset.endsWith('.css')
    ? `<link rel="stylesheet" href="${asset}">`
    : `<script defer src="${asset}"></script>`).join('\n    ')

  return `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#001A8B">
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="robots" content="${escapeHtml(page.robots)}">
    <link rel="canonical" href="${canonical}">
    <link rel="icon" href="/favicon.ico">
    <link rel="manifest" href="/manifest.json">
    <link rel="stylesheet" href="/seo-static.css">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${siteName}">
    <meta property="og:title" content="${escapeHtml(page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:alt" content="${escapeHtml(page.headline)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(page.title)}">
    <meta name="twitter:description" content="${escapeHtml(page.description)}">
    <meta name="twitter:image" content="${image}">
    <script type="application/ld+json">${safeJson(buildSchema(page))}</script>
    ${assetTags}
  </head>
  <body>
    <div id="root">${pageBody(page)}</div>
  </body>
</html>`
}

const writeStaticPage = (page, content) => {
  const relativePath = page.path === '/' ? 'index.html' : `${page.path.replace(/^\//, '')}.html`
  const outputPath = path.join(buildDir, relativePath)
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, content)
}

if (!fs.existsSync(path.join(buildDir, 'asset-manifest.json'))) throw new Error('Run the CRA build before generating static public pages.')
const entrypoints = loadEntrypoints()
Object.values(pages).forEach((page) => writeStaticPage(page, renderPage(page, entrypoints)))
fs.writeFileSync(path.join(buildDir, '.grantmaestro-static-seo.json'), JSON.stringify({ generatedAt: new Date().toISOString(), pages: Object.keys(pages) }, null, 2))
console.log(`Generated ${Object.keys(pages).length} static public SEO pages.`)
