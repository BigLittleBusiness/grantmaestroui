import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchTasks, deleteTask } from './tasksSlice'
import { fetchTeamMembers } from 'features/teamMember/teamMemberSlice'
import './task.css'

const priorityRank = { high: 0, medium: 1, low: 2 }
const formatDate = (value) => value ? new Date(`${String(value).slice(0, 10)}T12:00:00`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No due date'
const dueDays = (value) => {
  if (!value) return null
  const due = new Date(`${String(value).slice(0, 10)}T12:00:00`)
  const today = new Date(); today.setHours(12, 0, 0, 0)
  return Math.round((due - today) / 86400000)
}
const dueLabel = (task) => {
  const days = dueDays(task.targeted_completion_date)
  if (days === null) return 'No due date'
  if (String(task.status || task.task_status).toLowerCase() === 'completed') return formatDate(task.targeted_completion_date)
  if (days < 0) return `${Math.abs(days)}d overdue`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `${days}d remaining`
}
const labelise = (value) => value ? String(value).replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) : 'Not set'
const taskTitle = (task) => task.description || task.task_description || 'Untitled task'

export default function TaskList({ filterData = {} }) {
  const tasks = useSelector((state) => state.tasks.tasks || [])
  const status = useSelector((state) => state.tasks.status)
  const user = useSelector((state) => state.auth?.user)
  const teamMembers = useSelector((state) => state.teamMember?.teamMembers || [])
  const isOrganisationAdmin = Number(user?.user_type) === 1
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(filterData.status || '')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('')
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [removing, setRemoving] = useState(false)

  useEffect(() => { dispatch(fetchTasks()); dispatch(fetchTeamMembers()) }, [dispatch])

  const filtered = useMemo(() => tasks.filter((task) => {
    const text = search.trim().toLowerCase()
    const matchesText = !text || [taskTitle(task), task.grant, task.assignedTo, task.task_assigned_to_name, task.task_type].filter(Boolean).some((value) => String(value).toLowerCase().includes(text))
    const matchesStatus = !statusFilter || String(task.status || task.task_status) === statusFilter
    const matchesPriority = !priorityFilter || String(task.priority || '').toLowerCase() === priorityFilter
    const matchesOwner = !ownerFilter || String(task.task_assigned_to_id) === String(ownerFilter)
    const matchesGrant = !filterData.grant_id || String(task.grant_id) === String(filterData.grant_id)
    const matchesMember = !filterData.teamMember_id || String(task.task_assigned_to_id) === String(filterData.teamMember_id)
    return matchesText && matchesStatus && matchesPriority && matchesOwner && matchesGrant && matchesMember
  }).sort((a, b) => {
    const aOpen = String(a.status || a.task_status) === 'completed' ? 1 : 0
    const bOpen = String(b.status || b.task_status) === 'completed' ? 1 : 0
    return (aOpen - bOpen) || ((priorityRank[String(a.priority || '').toLowerCase()] ?? 3) - (priorityRank[String(b.priority || '').toLowerCase()] ?? 3)) || ((dueDays(a.targeted_completion_date) ?? 9999) - (dueDays(b.targeted_completion_date) ?? 9999))
  }), [tasks, search, statusFilter, priorityFilter, ownerFilter, filterData])

  const needsAttention = filtered.filter((task) => {
    const days = dueDays(task.targeted_completion_date)
    return String(task.status || task.task_status).toLowerCase() !== 'completed' && days !== null && days <= 7
  }).length

  const confirmDelete = async () => {
    if (!deleteCandidate) return
    setRemoving(true)
    try {
      await dispatch(deleteTask(deleteCandidate.id)).unwrap()
      toast.success('Task deleted.')
      setDeleteCandidate(null)
    } catch (error) {
      toast.error(error?.message || 'The task could not be deleted.')
    } finally { setRemoving(false) }
  }

  return (
    <section className='gm-task-list'>
      <header className='gm-task-list__header'>
        <div><p>Shared work queue</p><h1>Grant tasks</h1><span>Prioritise the work that protects funding, evidence and compliance.</span></div>
        <Link className='btn btn-primary' to='/add-task'>Assign task</Link>
      </header>
      <section className='gm-task-list__filters' aria-label='Task filters'>
        <label className='gm-task-list__search'><span className='visually-hidden'>Search tasks</span><input value={search} onChange={(event) => setSearch(event.target.value)} type='search' placeholder='Search tasks, grants or people' /></label>
        <label><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value=''>All statuses</option><option value='assigned'>Assigned</option><option value='pending'>Waiting / pending</option><option value='inprogress'>In progress</option><option value='completed'>Completed</option></select></label>
        <label><span>Priority</span><select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}><option value=''>All priorities</option><option value='high'>High</option><option value='medium'>Medium</option><option value='low'>Low</option></select></label>
        <label><span>Accountable person</span><select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}><option value=''>All people</option>{teamMembers.map((member) => <option key={member.user_id} value={member.user_id}>{member.full_name || `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email}</option>)}</select></label>
        <button type='button' className='btn btn-link' onClick={() => { setSearch(''); setStatusFilter(''); setPriorityFilter(''); setOwnerFilter('') }}>Clear filters</button>
      </section>
      <div className='gm-task-list__summary' aria-live='polite'><strong>{filtered.length}</strong> task{filtered.length === 1 ? '' : 's'} shown{needsAttention ? <span className='gm-task-list__attention'>{needsAttention} need attention in the next 7 days</span> : null}</div>

      {status === 'loading' && !tasks.length ? <section className='gm-workspace-state' aria-live='polite'><div className='spinner-border text-primary' aria-hidden='true' /><h2>Loading tasks</h2><p>Preparing your shared grant work queue.</p></section> : filtered.length ? <section className='gm-task-list__records' aria-label='Grant task results'>
        <div className='gm-task-list__columns' aria-hidden='true'><span>Task</span><span>Grant and stage</span><span>Owner</span><span>Priority</span><span>Due</span><span>Actions</span></div>
        {filtered.map((task) => {
          const overdue = dueDays(task.targeted_completion_date) < 0 && String(task.status || task.task_status).toLowerCase() !== 'completed'
          const taskStatus = task.status || task.task_status
          return <article key={task.id} className={`gm-task-record ${overdue ? 'gm-task-record--overdue' : ''}`}>
            <div className='gm-task-record__primary'><Link to={`/view-task/${task.id}`}>{taskTitle(task)}</Link><span>{labelise(task.task_type)}{task.estimated_effort_hours ? ` · ${task.estimated_effort_hours}h estimated` : ''}</span>{task.dependency_note && <small>Blocked by: {task.dependency_note}</small>}</div>
            <div className='gm-task-record__grant'><strong>{task.grant || 'Grant not recorded'}</strong><span>{labelise(task.grant_stage)}</span></div>
            <div className='gm-task-record__owner'><strong>{task.assignedTo || task.task_assigned_to_name || 'Unassigned'}</strong><span>{labelise(taskStatus)}</span></div>
            <div className='gm-task-record__priority'><span className={`gm-priority-badge gm-priority--${String(task.priority || 'medium').toLowerCase()}`}>{labelise(task.priority || 'medium')}</span></div>
            <div className='gm-task-record__due'><strong className={overdue ? 'text-danger' : ''}>{dueLabel(task)}</strong><span>{formatDate(task.targeted_completion_date)}</span></div>
            <div className='gm-task-record__actions'><Link to={`/view-task/${task.id}`} className='btn btn-outline-primary btn-sm'>Open</Link><button type='button' className='btn btn-outline-secondary btn-sm' onClick={() => navigate(`/edit-task/${task.id}`)}>Update</button>{isOrganisationAdmin && <button type='button' className='btn btn-link btn-sm text-danger' onClick={() => setDeleteCandidate(task)}>Delete</button>}</div>
          </article>
        })}
      </section> : <section className='gm-task-list__empty'><h2>{tasks.length ? 'No tasks match this view' : 'No tasks have been assigned'}</h2><p>{tasks.length ? 'Clear a filter or choose another work view.' : 'Assign a clear task from a grant record to share ownership and keep deadlines visible.'}</p>{tasks.length ? <button type='button' className='btn btn-outline-primary' onClick={() => { setSearch(''); setStatusFilter(''); setPriorityFilter(''); setOwnerFilter('') }}>Clear filters</button> : <Link className='btn btn-primary' to='/add-task'>Assign first task</Link>}</section>}

      {deleteCandidate && <div className='gm-confirm-backdrop' role='presentation'><section className='gm-confirm-dialog' role='alertdialog' aria-modal='true' aria-labelledby='delete-task-title' aria-describedby='delete-task-description'><h2 id='delete-task-title'>Delete this task?</h2><p id='delete-task-description'>“{taskTitle(deleteCandidate)}” will be removed from your organisation’s work queue. This action can be recovered only by an administrator through system support.</p><div><button type='button' className='btn btn-outline-secondary' onClick={() => setDeleteCandidate(null)} disabled={removing}>Keep task</button><button type='button' className='btn btn-danger' onClick={confirmDelete} disabled={removing}>{removing ? 'Deleting…' : 'Delete task'}</button></div></section></div>}
    </section>
  )
}
