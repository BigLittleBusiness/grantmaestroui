import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchTeamMembers } from 'features/teamMember/teamMemberSlice'
import './settings.css'

export default function SeatUsagePage() {
  const teamMembers = useSelector((state) => state.teamMember.teamMembers)
  const [teamMemberCount, setTeamMemberCount] = useState(0)
  const [adminCount, setAdminCount] = useState(0)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!teamMembers.length) {
      dispatch(fetchTeamMembers())
    }
  }, [dispatch, teamMembers.length])

  useEffect(() => {
    const totalMembers = teamMembers.filter(
      (member) => member.user_role_id === 3
    )?.length
    const totalAdmins = teamMembers.filter(
      (member) => member.user_role_id === 2
    )?.length
    setTeamMemberCount(totalMembers)
    setAdminCount(totalAdmins)
  }, [teamMembers])

  return (
    <div className='content container-fluid'>
      {/* Page Header */}
      <div className='page-header'>
        <div className='content-page-header'>
          <h5>Seat Usage Information</h5>
        </div>
      </div>
      {/* /Page Header */}

      <div className='content container-fluid pb-0 p-0'>
        <div className='row'>
          <div className='col-lg-7'>
            {/* Current Seat Allocation */}
            <div className='card'>
              <div className='card-header'>
                <h5>Current Seat Allocation</h5>
              </div>
              <div className='card-body'>
                <div className='info-item d-flex justify-content-between'>
                  <span>Number of Admins:</span>
                  <span>{adminCount}</span>
                </div>
                <div className='info-item d-flex justify-content-between'>
                  <span>Number of Team Members:</span>
                  <span>{teamMemberCount}</span>
                </div>
              </div>
            </div>

            <div className='alert alert-info mt-4 text-center'>
              To modify seat allocation, please visit the{' '}
              <button
                className='btn btn-link p-0 alert-link'
                onClick={() => navigate('/team-members')}
              >
                Team Members Page
              </button>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
