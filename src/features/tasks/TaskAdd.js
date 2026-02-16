import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { addNewTask } from './tasksSlice'
import { fetchTeamMembers } from '../teamMember/teamMemberSlice'
import { fetchGrants } from '../grant/grantSlice'

const validationSchema = yup.object({
  grant_id: yup.number().required('Please select grant'),
  task_assigned_to: yup.number().required('Please select grant'),
  task_description: yup.string().required('Please enter description'),
  task_status: yup.string().required('Status is required'),
  targeted_completion_date: yup.date().required('Submission date is required'),
})

const TaskAdd = () => {
  const teamMembers = useSelector((state) => state.teamMember.teamMembers)
  const grants = useSelector((state) => state.grant.grants)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchTeamMembers())
    dispatch(fetchGrants({ searchText: '' }))
  }, [])

  const formik = useFormik({
    initialValues: {
      grant_id: '',
      task_assigned_to: '',
      task_description: '',
      task_status: '',
      targeted_completion_date: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(addNewTask({ values }))
        .unwrap()
        .then(() => {
          navigate('/tasks')
        })
        .catch((err) => {
          console.error('Failed to login: ', err)
        })
    },
  })

  return (
    <div className='content container-fluid pb-0 p-0'>
      <form onSubmit={formik.handleSubmit}>
        <div className='card'>
          <div className='card-body'>
            <div className='mb-3'>
              <label className='form-label'>Grant:</label>
              <select
                name='grant_id'
                className='form-select'
                value={formik.values.grant_id}
                onChange={formik.handleChange}
              >
                <option value=''>Select grant</option>
                {grants.map((el, index) => (
                  <>
                    <option value={el.organization_grant_id} key={index}>
                      {el.grant_title}
                    </option>
                  </>
                ))}
              </select>
              {formik.errors.grant_id && (
                <div className='text-danger'>{formik.errors.grant_id}</div>
              )}
            </div>
            <div className='mb-3'>
              <label className='form-label'>Task Assigned To:</label>
              <select
                name='task_assigned_to'
                className='form-select'
                value={formik.values.task_assigned_to}
                onChange={formik.handleChange}
              >
                <option value=''>Select member</option>
                {teamMembers.map((el, index) => (
                  <>
                    <option value={el.user_id} key={index}>
                      {el.full_name}
                    </option>
                  </>
                ))}
              </select>
              {formik.errors.task_assigned_to && (
                <div className='text-danger'>
                  {formik.errors.task_assigned_to}
                </div>
              )}
            </div>
            <div className='mb-3'>
              <label className='form-label'>Task Description:</label>
              <input
                name='task_description'
                type='text'
                className='form-control'
                placeholder='Enter desctiption'
                value={formik.values.task_description}
                onChange={formik.handleChange}
              />
              {formik.errors.task_description && (
                <div className='text-danger'>
                  {formik.errors.task_description}
                </div>
              )}
            </div>
            <div className='mb-3'>
              <label className='form-label'>Task Due Date:</label>
              <input
                type='date'
                name='targeted_completion_date'
                className='form-control'
                onChange={formik.handleChange}
                value={formik.values.targeted_completion_date}
              />
              {formik.errors.targeted_completion_date && (
                <div className='text-danger'>
                  {formik.errors.targeted_completion_date}
                </div>
              )}
            </div>
            <div className='mb-3'>
              <label className='form-label'>Task Status:</label>
              <select
                name='task_status'
                className='form-select'
                value={formik.values.task_status}
                onChange={formik.handleChange}
              >
                <option value=''>Select status</option>
                <option value='assigned'>Assigned</option>
                <option value='pending'>Pending</option>
                <option value='inprogress'>Inprogress</option>
                <option value='completed'>Completed</option>
              </select>
              {formik.errors.task_sattus && (
                <div className='text-danger'>{formik.errors.task_sattus}</div>
              )}
            </div>
            <div className='d-flex gap-3'>
              <button
                type='button'
                className='btn btn-secondary'
                onClick={() => navigate('/tasks')}
              >
                Cancel
              </button>
              <button type='submit' className='btn btn-primary'>
                Assign Task
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TaskAdd
