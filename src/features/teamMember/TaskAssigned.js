import React from 'react'
import { useSelector } from 'react-redux'

export default function TaskAssigned() {
  const selectedTeamMember = useSelector(
    (state) => state.teamMember.selectedTeamMember
  )

  if (!selectedTeamMember) {
    return <div>No tasks assigned</div>
  }

  const activeTasks = selectedTeamMember.tasks.filter(
    (task) => task.status === 'Active'
  )
  const completedTasks = selectedTeamMember.tasks.filter(
    (task) => task.status === 'Completed'
  )

  return (
    <div className='col-lg-8'>
      <div className='card'>
        <div className='card-header d-flex justify-content-between'>
          <h5 className='card-title'>Tasks Assigned</h5>
          <a href='#' className='btn btn-primary addTaskBtn'>
            Add Task
          </a>
        </div>
        <div className='card-body card-body-height'>
          <div className='profile-card mb-2'>
            <h6 className='mb-3'>Currently Active</h6>
            <ul className='task-list mb-3'>
              {activeTasks.map((task) => (
                <li key={task.id} className='task-item'>
                  {task.title} - Due:{' '}
                  {new Date(task.dueDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
            <h6 className='mb-3'>Completed</h6>
            <ul className='task-list mb-3'>
              {completedTasks.map((task) => (
                <li key={task.id} className='task-item'>
                  {task.title} - Completed:{' '}
                  {new Date(task.dueDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
          <div className='profile-card'>
            <h6 className='mb-3'>Grant Applications Involved With</h6>
            <ul className='grant-list'>
              {selectedTeamMember.grants.map((grant) => (
                <li key={grant.id} className='grant-item'>
                  {grant.title} - Role: {grant.role}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
