import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchTeamMember, updateTeamMember } from './teamMemberSlice'

const roleFromId = {
  1: 'admin',
  3: 'team_member',
  4: 'acquittal_contributor',
}

const TeamMemberEdit = () => {
  const { user_id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const selectedTeamMember = useSelector((state) => state.teamMember.selectedTeamMember)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', role: '', address: '', position_text: '',
  })

  useEffect(() => {
    if (user_id) dispatch(fetchTeamMember(user_id))
  }, [dispatch, user_id])

  useEffect(() => {
    if (selectedTeamMember) {
      setFormData({
        first_name: selectedTeamMember.first_name || '',
        last_name: selectedTeamMember.last_name || '',
        email: selectedTeamMember.email || '',
        role: roleFromId[selectedTeamMember.user_role_id] || 'team_member',
        address: selectedTeamMember.address || '',
        position_text: selectedTeamMember.position_text || '',
      })
    }
  }, [selectedTeamMember])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await dispatch(updateTeamMember({ user_id, ...formData })).unwrap()
      navigate('/team-members')
    } catch (error) {
      toast.error(error?.message || 'Unable to update this team member. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='content container-fluid pb-0 p-0'>
      <form onSubmit={handleSubmit}>
        <div className='card'>
          <div className='card-body'>
            <div className='mb-3'><label className='form-label'>First name</label><input name='first_name' type='text' className='form-control' value={formData.first_name} onChange={handleChange} required /></div>
            <div className='mb-3'><label className='form-label'>Last name</label><input name='last_name' type='text' className='form-control' value={formData.last_name} onChange={handleChange} required /></div>
            <div className='mb-3'><label className='form-label'>Email address</label><input name='email' type='email' className='form-control' value={formData.email} onChange={handleChange} required /></div>
            <div className='mb-3'>
              <label className='form-label'>Role</label>
              <select name='role' className='form-select' value={formData.role} onChange={handleChange} required>
                <option value='admin'>Organisation Admin</option>
                <option value='team_member'>Team Member</option>
                <option value='acquittal_contributor'>Acquittal Contributor</option>
              </select>
            </div>
            <div className='mb-3'><label className='form-label'>Location <span className='text-muted'>(optional)</span></label><input name='address' type='text' className='form-control' value={formData.address} onChange={handleChange} /></div>
            <div className='mb-3'><label className='form-label'>Position <span className='text-muted'>(optional)</span></label><input name='position_text' type='text' className='form-control' value={formData.position_text} onChange={handleChange} /></div>
            <div className='d-flex gap-3'><button type='button' className='btn btn-secondary' onClick={() => navigate('/team-members')} disabled={submitting}>Cancel</button><button type='submit' className='btn btn-primary' disabled={submitting}>{submitting ? 'Saving…' : 'Update member'}</button></div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TeamMemberEdit
