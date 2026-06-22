import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TaskList from '../../features/tasks/TaskList'
import { fetchGrants } from 'features/grant/grantSlice'
import { fetchTeamMembers } from 'features/teamMember/teamMemberSlice'
import { useSelector, useDispatch } from 'react-redux'

const EMPTY_FILTER = { grant_id: '', teamMember_id: '', status: '' }

const TaskListPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [filterData, setFilterData] = React.useState(EMPTY_FILTER)

  // Refs so we can reset the <select> elements when clearing
  const grantRef  = useRef(null)
  const memberRef = useRef(null)
  const statusRef = useRef(null)

  const grants      = useSelector((state) => state.grant?.grants)
  const teamMembers = useSelector((state) => state.teamMember?.teamMembers)

  useEffect(() => {
    if (!grants.length)      dispatch(fetchGrants())
  }, [dispatch, grants.length])

  useEffect(() => {
    if (!teamMembers.length) dispatch(fetchTeamMembers())
  }, [dispatch, teamMembers.length])

  const updateFilterData = (e) => {
    const { name, value } = e.target
    setFilterData((prev) => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    setFilterData(EMPTY_FILTER)
    if (grantRef.current)  grantRef.current.value  = ''
    if (memberRef.current) memberRef.current.value = ''
    if (statusRef.current) statusRef.current.value = ''
  }

  const hasActiveFilter =
    filterData.grant_id || filterData.teamMember_id || filterData.status

  return (
    <div className='content container-fluid'>
      {/* Page header */}
      <div className='page-header'>
        <div className='content-page-header'>
          <h5>Task List</h5>
          <div className='list-btn'>
            <ul className='filter-list'>
              <li>
                <button
                  className='btn btn-primary'
                  onClick={() => navigate('/add-task')}
                >
                  <i className='fa fa-plus-circle me-2' aria-hidden='true'></i>
                  Add Task
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compact filter bar */}
      <div className='card mb-3'>
        <div className='card-body py-2'>
          <div className='d-flex flex-wrap align-items-end gap-3'>
            {/* Grant filter */}
            <div style={{ flex: '1 1 180px', minWidth: 160 }}>
              <label htmlFor='sortGrant' className='form-label mb-1' style={{ fontSize: 12, fontWeight: 600 }}>
                Grant
              </label>
              <select
                id='sortGrant'
                ref={grantRef}
                className='form-select form-select-sm'
                name='grant_id'
                onChange={updateFilterData}
              >
                <option value=''>All Grants</option>
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

            {/* Assigned To filter */}
            <div style={{ flex: '1 1 180px', minWidth: 160 }}>
              <label htmlFor='sortAssigned' className='form-label mb-1' style={{ fontSize: 12, fontWeight: 600 }}>
                Assigned To
              </label>
              <select
                id='sortAssigned'
                ref={memberRef}
                className='form-select form-select-sm'
                name='teamMember_id'
                onChange={updateFilterData}
              >
                <option value=''>All Members</option>
                {teamMembers.map((member) => (
                  <option key={member.user_id} value={member.user_id}>
                    {member.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div style={{ flex: '1 1 140px', minWidth: 130 }}>
              <label htmlFor='sortStatus' className='form-label mb-1' style={{ fontSize: 12, fontWeight: 600 }}>
                Status
              </label>
              <select
                id='sortStatus'
                ref={statusRef}
                className='form-select form-select-sm'
                name='status'
                onChange={updateFilterData}
              >
                <option value=''>All Statuses</option>
                <option value='assigned'>Assigned</option>
                <option value='pending'>Pending</option>
                <option value='inprogress'>In Progress</option>
                <option value='completed'>Completed</option>
              </select>
            </div>

            {/* Clear button — only visible when a filter is active */}
            {hasActiveFilter && (
              <div style={{ flex: '0 0 auto', paddingBottom: 1 }}>
                <button
                  className='btn btn-sm btn-outline-secondary'
                  onClick={clearFilters}
                  title='Clear all filters'
                >
                  <i className='fa fa-times me-1' aria-hidden='true'></i>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task table */}
      <div className='row'>
        <TaskList filterData={filterData} />
      </div>
    </div>
  )
}

export default TaskListPage
