import React, { useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchGrants } from 'features/grant/grantSlice'
import { useDispatch, useSelector } from 'react-redux'
import './reporting-overview.css'

const EMPTY_GRANTS = []
const money = (value) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(Number(value) || 0)
const safeDate = (value) => value ? new Date(`${String(value).slice(0, 10)}T12:00:00`) : null
const formatDate = (value) => safeDate(value)?.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) || 'Not set'
const labelise = (value) => value ? String(value).replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) : 'Not set'

export default function ReportPage() {
  const dispatch = useDispatch()
  const grants = useSelector((state) => state.grant.grants) || EMPTY_GRANTS
  useEffect(() => { dispatch(fetchGrants({})) }, [dispatch])
  const metrics = useMemo(() => {
    const submitted = grants.filter((grant) => grant.submissionDate || grant.grant_submission_date || grant.is_grant_submitted)
    const decided = submitted.filter((grant) => ['won', 'lost'].includes(String(grant.outcome || '').toLowerCase()))
    const won = grants.filter((grant) => String(grant.outcome || '').toLowerCase() === 'won')
    const appliedValue = submitted.reduce((sum, grant) => sum + Number(grant.funding_sought_amount || 0), 0)
    const securedValue = won.reduce((sum, grant) => sum + Number(grant.received_fund_amount || grant.won_fund_amount || grant.funding_sought_amount || 0), 0)
    const today = new Date(); today.setHours(12, 0, 0, 0)
    const soon = new Date(today); soon.setDate(soon.getDate() + 30)
    const acquittalAtRisk = grants.filter((grant) => { const date = safeDate(grant.acquittal_date); return date && date <= soon && String(grant.grant_status || '').toLowerCase() !== 'completed' }).length
    return { submitted: submitted.length, appliedValue, securedValue, won: won.length, decided: decided.length, winRate: decided.length ? Math.round((won.length / decided.length) * 100) : null, acquittalAtRisk }
  }, [grants])

  const downloadCsv = () => {
    const cell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
    const rows = grants.map((grant) => [grant.grant_title, grant.fund_originator, grant.grant_status, grant.outcome, grant.funding_sought_amount, grant.received_fund_amount || grant.won_fund_amount, grant.closingDate || grant.closing_date, grant.acquittal_date])
    const csv = [['Grant title', 'Funding body', 'Workflow stage', 'Outcome', 'Funding sought', 'Funding secured', 'Closing date', 'Acquittal date'].map(cell).join(','), ...rows.map((row) => row.map(cell).join(','))].join('\n')
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); link.download = `grantmaestro-portfolio-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(link.href)
  }

  return <main className='gm-reporting content container-fluid'>
    <header className='gm-reporting__header'><div><p>Leadership view</p><h1>Grant portfolio performance</h1><span>Use clear pipeline, outcome and compliance measures to guide inward-grants investment.</span></div><div className='gm-reporting__actions'><button className='btn btn-outline-primary' onClick={downloadCsv} disabled={!grants.length}>Export portfolio CSV</button><Link className='btn btn-primary' to='/grant'>Open grant portfolio</Link></div></header>
    <section className='gm-reporting__context'><div><strong>Portfolio view</strong><span>All active grant records available to your organisation.</span></div><Link to='/acquittals'>Open acquittal centre</Link></section>
    <section className='gm-reporting__metrics' aria-label='Portfolio performance metrics'><article><span>Applications submitted</span><strong>{metrics.submitted}</strong><small>{money(metrics.appliedValue)} funding sought</small></article><article><span>Funding secured</span><strong>{money(metrics.securedValue)}</strong><small>{metrics.won} grants awarded</small></article><article><span>Decision win rate</span><strong>{metrics.winRate === null ? '—' : `${metrics.winRate}%`}</strong><small>{metrics.decided ? `${metrics.decided} decided applications` : 'No decisions recorded yet'}</small></article><article className={metrics.acquittalAtRisk ? 'is-risk' : ''}><span>Acquittals due within 30 days</span><strong>{metrics.acquittalAtRisk}</strong><small>{metrics.acquittalAtRisk ? 'Review compliance requirements now' : 'No near-term exposure identified'}</small></article></section>
    <section className='gm-reporting__panels'>
      <article className='gm-reporting-panel'><header><div><p>Outcome pipeline</p><h2>Grant decision position</h2></div></header><div className='gm-outcome-bars'><div><span>Won</span><strong>{metrics.won}</strong><i style={{ width: `${grants.length ? (metrics.won / grants.length) * 100 : 0}%` }} /></div><div><span>Submitted / awaiting outcome</span><strong>{Math.max(0, metrics.submitted - metrics.decided)}</strong><i style={{ width: `${grants.length ? ((metrics.submitted - metrics.decided) / grants.length) * 100 : 0}%` }} /></div><div><span>In preparation</span><strong>{Math.max(0, grants.length - metrics.submitted)}</strong><i style={{ width: `${grants.length ? ((grants.length - metrics.submitted) / grants.length) * 100 : 0}%` }} /></div></div></article>
      <article className='gm-reporting-panel'><header><div><p>Management prompt</p><h2>Next leadership review</h2></div></header><div className='gm-reporting-prompt'><strong>{metrics.acquittalAtRisk ? `${metrics.acquittalAtRisk} acquittal${metrics.acquittalAtRisk === 1 ? '' : 's'} need attention before the next 30 days.` : 'No current acquittal deadline is within 30 days.'}</strong><p>Use the Acquittal Centre to confirm accountable officers, evidence and approval requirements.</p><Link to='/acquittals'>Review compliance work</Link></div></article>
    </section>
    <section className='gm-reporting-table'><header><div><p>Portfolio register</p><h2>Current grants</h2></div><span>{grants.length} record{grants.length === 1 ? '' : 's'}</span></header>{grants.length ? <div className='table-responsive'><table><thead><tr><th>Grant</th><th>Stage</th><th>Funding sought</th><th>Outcome</th><th>Acquittal deadline</th><th></th></tr></thead><tbody>{grants.map((grant) => <tr key={grant.organization_grant_id || grant.id}><td><strong>{grant.grant_title}</strong><span>{grant.fund_originator || 'Funding body not recorded'}</span></td><td><span className='gm-stage-badge'>{labelise(grant.grant_status || grant.workflow_stage)}</span></td><td>{money(grant.funding_sought_amount)}</td><td>{labelise(grant.outcome)}</td><td>{formatDate(grant.acquittal_date)}</td><td><Link to={`/grant/details/${grant.organization_grant_id || grant.id}`}>Open</Link></td></tr>)}</tbody></table></div> : <div className='gm-reporting-empty'><h3>No grants have been added</h3><p>Create the first grant record to establish a reportable inward-grants portfolio.</p><Link className='btn btn-primary' to='/grant/create'>Create a grant</Link></div>}</section>
  </main>
}
