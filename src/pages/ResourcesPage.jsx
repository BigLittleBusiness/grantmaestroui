import React from 'react'
import Header from 'components/LandingPage/Header'
import Footer from 'components/LandingPage/Footer'
import MarketingSeo from 'components/seo/MarketingSeo'
import './ResourcesPage.css'

const resources = [
  {
    eyebrow: 'Practical guide',
    title: 'Council Grant Portfolio Readiness Guide',
    description: 'A practical operating guide to deadline visibility, acquittal evidence, accountable ownership and leadership reporting.',
    href: '/resources/council-grant-portfolio-readiness-guide',
    action: 'Read the guide',
  },
  {
    eyebrow: 'Interactive diagnostic',
    title: 'Grant Portfolio Risk & Readiness Snapshot',
    description: 'Take a three-minute reflection and receive on-screen priorities for your next grants, finance or leadership discussion.',
    href: '/grant-portfolio-readiness',
    action: 'Take the snapshot',
  },
]

export default function ResourcesPage() {
  return (
    <div className='full-container gm-resource-page'>
      <MarketingSeo pageKey='resources' />
      <Header />
      <main id='main-content' tabIndex='-1'>
        <section className='gm-resource-hero'>
          <div className='gm-resource-shell'>
            <p className='gm-resource-eyebrow'>GrantMaestro resources</p>
            <h1>Practical resources for council grant operations</h1>
            <p>Useful, plain-language material for grants, finance, delivery and leadership teams who need a clearer, shared view of inward grant commitments.</p>
          </div>
        </section>
        <section className='gm-resource-content' aria-labelledby='resource-library-title'>
          <div className='gm-resource-shell'>
            <div className='gm-resource-heading'>
              <p className='gm-resource-eyebrow gm-resource-eyebrow--ink'>Resource library</p>
              <h2 id='resource-library-title'>Start with a practical next conversation.</h2>
              <p>These resources are designed as operational guidance. They are not legal, financial, funding or compliance advice.</p>
            </div>
            <div className='gm-resource-grid'>
              {resources.map((resource) => (
                <article key={resource.href} className='gm-resource-card'>
                  <p className='gm-resource-card__eyebrow'>{resource.eyebrow}</p>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <a href={resource.href}>{resource.action}<span aria-hidden='true'> →</span></a>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className='gm-resource-cta'>
          <div className='gm-resource-shell gm-resource-cta__inner'>
            <div><p className='gm-resource-eyebrow'>When you are ready</p><h2>Bring the work into one shared workspace.</h2><p>GrantMaestro helps teams keep deadlines, next actions, evidence and acquittal work visible to the right people.</p></div>
            <a href='/register'>Start your free 14-day trial</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
