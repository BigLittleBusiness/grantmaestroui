import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from 'api'
import './sys-admin-dashboard.css'

const STATUS_META = {
  configured: ['Configured', 'good'],
  stripe_active: ['Stripe active', 'good'],
  pin_configured: ['Pin configured', 'good'],
  ready_when_data_due: ['Ready', 'good'],
  needs_setup: ['Needs setup', 'attention'],
  blocked_by_email: ['Blocked by email setup', 'risk'],
}
const formatDate = (value) => value ? new Date(`${String(value).slice(0, 10)}T12:00:00`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not recorded'
const StatCard = ({ label, value, tone = 'blue', detail }) => <article className={`gm-platform-stat gm-platform-stat--${tone}`}><span>{label}</span><strong>{value ?? '—'}</strong>{detail && <small>{detail}</small>}</article>
const StatusCard = ({ label, value, link, linkLabel }) => { const [text, tone] = STATUS_META[value] || ['Not configured', 'attention']; return <article className='gm-platform-status'><div><span>{label}</span><strong className={`gm-platform-status__state gm-platform-status__state--${tone}`}>{text}</strong></div>{link && <Link to={link}>{linkLabel || 'Configure'}</Link>}</article> }

export default function SysAdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = () => { setLoading(true); setError(''); api.get('/admin/platform-stats', { withCredentials: true }).then((response) => { if (response.data?.success) setStats(response.data.data); else setError('Platform statistics are unavailable.') }).catch((requestError) => setError(requestError?.response?.data?.message || 'Unable to reach the platform services.')).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])
  if (loading) return <section className='gm-platform-state' aria-live='polite'><div className='spinner-border text-primary' aria-hidden='true' /><h2>Loading platform overview</h2><p>Preparing subscription, customer and configuration status.</p></section>
  if (error) return <section className='gm-platform-state gm-platform-state--error' role='alert'><h2>Platform overview is unavailable</h2><p>{error}</p><button className='btn btn-primary' onClick={load}>Try again</button></section>
  const readyCount = Object.values(stats.integrationStatus || {}).filter((value) => ['configured', 'stripe_active', 'pin_configured', 'ready_when_data_due'].includes(value)).length

  return <main className='gm-platform-overview content container-fluid'>
    <header className='gm-platform-overview__header'><div><p>System administration</p><h1>Platform overview</h1><span>Monitor customer growth and complete the configuration needed for reliable service delivery.</span></div><div className='gm-platform-overview__actions'><Link to='/admin/subscription-plans' className='btn btn-outline-primary'>Manage plans</Link><Link to='/admin/email-settings' className='btn btn-primary'>Configure services</Link></div></header>
    <section className='gm-platform-alert' aria-label='Platform configuration status'><div><strong>{readyCount} of 5 operational services ready</strong><span>Complete outstanding configuration before enabling affected customer functions.</span></div><Link to='/admin/email-settings'>Review settings</Link></section>
    <section className='gm-platform-stats' aria-label='Platform customer metrics'><StatCard label='Customer organisations' value={stats.totalOrganisations} detail='Excludes GrantMaestro internal workspace' /><StatCard label='Active subscriptions' value={stats.activeSubscriptions} tone='green' /><StatCard label='Subscriptions requiring attention' value={stats.expiredSubscriptions} tone={stats.expiredSubscriptions ? 'red' : 'green'} /><StatCard label='Registered users' value={stats.totalUsers} tone='purple' /><StatCard label='Grants managed' value={stats.totalGrants} tone='amber' /><StatCard label='New organisations, 30 days' value={stats.newOrgsLast30Days} tone='teal' /></section>
    <section className='gm-platform-overview__grid'>
      <article className='gm-platform-panel'><header><div><p>Service readiness</p><h2>Platform integrations</h2></div><span>Non-secret status</span></header><div className='gm-platform-status-list'><StatusCard label='Email delivery (AWS SES)' value={stats.integrationStatus?.email} link='/admin/email-settings' /><StatusCard label='Document storage (AWS S3)' value={stats.integrationStatus?.storage} link='/admin/email-settings' linkLabel='View setup guidance' /><StatusCard label='Customer payments' value={stats.integrationStatus?.payment} link='/admin/payment-settings' /><StatusCard label='AI assistance' value={stats.integrationStatus?.ai} link='/admin/email-settings' linkLabel='View settings' /><StatusCard label='Scheduled notifications' value={stats.integrationStatus?.scheduled_notifications} link='/admin/email-settings' linkLabel='Resolve email setup' /></div></article>
      <article className='gm-platform-panel'><header><div><p>Customer onboarding</p><h2>Recently registered organisations</h2></div><Link to='/admin/subscription-plans'>Subscription plans</Link></header>{stats.recentOrgs?.length ? <div className='gm-platform-org-list'>{stats.recentOrgs.map((org) => <div key={org.organization_id}><strong>{org.organization_name}</strong><span>Registered {formatDate(org.created_at)}</span></div>)}</div> : <div className='gm-platform-empty'><h3>No customer organisations yet</h3><p>New trial organisations will appear here once registration is active.</p></div>}</article>
    </section>
  </main>
}
