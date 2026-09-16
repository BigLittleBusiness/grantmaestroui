import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from 'api'
import './acquittal-centre.css'

const STATUSES = [
  ['not_started', 'Not started'],
  ['in_progress', 'In progress'],
  ['ready_for_review', 'Ready for review'],
  ['complete', 'Complete'],
  ['not_required', 'Not required'],
]
const TYPES = ['evidence', 'finance', 'approval', 'submission']
const labelise = (value) => String(value || '').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
const dateInput = (value) => value ? String(value).slice(0, 10) : ''
const formatDate = (value) => value ? new Date(`${String(value).slice(0, 10)}T12:00:00`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date set'
const daysUntil = (value) => { if (!value) return null; const date = new Date(`${String(value).slice(0, 10)}T12:00:00`); const today = new Date(); today.setHours(12, 0, 0, 0); return Math.round((date - today) / 86400000) }
const deadlineLabel = (value) => { const days = daysUntil(value); if (days === null) return 'No deadline set'; if (days < 0) return `${Math.abs(days)} days overdue`; if (days === 0) return 'Due today'; if (days === 1) return 'Due tomorrow'; return `Due in ${days} days` }

export default function AcquittalCentre() {
  const user = useSelector((state) => state.auth?.user)
  const isAdmin = Number(user?.user_type) === 1
  const [grants, setGrants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingItem, setSavingItem] = useState(null)
  const [addingFor, setAddingFor] = useState(null)
  const [newItem, setNewItem] = useState({ item_title: '', item_type: 'evidence', due_date: '' })

  const load = async () => {
    setLoading(true); setError('')
    try {
      const response = await api.get('grant/acquittals')
      if (!response.data?.status) throw new Error(response.data?.message || 'Unable to load acquittals.')
      setGrants(response.data.data?.grants || [])
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || 'Unable to load the acquittal centre.')
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const summary = useMemo(() => grants.reduce((total, grant) => {
    const required = (grant.acquittal_items || []).filter((item) => item.is_required && item.status !== 'not_required')
    const complete = required.filter((item) => item.status === 'complete').length
    return { grants: total.grants + 1, required: total.required + required.length, complete: total.complete + complete, overdue: total.overdue + (daysUntil(grant.acquittal_date) < 0 ? 1 : 0) }
  }, { grants: 0, required: 0, complete: 0, overdue: 0 }), [grants])

  const initialise = async (grant) => {
    try {
      await api.post(`grant/acquittals/${grant.grant_id}/initialise`)
      toast.success('Acquittal checklist started.')
      await load()
    } catch (requestError) { toast.error(requestError?.response?.data?.message || 'Unable to start the checklist.') }
  }

  const updateItem = async (item, updates) => {
    setSavingItem(item.acquittal_item_id)
    try {
      const response = await api.post('grant/acquittals/items/manage', { action: 'update', acquittal_item_id: item.acquittal_item_id, ...updates })
      if (!response.data?.status) throw new Error(response.data?.message)
      await load()
    } catch (requestError) { toast.error(requestError?.response?.data?.message || requestError.message || 'Unable to update the checklist item.') }
    finally { setSavingItem(null) }
  }

  const addItem = async (event) => {
    event.preventDefault()
    if (!newItem.item_title.trim()) { toast.error('Enter the requirement or evidence item.'); return }
    try {
      const response = await api.post('grant/acquittals/items/manage', { action: 'add', grant_id: addingFor.grant_id, item_title: newItem.item_title.trim(), item_type: newItem.item_type, due_date: newItem.due_date || null })
      if (!response.data?.status) throw new Error(response.data?.message)
      setAddingFor(null); setNewItem({ item_title: '', item_type: 'evidence', due_date: '' })
      toast.success('Acquittal item added.')
      await load()
    } catch (requestError) { toast.error(requestError?.response?.data?.message || requestError.message || 'Unable to add the checklist item.') }
  }

  if (loading) return <section className='gm-workspace-state' aria-live='polite'><div className='spinner-border text-primary' aria-hidden='true' /><h2>Loading acquittals</h2><p>Checking evidence, financial reporting and submission requirements.</p></section>
  if (error) return <section className='gm-workspace-state gm-workspace-state--error' role='alert'><h2>We could not load acquittals</h2><p>{error}</p><button className='btn btn-primary' onClick={load}>Try again</button></section>

  return (
    <main className='gm-acquittal-centre content container-fluid'>
      <header className='gm-acquittal-centre__header'><div><p>Compliance workspace</p><h1>Acquittal centre</h1><span>Prepare evidence, approvals and financial reconciliation before the funding body deadline.</span></div><Link className='btn btn-outline-primary' to='/grant'>View grant portfolio</Link></header>
      <section className='gm-acquittal-summary' aria-label='Acquittal summary'><div><span>Acquittals in view</span><strong>{summary.grants}</strong></div><div><span>Required items complete</span><strong>{summary.complete} <small>of {summary.required}</small></strong></div><div><span>Overdue acquittals</span><strong className={summary.overdue ? 'is-risk' : ''}>{summary.overdue}</strong></div></section>
      {grants.length ? <section className='gm-acquittal-list'>{grants.map((grant) => {
        const items = grant.acquittal_items || []
        const required = items.filter((item) => item.is_required && item.status !== 'not_required')
        const completed = required.filter((item) => item.status === 'complete').length
        const progress = required.length ? Math.round((completed / required.length) * 100) : 0
        const late = daysUntil(grant.acquittal_date) < 0
        return <article key={grant.grant_id} className='gm-acquittal-card'>
          <header><div><p>{grant.fund_originator || 'Funding body not recorded'}</p><h2><Link to={`/grant/details/${grant.grant_id}`}>{grant.grant_title}</Link></h2><span className={`gm-acquittal-deadline ${late ? 'is-risk' : ''}`}>{deadlineLabel(grant.acquittal_date)} · {formatDate(grant.acquittal_date)}</span></div><div className='gm-acquittal-card__owner'><span>Accountable officer</span><strong>{grant.accountable_officer?.name || 'Unassigned'}</strong></div></header>
          {!items.length ? <div className='gm-acquittal-card__empty'><p>No checklist has been started for this grant.</p>{isAdmin && <button className='btn btn-primary btn-sm' type='button' onClick={() => initialise(grant)}>Start acquittal checklist</button>}</div> : <>
            <div className='gm-acquittal-progress'><div><strong>{progress}% complete</strong><span>{completed} of {required.length} required items complete</span></div><div className='gm-acquittal-progress__track' aria-label={`${progress}% of required acquittal work complete`} role='progressbar' aria-valuemin='0' aria-valuemax='100' aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div></div>
            <div className='gm-acquittal-items'>{items.map((item) => <div className='gm-acquittal-item' key={item.acquittal_item_id}><div className='gm-acquittal-item__title'><span className={`gm-acquittal-item__type gm-acquittal-item__type--${item.item_type}`}>{labelise(item.item_type)}</span><strong>{item.item_title}</strong>{item.is_required && <small>Required</small>}</div><div className='gm-acquittal-item__owner'><span>Owner</span><strong>{item.owner_name || grant.accountable_officer?.name || 'Unassigned'}</strong></div><label className='gm-acquittal-item__status'><span>Status</span><select value={item.status} disabled={savingItem === item.acquittal_item_id} onChange={(event) => updateItem(item, { status: event.target.value })}>{STATUSES.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label className='gm-acquittal-item__evidence'><span>Evidence note</span><input defaultValue={item.evidence_note || ''} disabled={savingItem === item.acquittal_item_id} onBlur={(event) => { if (event.target.value !== (item.evidence_note || '')) updateItem(item, { evidence_note: event.target.value }) }} placeholder='Record evidence location or review note' maxLength='10000' /></label></div>)}</div>
            {isAdmin && <div className='gm-acquittal-card__actions'><button type='button' className='btn btn-outline-primary btn-sm' onClick={() => { setAddingFor(grant); setNewItem({ item_title: '', item_type: 'evidence', due_date: dateInput(grant.acquittal_date) }) }}>Add requirement</button></div>}
          </>}
        </article>
      })}</section> : <section className='gm-acquittal-empty'><h2>No acquittals need attention</h2><p>Grants with an acquittal deadline, or moved to the acquittal stage, will appear here with a structured compliance checklist.</p><Link className='btn btn-primary' to='/grant'>Review grant portfolio</Link></section>}
      {addingFor && <div className='gm-confirm-backdrop' role='presentation'><form className='gm-acquittal-add-dialog' onSubmit={addItem} aria-labelledby='add-acquittal-item-title'><h2 id='add-acquittal-item-title'>Add acquittal requirement</h2><p>{addingFor.grant_title}</p><label>Requirement or evidence item<input autoFocus value={newItem.item_title} onChange={(event) => setNewItem((value) => ({ ...value, item_title: event.target.value }))} placeholder='e.g. Attach certified financial statement' maxLength='255' /></label><label>Requirement type<select value={newItem.item_type} onChange={(event) => setNewItem((value) => ({ ...value, item_type: event.target.value }))}>{TYPES.map((type) => <option key={type} value={type}>{labelise(type)}</option>)}</select></label><label>Due date<input type='date' value={newItem.due_date} onChange={(event) => setNewItem((value) => ({ ...value, due_date: event.target.value }))} /></label><div><button type='button' className='btn btn-outline-secondary' onClick={() => setAddingFor(null)}>Cancel</button><button type='submit' className='btn btn-primary'>Add item</button></div></form></div>}
    </main>
  )
}
