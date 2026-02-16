import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchTeamMember, updateTeamMember } from './teamMemberSlice'

const TeamMemberEdit = () => {
  const { user_id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const selectedTeamMember = useSelector(
    (state) => state.teamMember.selectedTeamMember
  )

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    address: '',
    position_text: '',
  })

  useEffect(() => {
    if (user_id) {
      dispatch(fetchTeamMember(user_id))
    }
  }, [dispatch, user_id])

  useEffect(() => {
    if (selectedTeamMember) {
      setFormData({
        first_name: selectedTeamMember.first_name || '',
        last_name: selectedTeamMember.last_name || '',
        email: selectedTeamMember.email || '',
        role: selectedTeamMember.user_role_id === 3 ? 'admin' : 'team_member',
        address: selectedTeamMember.address || '',
        position_text: selectedTeamMember.position_text || '',
      })
    }
  }, [selectedTeamMember])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleRoleChange = (e) => {
    const { value } = e.target
    setFormData({
      ...formData,
      role: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(updateTeamMember({ user_id, ...formData }))
    navigate('/team-members')
  }

  return (
    <div className='content container-fluid pb-0 p-0'>
      <form onSubmit={handleSubmit}>
        <div className='card'>
          <div className='card-body'>
            <div className='mb-3'>
              <label className='form-label'>First Name:</label>
              <input
                name='first_name'
                type='text'
                className='form-control'
                placeholder='Enter first name'
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Last Name:</label>
              <input
                name='last_name'
                type='text'
                className='form-control'
                placeholder='Enter last name'
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Email:</label>
              <input
                name='email'
                type='email'
                className='form-control'
                placeholder='Enter email'
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Role:</label>
              <select
                name='role'
                className='form-select'
                value={formData.role}
                onChange={handleRoleChange}
                disabled={formData.role === 'admin'}
              >
                <option value='' disabled>
                  Select role
                </option>
                <option value='admin'>Admin</option>
                <option value='team_member'>Team Member</option>
              </select>
            </div>
            <div className='mb-3' id='locationWrapper'>
              <label className='form-label'>Location:</label>
              <input
                name='address'
                type='text'
                className='form-control'
                placeholder='Enter location'
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Position:</label>
              <input
                name='position_text'
                type='text'
                className='form-control'
                placeholder='Enter position'
                value={formData.position_text}
                onChange={handleChange}
              />
            </div>
            <div className='d-flex gap-3'>
              <button
                type='button'
                className='btn btn-secondary'
                onClick={() => navigate('/team-members')}
              >
                Cancel
              </button>
              <button type='submit' className='btn btn-primary'>
                Update Member
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TeamMemberEdit
