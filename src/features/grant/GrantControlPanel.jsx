import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from 'api'
import './grant-control-panel.css'

const STAGES = [
  ['opportunity', 'Opportunity'],
  ['suitability', 'Suitability'],
  ['submitted', 'Submitted'],
  ['outcome', 'Outcome'],
  ['acquittal', 'Acquittal'],
]

const dateForInput = (value) => value ? String(value).slice(0, 10) : ''
const formatDate = (value) => value ? new Date(`${String(value).slice(0, 10)}T12:00:00`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set'
const dueText = (value) => {
  if (!value) return 'No date set'
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`)
  const today = new Date(); today.setHours(12, 0, 0, 0)
  const days = Math.round((date - today) / 86400000)
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `Due in ${days} days`
}

const statusLabel = (status) => ({ on_track: 'On track', needs_attention: 'Needs attention', at_risk: 'At risk' }[status] || 'On track')

export default function GrantControlPanel({ grantId, fallbackGrant }) {
  const user = useSelector((state) => state.auth?.user)
  const isAdmin = Number(user?.user_type) === 1
  const [workspace, setWorkspace] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(isAdmin)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    if (!isAdmin || !grantId) {
      setLoading(false)
      return
    }
    let live = true
    api.get(`grant/workspace/${grantId}`).then((response) => {
      if (!live || !response.data?.status) return
      setWorkspace(response.data.data.grant)
      setMembers(response.data.data.members || [])
      const record = response.data.data.grant
      setForm({
        workflow_stage: record.workflow_stage || 'opportunity',
        next_action: record.next_action || '',
        next_action_due_date: dateForInput(record.next_action_due_date),
        accountable_user_id: record.accountable_officer?.user_id || '',
        risk_status: record.risk_status || 'on_track',
        strategic_priority: record.strategic_priority || '',
        confirm_transition: false,
      })
    }).catch(() => {
      if (live) toast.error('Unable to load the grant workspace controls.')
    }).finally(() => {
      if (live) setLoading(false)
    })
    return () => { live = false }
  }, [grantId, isAdmin])

  const display = workspace || {
    workflow_stage: fallbackGrant?.workflow_stage || 'opportunity',
    next_action: fallbackGrant?.next_action,
    next_action_due_date: fallbackGrant?.next_action_due_date,
    accountable_officer: null,
    risk_status: fallbackGrant?.risk_status || 'on_track',
    strategic_priority: fallbackGrant?.strategic_priority,
    closing_date: fallbackGrant?.closing_date || fallbackGrant?.closingDate,
    acquittal_date: fallbackGrant?.acquittal_date,
  }
  const currentIndex = Math.max(0, STAGES.findIndex(([key]) => key === display.workflow_stage))
  const externalDeadline = display.workflow_stage === 'acquittal' ? display.acquittal_date : display.closing_date
  const owner = display.accountable_officer?.name || display.accountable_officer?.email || fallbackGrant?.submission_department_representative || 'Unassigned'

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const save = async (event) => {
    event.preventDefault()
    if (form.workflow_stage !== display.workflow_stage && !form.confirm_transition) {
      toast.error('Confirm the stage transition before saving.')
      return
    }
    if (!form.next_action.trim()) {
      toast.error('Add the next action so the grant has a clear owner and plan.')
      return
    }
    setSaving(true)
    try {
      const response = await api.post(`grant/workspace/${grantId}`, {
        ...form,
        accountable_user_id: form.accountable_user_id || null,
        next_action_due_date: form.next_action_due_date || null,
      })
      if (!response.data?.status) throw new Error(response.data?.message || 'Unable to update the workspace.')
      setWorkspace(response.data.data.grant)
      setForm((current) => ({ ...current, confirm_transition: false }))
      setEditing(false)
      toast.success('Grant workspace updated.')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Unable to update the workspace.')
    } finally {
      setSaving(false)
    }
  }

  const stageDescription = useMemo(() => STAGES[currentIndex]?.[1] || 'Opportunity', [currentIndex])

  return (
    <section className='gm-grant-control' aria-labelledby='grant-control-title'>
      <div className='gm-grant-control__topline'>
        <div>
          <p className='gm-control-eyebrow'>Grant workspace</p>
          <h2 id='grant-control-title'>Control panel</h2>
        </div>
        <span className={`gm-control-health gm-control-health--${display.risk_status || 'on_track'}`}>{statusLabel(display.risk_status)}</span>
      </div>

      <ol className='gm-stage-tracker' aria-label={`Grant lifecycle: currently in ${stageDescription}`}>
        {STAGES.map(([key, label], index) => <li key={key} className={index < currentIndex ? 'is-complete' : index === currentIndex ? 'is-current' : ''}><span>{index + 1}</span><strong>{label}</strong></li>)}
      </ol>

      <div className='gm-control-summary'>
        <div><span>Next action</span><strong>{display.next_action || 'Set the next action'}</strong><small>{display.next_action_due_date ? `${dueText(display.next_action_due_date)} · ${formatDate(display.next_action_due_date)}` : 'No action date set'}</small></div>
        <div><span>Accountable officer</span><strong>{owner}</strong><small>{display.strategic_priority || 'No strategic priority set'}</small></div>
        <div><span>{display.workflow_stage === 'acquittal' ? 'Acquittal deadline' : 'Next external deadline'}</span><strong>{externalDeadline ? dueText(externalDeadline) : 'No deadline set'}</strong><small>{formatDate(externalDeadline)}</small></div>
      </div>

      {isAdmin && !loading && <div className='gm-control-actions'>
        <button className='btn btn-outline-primary btn-sm' type='button' onClick={() => setEditing((value) => !value)} aria-expanded={editing}>{editing ? 'Close editor' : 'Update workspace'}</button>
      </div>}

      {loading && <p className='gm-control-loading'>Loading grant controls…</p>}
      {editing && (
        <form className='gm-control-editor' onSubmit={save}>
          <div className='gm-control-field gm-control-field--wide'>
            <label htmlFor='next-action'>Next action <span aria-hidden='true'>*</span></label>
            <input id='next-action' value={form.next_action} onChange={(event) => updateField('next_action', event.target.value)} placeholder='e.g. Obtain finance co-contribution confirmation' maxLength='1000' />
          </div>
          <div className='gm-control-field'>
            <label htmlFor='next-action-date'>Action due date</label>
            <input id='next-action-date' type='date' value={form.next_action_due_date} onChange={(event) => updateField('next_action_due_date', event.target.value)} />
          </div>
          <div className='gm-control-field'>
            <label htmlFor='accountable-officer'>Accountable officer</label>
            <select id='accountable-officer' value={form.accountable_user_id} onChange={(event) => updateField('accountable_user_id', event.target.value)}>
              <option value=''>Select an officer</option>
              {members.map((member) => <option key={member.user_id} value={member.user_id}>{member.name || member.email}</option>)}
            </select>
          </div>
          <div className='gm-control-field'>
            <label htmlFor='risk-status'>Grant health</label>
            <select id='risk-status' value={form.risk_status} onChange={(event) => updateField('risk_status', event.target.value)}>
              <option value='on_track'>On track</option>
              <option value='needs_attention'>Needs attention</option>
              <option value='at_risk'>At risk</option>
            </select>
          </div>
          <div className='gm-control-field'>
            <label htmlFor='strategic-priority'>Strategic priority</label>
            <input id='strategic-priority' value={form.strategic_priority} onChange={(event) => updateField('strategic_priority', event.target.value)} placeholder='e.g. Community Infrastructure Plan' maxLength='255' />
          </div>
          <div className='gm-control-field'>
            <label htmlFor='workflow-stage'>Lifecycle stage</label>
            <select id='workflow-stage' value={form.workflow_stage} onChange={(event) => updateField('workflow_stage', event.target.value)}>
              {STAGES.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </div>
          {form.workflow_stage !== display.workflow_stage && <label className='gm-control-confirm'><input type='checkbox' checked={form.confirm_transition} onChange={(event) => updateField('confirm_transition', event.target.checked)} /> I confirm this grant should move to the {STAGES.find(([key]) => key === form.workflow_stage)?.[1]} stage.</label>}
          <div className='gm-control-editor__actions'><button type='button' className='btn btn-outline-secondary' onClick={() => setEditing(false)}>Cancel</button><button type='submit' className='btn btn-primary' disabled={saving}>{saving ? 'Saving…' : 'Save workspace controls'}</button></div>
        </form>
      )}
    </section>
  )
}
