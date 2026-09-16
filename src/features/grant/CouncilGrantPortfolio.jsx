import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGrants } from './grantSlice'
import { fetchTasks } from 'features/tasks/tasksSlice'
import './council-grant-portfolio.css'

const DAY = 24 * 60 * 60 * 1000
const VIEWS = [
  ['all', 'All grants'],
  ['attention', 'Needs attention'],
  ['deadlines', 'Closing in 30 days'],
  ['outcomes', 'Awaiting outcome'],
  ['acquittals', 'Acquittals due'],
]

const parseDate = (value) => {
  if (!value) return null
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}
const dueInDays = (value) => {
  const date = parseDate(value)
  if (!date) return null
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  return Math.round((date.getTime() - today.getTime()) / DAY)
}
const dateLabel = (value) => {
  const date = parseDate(value)
  if (!date) return 'Not set'
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}
const currency = (value) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(Number(value) || 0)
const stageFor = (grant) => {
  const outcome = String(grant.outcome || '').toLowerCase()
  if (outcome === 'won' && grant.acquittal_date) return 'Acquittal'
  if (outcome) return 'Outcome'
  if (grant.is_grant_submitted || grant.submissionDate || grant.grant_submission_date) return 'Submitted'
  if (grant.is_suitable || grant.determination || grant.decisionDate || grant.decision_date) return 'Suitability'
  return 'Opportunity'
}
const relevantDeadline = (grant) => stageFor(grant) === 'Acquittal' ? grant.acquittal_date : (grant.closingDate || grant.closing_date)
const urgency = (grant, tasks) => {
  const grantId = Number(grant.organization_grant_id || grant.id)
  const taskDueDates = tasks
    .filter((task) => Number(task.grant_id) === grantId)
    .filter((task) => String(task.status || task.task_status || '').toLowerCase() !== 'completed')
    .map((task) => dueInDays(task.targeted_completion_date))
    .filter((days) => days !== null)
  const deadlineDays = dueInDays(relevantDeadline(grant))
  if (taskDueDates.some((days) => days < 0) || deadlineDays < 0) return { label: 'At risk', tone: 'risk' }
  if (taskDueDates.some((days) => days <= 7) || (deadlineDays !== null && deadlineDays <= 14)) return { label: 'Needs attention', tone: 'attention' }
  if (!grant.submission_department_representative && !grant.submittedBy) return { label: 'Owner required', tone: 'neutral' }
  return { label: 'On track', tone: 'good' }
}
const dueLabel = (days) => {
  if (days === null) return 'No deadline set'
  if (days < 0) return `${Math.abs(days)}d overdue`
  if (days === 0) return 'Due today'
  return `${days}d remaining`
}

const GrantPortfolioRow = ({ grant }) => {
  const id = grant.organization_grant_id || grant.id
  return (
    <article className='gm-portfolio-row'>
      <div className='gm-portfolio-row__primary'>
        <Link to={`/grant/details/${id}`} className='gm-portfolio-row__title'>{grant.grant_title}</Link>
        <span className='gm-portfolio-row__sub'>{grant.fund_originator || 'Funding body not recorded'} · {grant.category_name || 'Uncategorised'}</span>
      </div>
      <div className='gm-portfolio-row__stage'><span className='gm-stage-pill'>{grant.stage}</span></div>
      <div className='gm-portfolio-row__health'><span className={`gm-health-pill gm-health-pill--${grant.health.tone}`}>{grant.health.label}</span></div>
      <div className='gm-portfolio-row__owner'><strong>{grant.owner}</strong><span>Accountable officer</span></div>
      <div className='gm-portfolio-row__deadline'><strong className={grant.deadlineDays !== null && grant.deadlineDays <= 14 ? 'is-urgent' : ''}>{dueLabel(grant.deadlineDays)}</strong><span>{dateLabel(grant.deadline)}</span></div>
      <div className='gm-portfolio-row__value'><strong>{currency(grant.value)}</strong><span>{grant.stage === 'Acquittal' ? 'Awarded / acquittal' : 'Funding value'}</span></div>
      <div className='gm-portfolio-row__actions'>
        <Link to={`/grant/details/${id}`} className='btn btn-outline-primary btn-sm'>Open</Link>
        <Link to={`/grant/edit/${id}`} className='btn btn-primary btn-sm'>Update</Link>
      </div>
    </article>
  )
}

export default function CouncilGrantPortfolio() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const grants = useSelector((state) => state.grant?.grants ?? [])
  const tasks = useSelector((state) => state.tasks?.tasks ?? [])
  const [search, setSearch] = useState('')
  const [stage, setStage] = useState(searchParams.get('stage') || '')
  const [outcome, setOutcome] = useState('')
  const [view, setView] = useState(searchParams.get('view') || 'all')

  useEffect(() => {
    dispatch(fetchGrants({}))
    dispatch(fetchTasks())
  }, [dispatch])

  useEffect(() => {
    setStage(searchParams.get('stage') || '')
    setView(searchParams.get('view') || 'all')
  }, [searchParams])

  const records = useMemo(() => grants.map((grant) => {
    const deadline = relevantDeadline(grant)
    return {
      ...grant,
      id: grant.organization_grant_id || grant.id,
      stage: stageFor(grant),
      deadline,
      deadlineDays: dueInDays(deadline),
      health: urgency(grant, tasks),
      owner: grant.submission_department_representative || grant.submittedBy || 'Unassigned',
      value: grant.won_fund_amount || grant.funding_sought_amount || grant.max_fund_amount || 0,
    }
  }), [grants, tasks])

  const filtered = useMemo(() => records.filter((grant) => {
    const needle = search.trim().toLowerCase()
    const matchesSearch = !needle || [grant.grant_title, grant.fund_originator, grant.category_name, grant.owner].filter(Boolean).some((value) => String(value).toLowerCase().includes(needle))
    const matchesStage = !stage || grant.stage === stage
    const matchesOutcome = !outcome || String(grant.outcome || '').toLowerCase() === outcome
    const matchesView = {
      all: true,
      attention: grant.health.tone === 'risk' || grant.health.tone === 'attention' || grant.health.tone === 'neutral',
      deadlines: grant.deadlineDays !== null && grant.deadlineDays >= 0 && grant.deadlineDays <= 30,
      outcomes: grant.stage === 'Submitted',
      acquittals: grant.stage === 'Acquittal' && (grant.deadlineDays === null || grant.deadlineDays <= 90),
    }[view] ?? true
    return matchesSearch && matchesStage && matchesOutcome && matchesView
  }).sort((a, b) => {
    const toneWeight = { risk: 0, attention: 1, neutral: 2, good: 3 }
    return (toneWeight[a.health.tone] - toneWeight[b.health.tone]) || ((a.deadlineDays ?? 9999) - (b.deadlineDays ?? 9999))
  }), [records, search, stage, outcome, view])

  const chooseView = (nextView) => {
    setView(nextView)
    const params = new URLSearchParams(searchParams)
    if (nextView === 'all') params.delete('view')
    else params.set('view', nextView)
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearch('')
    setStage('')
    setOutcome('')
    chooseView('all')
  }

  const exportPortfolio = () => {
    const toCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
    const rows = filtered.map((grant) => [grant.grant_title, grant.fund_originator, grant.stage, grant.health.label, grant.owner, dateLabel(grant.deadline), grant.value, grant.outcome || ''])
    const content = [['Grant', 'Funding body', 'Stage', 'Health', 'Accountable officer', 'Next deadline', 'Funding value', 'Outcome'], ...rows].map((row) => row.map(toCell).join(',')).join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
    link.download = 'grantmaestro-portfolio.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <main className='gm-portfolio content container-fluid'>
      <header className='gm-portfolio-header'>
        <div>
          <p className='gm-portfolio-header__eyebrow'>Council inward grants</p>
          <h1>Grant portfolio</h1>
          <p>See the work, ownership and deadlines that matter across every grant.</p>
        </div>
        <div className='gm-portfolio-header__actions'>
          <button type='button' className='btn btn-outline-primary' onClick={exportPortfolio}>Export view</button>
          <Link to='/grant/create' className='btn btn-primary'>Add grant</Link>
        </div>
      </header>

      <section className='gm-portfolio-views' aria-label='Saved grant views'>
        {VIEWS.map(([key, label]) => <button key={key} type='button' className={view === key ? 'is-active' : ''} aria-pressed={view === key} onClick={() => chooseView(key)}>{label}</button>)}
      </section>

      <section className='gm-portfolio-filterbar' aria-label='Portfolio filters'>
        <label className='gm-filter-search'>
          <span className='visually-hidden'>Search grants</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Search grant, funder, category or owner' type='search' />
        </label>
        <label>
          <span>Stage</span>
          <select value={stage} onChange={(event) => setStage(event.target.value)}>
            <option value=''>All stages</option>
            {['Opportunity', 'Suitability', 'Submitted', 'Outcome', 'Acquittal'].map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Outcome</span>
          <select value={outcome} onChange={(event) => setOutcome(event.target.value)}>
            <option value=''>All outcomes</option>
            <option value='won'>Won</option>
            <option value='lost'>Lost</option>
          </select>
        </label>
        <button type='button' className='btn btn-link' onClick={clearFilters}>Clear filters</button>
      </section>

      <section className='gm-portfolio-summary' aria-live='polite'>
        <strong>{filtered.length}</strong> grant{filtered.length === 1 ? '' : 's'} shown · Sorted by risk and next deadline
      </section>

      {filtered.length === 0 ? (
        <section className='gm-portfolio-empty'>
          <h2>{records.length ? 'No grants match this view' : 'Start your council grant portfolio'}</h2>
          <p>{records.length ? 'Try clearing a filter or switch to a different saved view.' : 'Add an opportunity and GrantMaestro will help you coordinate the next actions, evidence and deadlines.'}</p>
          <div>
            {records.length ? <button className='btn btn-outline-primary' type='button' onClick={clearFilters}>Clear filters</button> : <Link to='/grant/create' className='btn btn-primary'>Add first grant</Link>}
          </div>
        </section>
      ) : (
        <section className='gm-portfolio-list' aria-label='Grant portfolio results'>
          <div className='gm-portfolio-list__heading' aria-hidden='true'>
            <span>Grant</span><span>Stage</span><span>Health</span><span>Owner</span><span>Next deadline</span><span>Value</span><span>Actions</span>
          </div>
          {filtered.map((grant) => <GrantPortfolioRow key={grant.id} grant={grant} />)}
        </section>
      )}
    </main>
  )
}
