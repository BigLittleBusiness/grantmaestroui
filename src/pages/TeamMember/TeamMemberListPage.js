import React from 'react'
import { useNavigate } from 'react-router-dom'
import TeamMemberList from 'features/teamMember/TeamMemberList'
import SideBar from 'components/SideBar'

const TeamMemberListPage = () => {
  const navigate = useNavigate()

  const handleAddMemberClick = () => {
    navigate('/add-team-member')
  }

  return (
    <div className='content container-fluid'>
      <div className='page-header'>
        <div className='content-page-header'>
          <h5>Team</h5>
          <div className='list-btn'>
            <ul className='filter-list'>
              <li>
                <button
                  className='btn btn-primary'
                  onClick={handleAddMemberClick}
                >
                  <i className='fa fa-plus-circle me-2' aria-hidden='true'></i>
                  Add Member
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='row'>
        <TeamMemberList />
      </div>
    </div>
  )
}

export default TeamMemberListPage
