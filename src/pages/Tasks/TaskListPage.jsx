import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TaskList from '../../features/tasks/TaskList'
import { fetchGrants } from 'features/grant/grantSlice'
import { fetchTeamMembers } from 'features/teamMember/teamMemberSlice'
import { useSelector, useDispatch } from 'react-redux'

const TaskListPage = () => {
  const navigate = useNavigate()
  const handleAddTaskClick = () => {
    navigate('/add-task')
  }
  const [filterData, setFilterData] = React.useState({
    grant_id: '',
    teamMember_id: '',
    status: '',
  })

  const grants = useSelector((state) => state.grant?.grants)
  const teamMembers = useSelector((state) => state.teamMember?.teamMembers)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!grants.length) {
      dispatch(fetchGrants())
    }
  }, [dispatch, grants.length])

  useEffect(() => {
    if (!teamMembers.length) {
      dispatch(fetchTeamMembers())
    }
  }, [dispatch, teamMembers.length])

  const updateFilterData = (e) => {
    const { name, value } = e.target
    setFilterData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className='content container-fluid'>
      <div className='page-header'>
        <div className='content-page-header'>
          <h5>Task List</h5>
          <div className='list-btn'>
            <ul className='filter-list'>
              <li>
                <button
                  className='btn btn-primary'
                  onClick={handleAddTaskClick}
                >
                  <i className='fa fa-plus-circle me-2' aria-hidden='true'></i>
                  Add Task
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='card'>
        <div className='card-body'>
          <div className='row mb-3'>
            <div className='col-md-4'>
              <label htmlFor='sortGrant' className='form-label'>
                Sort by Grant
              </label>
              <select
                id='sortGrant'
                className='form-select'
                name='grant_id'
                onChange={updateFilterData}
              >
                <option value='' selected>
                  Select a Grant
                </option>
                {grants.map((grant) => (
                  <option
                    key={grant.organization_grant_id}
                    value={grant.organization_grant_id}
                  >
                    {grant.grant_title}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4'>
              <label htmlFor='sortAssigned' className='form-label'>
                Sort by Assigned
              </label>
              <select
                id='sortAssigned'
                className='form-select'
                name='teamMember_id'
                onChange={updateFilterData}
              >
                <option value='' selected>
                  Select a Team Member
                </option>
                {teamMembers.map((member) => (
                  <option key={member.user_id} value={member.user_id}>
                    {member.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4'>
              <label htmlFor='sortStatus' className='form-label'>
                Sort by Status
              </label>
              <select
                id='sortStatus'
                className='form-select'
                name='status'
                onChange={updateFilterData}
              >
                <option value=''>Select status</option>
                <option value='assigned'>Assigned</option>
                <option value='pending'>Pending</option>
                <option value='inprogress'>Inprogress</option>
                <option value='completed'>Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <TaskList filterData={filterData} />
      </div>
    </div>
  )
}

export default TaskListPage
