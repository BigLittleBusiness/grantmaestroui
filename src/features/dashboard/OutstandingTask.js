import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// ---------------------------------------------------------------------------
// Helpers
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
        padding: '2px 8px',
        borderRadius: 12,
        fontSize: 10,
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  )
}

function isOverdue(task) {
  if (!task.targeted_completion_date) return false
  if (task.task_status?.toLowerCase() === 'completed') return false
  return new Date(task.targeted_completion_date) < new Date()
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function OutstandingTask() {
  const tasksResult = useSelector((state) => state.tasks.tasks ?? [])

  // Show only non-completed tasks; sort overdue tasks to the top, then by due date
  const tasks = [...tasksResult]
    .filter((t) => t.task_status?.toLowerCase() !== 'completed')
    .sort((a, b) => {
      const aOver = isOverdue(a) ? 0 : 1
      const bOver = isOverdue(b) ? 0 : 1
      if (aOver !== bOver) return aOver - bOver
      const aDate = a.targeted_completion_date ? new Date(a.targeted_completion_date) : Infinity
      const bDate = b.targeted_completion_date ? new Date(b.targeted_completion_date) : Infinity
      return aDate - bDate
    })

  const navigate = useNavigate()
  const handleViewAll = () => {
    navigate('/tasks')
  }

  return (
    <div className='col-xl-12 d-flex'>
      <div className='card super-admin-dash-card flex-fill'>
        <div className='card-header'>
          <div className='row align-items-center'>
            <div className='col'>
              <h5 className='card-title mb-0'>
                Outstanding Tasks
                {tasks.length > 0 && (
                  <span
                    style={{
                      marginLeft: 8,
                      background: '#dc3545',
                      color: '#fff',
                      borderRadius: '50%',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '1px 6px',
                      verticalAlign: 'middle',
                    }}
                  >
                    {tasks.length}
                  </span>
                )}
              </h5>
            </div>
            <div className='col-auto'>
              <button
                onClick={handleViewAll}
                className='btn btn-sm btn-primary'
              >
                View All
              </button>
            </div>
          </div>
        </div>

        <div className='card-body p-0'>
          {tasks.length === 0 ? (
            <div className='text-center py-4 text-muted' style={{ fontSize: 13 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
              All tasks are complete — great work!
            </div>
          ) : (
            <div className='table-responsive'>
              <table className='table table-hover mb-0'>
                <thead className='table-light'>
                  <tr>
                    <th style={{ fontWeight: 600, fontSize: 12 }}>Task</th>
                    <th style={{ fontWeight: 600, fontSize: 12 }}>Assigned To</th>
                    <th style={{ fontWeight: 600, fontSize: 12 }}>Due Date</th>
                    <th style={{ fontWeight: 600, fontSize: 12 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => {
                    const overdue = isOverdue(task)
                    return (
                      <tr
                        key={task.task_id ?? index}
                        style={
                          overdue
                            ? { background: '#fff5f5', borderLeft: '3px solid #dc3545' }
                            : {}
                        }
                      >
                        <td style={{ verticalAlign: 'middle', fontSize: 13 }}>
                          {overdue && (
                            <span
                              title='Overdue'
                              style={{ color: '#dc3545', marginRight: 4, fontWeight: 700 }}
                            >
                              ⚠
                            </span>
                          )}
                          {task.description || task.task_description || '—'}
                        </td>
                        <td style={{ verticalAlign: 'middle', fontSize: 13 }}>
                          {task.assignedTo || task.assigned_to || '—'}
                        </td>
                        <td
                          style={{
                            verticalAlign: 'middle',
                            fontSize: 13,
                            color: overdue ? '#dc3545' : 'inherit',
                            fontWeight: overdue ? 600 : 400,
                          }}
                        >
                          {formatDate(task.targeted_completion_date)}
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          <StatusBadge status={task.task_status} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
