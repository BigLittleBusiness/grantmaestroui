import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTasks } from 'features/tasks/tasksSlice'

export default function OutstandingTask() {
  const dispatch = useDispatch()
  const tasksResult = useSelector((state) => state.tasks.tasks)

  useEffect(() => {
    if (!tasksResult.length) {
      dispatch(fetchTasks())
    }
  }, [dispatch, tasksResult.length])
  const tasks = tasksResult.filter((task) => task.task_status !== 'completed')

  const handleViewAll = () => {
    window.location.href = '/tasks'
  }

  return (
    <div className='col-xl-12 d-flex'>
      <div className='card super-admin-dash-card flex-fill'>
        <div className='card-header'>
          <div className='row align-center'>
            <div className='col'>
              <h5 className='card-title'>Outstanding Tasks</h5>
            </div>
            <div className='col-auto'>
              <button
                onClick={handleViewAll}
                className='btn-right btn btn-sm btn-primary'
              >
                View All
              </button>
            </div>
          </div>
        </div>
        <div className='card-body p-0'>
          {tasks.map((task, index) => (
            <div className='dash-plane-list' key={index}>
              <div className='plane-info team-member-task'>
                <div className='plane-name'>
                  <strong>Task name</strong>
                  <h6>{task.description}</h6>
                </div>
              </div>
              <div className='plane-info team-member-task'>
                <div className='plane-name'>
                  <strong>Assigned To</strong>
                  <h6>{task.assignedTo}</h6>
                </div>
              </div>
              <div className='plane-info team-member-task'>
                <div className='plane-name'>
                  <strong>Due date</strong>
                  <h6>{task.targeted_completion_date}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
