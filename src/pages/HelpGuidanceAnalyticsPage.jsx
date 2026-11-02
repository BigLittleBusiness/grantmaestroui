import React, { useCallback, useEffect, useState } from 'react'
import api from 'api'
import './HelpGuidanceAnalyticsPage.css'

const number = (value) => new Intl.NumberFormat('en-AU').format(Number(value || 0))
const labels = {
  'access-and-passwords': 'Access and passwords',
  'team-invitations': 'Team invitations',
  'tasks-and-collaboration': 'Tasks and collaboration',
  'acquittals-and-evidence': 'Acquittals and evidence',
  reporting: 'Reporting',
  'subscription-and-billing': 'Subscriptions and billing',
  'payment-provider-setup': 'Payment provider setup',
  'email-and-notifications': 'Email and notifications',
  'document-storage': 'Document storage',
  'security-and-privacy': 'Security and privacy',
  other: 'Other guidance',
}

const Metric = ({ label, value, detail }) => <article className='gm-help-metric'><span>{label}</span><strong>{value === null || value === undefined ? '—' : number(value)}{label === 'Helpful feedback' && value !== null && value !== undefined ? '%' : ''}</strong><small>{detail}</small></article>

export default function HelpGuidanceAnalyticsPage() {
  const [days, setDays] = useState(30)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (selectedDays = days) => {
    setLoading(true); setError('')
    try {
      const response = await api.get('help-guidance/analytics', { params: { days: selectedDays } })
      setData(response.data?.data || null)
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Help analytics could not be loaded.')
    } finally { setLoading(false) }
  }, [days])
  useEffect(() => { load() }, [load])

  return <main className='gm-help-analytics content container-fluid'>
    <header className='gm-help-analytics__header'><div><p>Platform operations</p><h1>Help &amp; Guidance insights</h1><span>Use role-aware, privacy-preserving signals to improve the Top 10 and contextual guidance.</span></div><label htmlFor='guidance-analytics-period'>Period<select id='guidance-analytics-period' value={days} onChange={(event) => setDays(Number(event.target.value))}><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></select></label></header>
    {loading ? <section className='gm-help-analytics__state' aria-live='polite'><div className='spinner-border text-primary' aria-hidden='true' />Loading Help &amp; Guidance insights…</section> : error ? <section className='gm-help-analytics__state gm-help-analytics__state--error' role='alert'><p>{error}</p><button className='btn btn-primary' onClick={() => load()}>Try again</button></section> : <>
      <section className='gm-help-analytics__metrics' aria-label='Help and Guidance summary metrics'><Metric label='Top 10 views' value={data?.summary?.defaultViews} detail='Role-specific default library opens' /><Metric label='Guidance searches' value={data?.summary?.searches} detail='Plain-language search activity' /><Metric label='No-result searches' value={data?.summary?.zeroResultSearches} detail='Candidate gaps for a new article' /><Metric label='Contextual link opens' value={data?.summary?.contextualOpens} detail='Help used at a complex workflow' /><Metric label='Helpful feedback' value={data?.summary?.helpfulRate} detail='Of explicit helpful / not-yet votes' /></section>
      <section className='gm-help-analytics__grid'>
        <article className='gm-help-analytics__panel'><header><div><p>Default view adoption</p><h2>Top 10 opens by role</h2></div></header>{data?.defaultViewsByRole?.length ? <ul>{data.defaultViewsByRole.map((item) => <li key={item.role}><span>{item.roleLabel}</span><strong>{number(item.count)}</strong></li>)}</ul> : <p className='gm-help-analytics__empty'>No Top 10 views have been recorded in this period.</p>}</article>
        <article className='gm-help-analytics__panel'><header><div><p>Search demand</p><h2>Common help intents</h2></div></header>{data?.commonSearchIntents?.length ? <ol>{data.commonSearchIntents.map((item) => <li key={item.intent}><span>{labels[item.intent] || 'Other guidance'}</span><strong>{number(item.count)}</strong></li>)}</ol> : <p className='gm-help-analytics__empty'>No searches have been recorded in this period.</p>}</article>
        <article className='gm-help-analytics__panel'><header><div><p>Contextual guidance</p><h2>Most opened topics</h2></div></header>{data?.commonTopics?.length ? <ol>{data.commonTopics.map((item) => <li key={item.topicId}><span>{String(item.topicId).replace(/-/g, ' ')}</span><strong>{number(item.count)}</strong></li>)}</ol> : <p className='gm-help-analytics__empty'>No guidance topics have been opened in this period.</p>}</article>
      </section>
      <aside className='gm-help-analytics__privacy'><i className='fa fa-shield' aria-hidden='true' /><div><strong>Privacy boundary</strong><p>{data?.privacy}</p></div></aside>
      <section className='gm-help-analytics__review'><h2>How to use these signals</h2><ul><li>Promote a recurring search intent into a role’s Top 10 only when it is relevant and the answer is clear.</li><li>Review no-result counts before creating a new article; do not infer customer intent from raw private text.</li><li>Prioritise low helpfulness feedback or heavily opened contextual topics for usability review.</li><li>Keep tenant-only work, credentials and restricted platform setup topics out of lower-privileged role libraries.</li></ul></section>
    </>}
  </main>
}
