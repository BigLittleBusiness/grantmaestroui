import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTeamMembers } from '../teamMember/teamMemberSlice'
import { Link } from 'react-router-dom'
import ProfileImage from 'assets/img/avatar-07.jpg'

export default function AdminTeamCard() {
  const dispatch = useDispatch()
  const teamMembers = useSelector((state) => state.teamMember.teamMembers)
  useEffect(() => {
    if (!teamMembers.length) {
      dispatch(fetchTeamMembers())
    }
  }, [dispatch, teamMembers.length])
  return (
    <div className='col-xl-5 d-flex'>
      <div className='card super-admin-dash-card flex-fill'>
        <div className='card-header'>
          <div className='row align-center'>
            <div className='col'>
              <h5 className='card-title'>Team Members</h5>
            </div>
            <div className='col-auto'>
              <Link
                to='/team-members'
                className='btn-right btn btn-sm btn-primary'
              >
                View All
              </Link>
            </div>
          </div>
        </div>
        <div className='card-body p-0'>
          {teamMembers.map((member, index) => (
            <div className='dash-plane-list' key={index}>
              <div className='plane-info'>
                <span className='icon-plane'>
                  <img
                    src={member.profile_image || ProfileImage}
                    alt=''
                    style={{ borderRadius: '100%' }}
                  />
                </span>
                <div className='plane-name'>
                  <strong>Staff Name:</strong>
                  <h6>{member.full_name}</h6>
                </div>
              </div>
              <span className='plane-rate'>{member.email}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
