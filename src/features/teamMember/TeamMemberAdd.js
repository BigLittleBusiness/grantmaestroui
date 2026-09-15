import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { addTeamMember } from './teamMemberSlice'

const TeamMemberAdd = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    address: '',
    position_text: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.role) {
      toast.error('Please select a team role.')
      return
    }
    setSubmitting(true)
    try {
      await dispatch(addTeamMember(formData)).unwrap()
      navigate('/team-members')
    } catch (error) {
      toast.error(error?.message || 'Unable to invite this team member. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='content container-fluid pb-0 p-0'>
      <form onSubmit={handleSubmit}>
        <div className='card'>
          <div className='card-body'>
            <div className='mb-3'>
              <label className='form-label'>First name</label>
              <input name='first_name' type='text' className='form-control' placeholder='Enter first name' value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Last name</label>
              <input name='last_name' type='text' className='form-control' placeholder='Enter last name' value={formData.last_name} onChange={handleChange} required />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Email address</label>
              <input name='email' type='email' className='form-control' placeholder='name@organisation.gov.au' value={formData.email} onChange={handleChange} required />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Role</label>
              <select name='role' className='form-select' value={formData.role} onChange={handleChange} required>
                <option value='' disabled>Select role</option>
                <option value='admin'>Organisation Admin</option>
                <option value='team_member'>Team Member</option>
                <option value='acquittal_contributor'>Acquittal Contributor</option>
              </select>
              <small className='text-muted d-block mt-1'>Acquittal Contributors can provide information for grant reporting without receiving administration privileges.</small>
            </div>
            <div className='mb-3'>
              <label className='form-label'>Location <span className='text-muted'>(optional)</span></label>
              <input name='address' type='text' className='form-control' placeholder='Enter location' value={formData.address} onChange={handleChange} />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Position <span className='text-muted'>(optional)</span></label>
              <input name='position_text' type='text' className='form-control' placeholder='Enter position' value={formData.position_text} onChange={handleChange} />
            </div>
            <div className='d-flex gap-3'>
              <button type='button' className='btn btn-secondary' onClick={() => navigate('/team-members')} disabled={submitting}>Cancel</button>
              <button type='submit' className='btn btn-primary' disabled={submitting}>{submitting ? 'Sending invitation…' : 'Send invitation'}</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TeamMemberAdd
