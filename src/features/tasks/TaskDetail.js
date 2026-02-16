import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchTask, updateTask } from './tasksSlice'

const TaskDetail = () => {
  const { task_id } = useParams()
  const selectedTask = useSelector((state) => state.tasks.selectedTask)
  const dispatch = useDispatch()

  useEffect(() => {
    if (task_id) {
      dispatch(fetchTask(task_id))
    }
  }, [dispatch, task_id])

  if (!selectedTask) {
    return <div>Select a task to edit</div>
  }
  console.log('selectedTask', selectedTask)
  return (
    <div className='content container-fluid pb-0 p-0'>
      <form>
        <div className='card'>
          <div className='card-body'>
            <div className='mb-3'>
              <label className='form-label'>Grant:</label>
              <input
                type='text'
                className='form-control'
                value={selectedTask?.grant}
                disabled
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Task Description:</label>
              <textarea
                className='form-control'
                value={selectedTask?.task_description}
                disabled
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Task Due Date:</label>
              <input
                type='date'
                className='form-control'
                value={selectedTask?.targeted_completion_date}
                disabled
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Task Status:</label>
              <select
                name='role'
                className='form-select'
                value={selectedTask.task_status}
                disabled
              >
                <option value='assigned'>Assigned</option>
                <option value='pending'>Pending</option>
                <option value='inprogress'>Inprogress</option>
                <option value='completed'>Completed</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TaskDetail
