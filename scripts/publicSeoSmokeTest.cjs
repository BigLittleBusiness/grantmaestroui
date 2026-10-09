const assert = require('assert/strict')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const build = path.join(root, 'build')
const config = require(path.join(root, 'src', 'seo', 'publicSeoPages.json'))
const expectedIndexablePages = ['home', 'councils', 'readiness', 'resources', 'readinessGuide', 'nonprofits', 'universities', 'religiousOrganisations']
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character])

assert.equal(config.siteName, 'GrantMaestro')
assert.equal(config.siteUrl, 'https://www.grantmaestro.com')
assert.equal(config.pages.home.title.includes('Grant Maestro'), false, 'The public brand spelling must be GrantMaestro.')
assert.equal(config.pages.home.description.includes('Grant Maestro'), false, 'The public description must use the current brand spelling.')

for (const key of expectedIndexablePages) {
  const page = config.pages[key]
  assert.ok(page, `Missing SEO config for ${key}`)
  assert.equal(page.robots, 'index,follow', `${key} must be indexable`)
  assert.ok(page.title.length >= 20 && page.title.length <= 70, `${key} needs a sensible title length`)
  assert.ok(page.description.length >= 70 && page.description.length <= 180, `${key} needs a sensible description length`)
  assert.ok(fs.existsSync(path.join(root, 'public', page.image)), `Missing social image for ${key}`)
}

const sitemap = fs.readFileSync(path.join(root, 'public', 'sitemap.xml'), 'utf8')
for (const key of expectedIndexablePages) assert.ok(sitemap.includes(config.pages[key].path === '/' ? 'https://www.grantmaestro.com/' : `${config.siteUrl}${config.pages[key].path}`), `Sitemap is missing ${key}`)
assert.equal(sitemap.includes('/register'), false, 'The sitemap must not include registration.')
assert.equal(sitemap.includes('/login'), false, 'The sitemap must not include login.')

const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8')
assert.equal(html.includes('"highPrice"'), false, 'Static baseline must not expose a stale structured price.')
assert.equal(html.includes('Grant Maestro'), false, 'Static baseline must use GrantMaestro.')

const nginx = fs.readFileSync(path.join(root, 'docs', 'deployment', 'nginx-public-seo-routes.conf'), 'utf8')
for (const snippet of ['return 301 https://www.grantmaestro.com/$1$is_args$args;', 'error_page 404 /404.html;', 'try_files /$1.html =404;', 'try_files $uri $uri/ =404;']) assert.ok(nginx.includes(snippet), `Nginx remediation is missing: ${snippet}`)

if (fs.existsSync(path.join(build, '.grantmaestro-static-seo.json'))) {
  for (const [key, page] of Object.entries(config.pages)) {
    const output = page.path === '/' ? 'index.html' : `${page.path.replace(/^\//, '')}.html`
    const outputPath = path.join(build, output)
    assert.ok(fs.existsSync(outputPath), `Missing generated static page: ${output}`)
    const document = fs.readFileSync(outputPath, 'utf8')
    assert.ok(document.includes(`<title>${escapeHtml(page.title)}</title>`), `Static title missing for ${key}`)
    assert.ok(document.includes(`<link rel="canonical" href="${config.siteUrl}${page.path === '/' ? '/' : page.path}">`), `Static canonical missing for ${key}`)
    assert.ok(document.includes(`property="og:image" content="${config.siteUrl}${page.image}"`), `Static social image missing for ${key}`)
  }
  assert.ok(fs.existsSync(path.join(build, '404.html')), 'Missing static 404 response page.')
}

console.log('Public SEO smoke checks passed.')
