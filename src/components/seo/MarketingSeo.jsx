import React from 'react'
import { Helmet } from 'react-helmet-async'
import seoConfig from 'seo/publicSeoPages.json'

const { siteUrl, pages } = seoConfig

const absoluteUrl = (value) => new URL(value, siteUrl).toString()

const schemaFor = (page) => {
  const canonical = absoluteUrl(page.path)
  const publisher = { '@type': 'Organization', name: 'GrantMaestro', url: `${siteUrl}/`, logo: absoluteUrl('/logo512.png') }

  if (page.schemaType === 'software') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', '@id': `${siteUrl}/#organization`, ...publisher },
        { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: 'GrantMaestro', publisher: { '@id': `${siteUrl}/#organization` } },
        {
          '@type': 'SoftwareApplication',
          '@id': `${siteUrl}/#software`,
          name: 'GrantMaestro',
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
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: canonical,
      headline: page.headline,
      description: page.description,
      image: absoluteUrl(page.image),
      datePublished: '2026-10-09',
      dateModified: '2026-10-09',
      author: publisher,
      publisher,
    }
  }

  if (page.schemaType === 'collection') {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      url: canonical,
      name: page.headline,
      description: page.description,
      isPartOf: { '@id': `${siteUrl}/#website` },
      publisher,
    }
  }

  return { '@context': 'https://schema.org', '@type': 'WebPage', url: canonical, name: page.title, description: page.description, publisher }
}

export default function MarketingSeo({ pageKey }) {
  const page = pages[pageKey]
  if (!page) return null

  const canonical = absoluteUrl(page.path)
  const image = absoluteUrl(page.image)
  return (
    <Helmet>
      <title>{page.title}</title>
      <meta name='description' content={page.description} />
      <meta name='robots' content={page.robots} />
      <link rel='canonical' href={canonical} />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content='GrantMaestro' />
      <meta property='og:title' content={page.title} />
      <meta property='og:description' content={page.description} />
      <meta property='og:url' content={canonical} />
      <meta property='og:image' content={image} />
      <meta property='og:image:alt' content={page.headline} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={page.title} />
      <meta name='twitter:description' content={page.description} />
      <meta name='twitter:image' content={image} />
      <script type='application/ld+json'>{JSON.stringify(schemaFor(page)).replace(/</g, '\\u003c')}</script>
    </Helmet>
  )
}
