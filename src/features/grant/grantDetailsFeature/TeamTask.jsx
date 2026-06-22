import React, { useEffect } from 'react'
import { fetchTeamMembers } from 'features/teamMember/teamMemberSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchTasks } from 'features/tasks/tasksSlice'

export default function TeamTask() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const teamMembers = useSelector((state) => state.teamMember.teamMembers)
  const tasks = useSelector((state) => state.tasks.tasks)

  const teamMembersString = teamMembers
    .map((member) => member.full_name)
    .join(', ')

  const taskList = useEffect(() => {
    dispatch(fetchTeamMembers())
  }, [dispatch])

  useEffect(() => {
    if (!tasks.length) {
      dispatch(fetchTasks())
    }
  }, [dispatch, tasks.length])

  const totalAssignedTasks =
    tasks.filter((task) => task.status === 'assigned')?.length || 0
  const totalCompletedTasks =
    tasks.filter((task) => task.status === 'completed')?.length || 0
  const totalRemainingTasks =
    tasks.filter((task) => task.status === 'pending')?.length || 0

  return (
    <div className='col-xl-4 col-md-4'>
      <div
        className='card super-admin-dash-card p-2 pt-3 mb-0'
        style={{ height: '430px', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <div className='card-header'>
          <div className='row align-center'>
            <div className='col d-flex justify-content-between'>
              <h5 className='card-title'>Team & Tasks</h5>
              <div className='dropdown dropdown-action'>
                <button
                  className='btn btn-primary btn-action-icon'
                  style={{ marginRight: '10px' }}
                  onClick={() => navigate('/add-team-member')}
                >
                  Add Team
                </button>
                <button
                  className='btn btn-primary btn-action-icon'
                  onClick={() => navigate('/add-task')}
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='card-body p-0'>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Team Members:</strong>
              </div>
            </div>
            <span className='plane-rate'>{teamMembersString}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Tasks Assigned:</strong>
              </div>
            </div>
            <span className='plane-rate'>{totalAssignedTasks}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Tasks Completed:</strong>
              </div>
            </div>
            <span className='plane-rate'>{totalCompletedTasks}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Tasks Remaining:</strong>
              </div>
            </div>
            <span className='plane-rate'>{totalRemainingTasks}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
