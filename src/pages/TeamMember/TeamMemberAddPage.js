import React from 'react'
import { useNavigate } from 'react-router-dom'
import TeamMemberAdd from '../../features/teamMember/TeamMemberAdd'
import ContextualHelpLink from '../../components/help/ContextualHelpLink'

const TeamMemberAddPage = () => {
  const navigate = useNavigate()

  return (
    <div className='content container-fluid'>
      <div className='page-header'>
        <div className='content-page-header'>
          <h5>Add Team Member</h5>
          <ContextualHelpLink topicId='team-invitations' source='team-invitation-page'>Need help inviting a colleague?</ContextualHelpLink>
          <div className='list-btn'>
            <ul className='filter-list'>
              <li>
                <button
                  className='btn btn-primary'
                  onClick={() => navigate('/team-members')}
                >
                  <i className='fa fa-eye me-2' aria-hidden='true'></i>
                  View All
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='row'>
        <TeamMemberAdd />
      </div>
    </div>
  )
}

export default TeamMemberAddPage
