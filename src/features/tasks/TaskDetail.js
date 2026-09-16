import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchTask, updateTaskChecklistItem } from './tasksSlice'
import toast from 'react-hot-toast'
import './task.css'

const STATUS_CONFIG = {
  assigned: { label: 'Assigned', tone: 'info' },
  pending: { label: 'Waiting / pending', tone: 'warning' },
  inprogress: { label: 'In progress', tone: 'primary' },
  completed: { label: 'Completed', tone: 'success' },
}
const labelise = (value) => value ? String(value).replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) : 'Not set'
const formatDate = (value) => value ? new Date(`${String(value).slice(0, 10)}T12:00:00`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set'
const overdue = (task) => task?.targeted_completion_date && String(task.task_status || task.status).toLowerCase() !== 'completed' && new Date(`${String(task.targeted_completion_date).slice(0, 10)}T12:00:00`) < new Date()

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[String(status || '').toLowerCase()] || { label: labelise(status), tone: 'secondary' }
  return <span className={`badge bg-${config.tone}`}>{config.label}</span>
}

export default function TaskDetail() {
  const { task_id } = useParams()
  const selectedTask = useSelector((state) => state.tasks.selectedTask)
  const user = useSelector((state) => state.auth?.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => { if (task_id) dispatch(fetchTask(task_id)) }, [dispatch, task_id])

  if (!selectedTask) return <section className='gm-workspace-state' aria-live='polite'><div className='spinner-border text-primary' aria-hidden='true' /><h2>Loading task</h2><p>Preparing the shared work details.</p></section>

  const isOverdue = overdue(selectedTask)
  const checklist = selectedTask.checklist_items || []
  const canUpdateChecklist = Number(user?.user_type) === 1 || Number(user?.user_id) === Number(selectedTask.task_assigned_to_id)
  const completeCount = checklist.filter((item) => item.is_complete).length

  return (
    <main className='gm-task-detail content container-fluid pb-0 p-0'>
      <section className='card'>
        <header className='card-header d-flex align-items-start justify-content-between gap-3'>
          <div><p className='gm-task-detail__eyebrow'>Shared grant work</p><h1 className='card-title mb-0'>Task details</h1></div>
          <div className='d-flex gap-2 flex-wrap justify-content-end'><Link to={`/edit-task/${task_id}`} className='btn btn-sm btn-primary'>Update task</Link><button type='button' className='btn btn-sm btn-outline-secondary' onClick={() => navigate('/tasks')}>Back to tasks</button></div>
        </header>
        <div className='card-body'>
          {isOverdue && <div className='alert alert-danger d-flex align-items-center gap-2 py-2 mb-3' role='alert'><i className='fa fa-exclamation-triangle' aria-hidden='true' /><span>This task is <strong>overdue</strong>. The due date was {formatDate(selectedTask.targeted_completion_date)}.</span></div>}
          <div className='gm-task-detail__title-block'><h2>{selectedTask.task_description || selectedTask.description || 'Untitled task'}</h2><div className='d-flex gap-2 flex-wrap'><StatusBadge status={selectedTask.task_status || selectedTask.status} /><span className={`gm-task-priority gm-task-priority--${selectedTask.priority || 'medium'}`}>{labelise(selectedTask.priority || 'medium')} priority</span></div></div>
          <div className='gm-field-grid'>
            <div className='gm-field-card'><span className='gm-field-label'>Related grant</span><span className='gm-field-value'>{selectedTask.grant || 'Not recorded'}</span></div>
            <div className='gm-field-card'><span className='gm-field-label'>Accountable person</span><span className='gm-field-value'>{selectedTask.task_assigned_to_name || selectedTask.assignedTo || selectedTask.assigned_to || 'Unassigned'}</span></div>
            <div className='gm-field-card'><span className='gm-field-label'>Due date</span><span className={`gm-field-value ${isOverdue ? 'text-danger fw-semibold' : ''}`}>{formatDate(selectedTask.targeted_completion_date)}</span></div>
            <div className='gm-field-card'><span className='gm-field-label'>Work type</span><span className='gm-field-value'>{labelise(selectedTask.task_type)}</span></div>
            <div className='gm-field-card'><span className='gm-field-label'>Grant stage</span><span className='gm-field-value'>{labelise(selectedTask.grant_stage)}</span></div>
            <div className='gm-field-card'><span className='gm-field-label'>Estimated effort</span><span className='gm-field-value'>{selectedTask.estimated_effort_hours ? `${selectedTask.estimated_effort_hours} hours` : 'Not estimated'}</span></div>
            <div className='gm-field-card gm-field-card--full'><span className='gm-field-label'>Dependency or blocker</span><span className='gm-field-value'>{selectedTask.dependency_note || 'No dependency recorded.'}</span></div>
            {selectedTask.completion_evidence && <div className='gm-field-card gm-field-card--full'><span className='gm-field-label'>Completion evidence</span><span className='gm-field-value'>{selectedTask.completion_evidence}</span></div>}
          </div>
          <section className='gm-task-checklist' aria-labelledby='task-checklist-heading'><div className='gm-task-checklist__header'><div><p>Definition of done</p><h2 id='task-checklist-heading'>Shared checklist</h2></div><span>{completeCount} of {checklist.length} complete</span></div>{checklist.length ? <ul>{checklist.map((item) => { const itemId = item.id || item.task_checklist_item_id; return <li key={itemId} className={item.is_complete ? 'is-complete' : ''}><label><input type='checkbox' checked={Boolean(item.is_complete)} disabled={!canUpdateChecklist} onChange={async (event) => { try { await dispatch(updateTaskChecklistItem({ itemId, isComplete: event.target.checked })).unwrap() } catch (error) { toast.error(error?.message || 'Unable to update the checklist item.') } }} /><span>{item.text || item.item_text}</span></label></li> })}</ul> : <p>No checklist items have been added to this task.</p>}{!canUpdateChecklist && checklist.length ? <small className='gm-task-checklist__hint'>Checklist items can be completed by the assigned officer or an Organisation Admin.</small> : null}</section>
        </div>
      </section>
    </main>
  )
}
