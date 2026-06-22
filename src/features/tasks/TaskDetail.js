import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchTask } from './tasksSlice'

// ---------------------------------------------------------------------------
// Status badge colours — consistent with TaskList
// ---------------------------------------------------------------------------
const STATUS_CONFIG = {
  assigned:   { label: 'Assigned',    bg: '#17a2b8', color: '#fff' },
  pending:    { label: 'Pending',     bg: '#ffc107', color: '#212529' },
  inprogress: { label: 'In Progress', bg: '#2e83ff', color: '#fff' },
  completed:  { label: 'Completed',   bg: '#28a745', color: '#fff' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] ?? {
    label: status ?? 'Unknown',
    bg: '#6c757d',
    color: '#fff',
  }
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
      }}
    >
      {cfg.label}
    </span>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })
}

function isOverdue(task) {
  if (!task?.targeted_completion_date) return false
  if (task?.task_status?.toLowerCase() === 'completed') return false
  return new Date(task.targeted_completion_date) < new Date()
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const TaskDetail = () => {
  const { task_id } = useParams()
  const selectedTask = useSelector((state) => state.tasks.selectedTask)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (task_id) {
      dispatch(fetchTask(task_id))
    }
  }, [dispatch, task_id])

  if (!selectedTask) {
    return (
      <div className='content container-fluid'>
        <div className='gm-empty-state'>
          <div className='gm-empty-state__icon'>📋</div>
          <p className='gm-empty-state__body'>No task selected.</p>
        </div>
      </div>
    )
  }

  const overdue = isOverdue(selectedTask)

  return (
    <div className='content container-fluid pb-0 p-0'>
      <div className='card'>
        <div className='card-header d-flex align-items-center justify-content-between'>
          <h5 className='card-title mb-0'>Task Details</h5>
          <div className='d-flex gap-2'>
            <Link
              to={`/edit-task/${task_id}`}
              className='btn btn-sm btn-primary'
            >
              <i className='fa fa-pencil me-1' aria-hidden='true'></i>Edit Task
            </Link>
            <button
              type='button'
              className='btn btn-sm btn-secondary'
              onClick={() => navigate('/tasks')}
            >
              Back to Tasks
            </button>
          </div>
        </div>
        <div className='card-body'>
          {overdue && (
            <div
              className='alert alert-danger d-flex align-items-center gap-2 py-2 mb-3'
              role='alert'
              style={{ fontSize: 13 }}
            >
              <i className='fa fa-exclamation-triangle'></i>
              <span>This task is <strong>overdue</strong>. Due date was {formatDate(selectedTask.targeted_completion_date)}.</span>
            </div>
          )}

          <div className='gm-field-grid'>
            <div className='gm-field-card'>
              <span className='gm-field-label'>Grant</span>
              <span className='gm-field-value'>{selectedTask?.grant || '—'}</span>
            </div>

            <div className='gm-field-card'>
              <span className='gm-field-label'>Assigned To</span>
              <span className='gm-field-value'>{selectedTask?.assignedTo || selectedTask?.assigned_to || '—'}</span>
            </div>

            <div className='gm-field-card gm-field-card--full'>
              <span className='gm-field-label'>Task Description</span>
              <span className='gm-field-value'>{selectedTask?.task_description || '—'}</span>
            </div>

            <div className='gm-field-card'>
              <span className='gm-field-label'>Status</span>
              <span className='gm-field-value'>
                <StatusBadge status={selectedTask?.task_status} />
              </span>
            </div>

            <div className='gm-field-card'>
              <span className='gm-field-label'>Due Date</span>
              <span
                className='gm-field-value'
                style={overdue ? { color: '#dc3545', fontWeight: 600 } : {}}
              >
                {overdue && <i className='fa fa-exclamation-triangle me-1'></i>}
                {formatDate(selectedTask?.targeted_completion_date)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail
