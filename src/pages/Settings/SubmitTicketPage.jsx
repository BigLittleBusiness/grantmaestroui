import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import ManageTicket from 'features/settings/ManageTicket'
import { crearSupportTicket } from '../../features/settings/settingsSlice'



export default function SubmitTicketPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
      dispatch(crearSupportTicket())
  }, [])
  return (
    <div className='content container-fluid'>
      {/* Page Header */}
      <div className='page-header'>
        <div className='content-page-header'>
          <h5>Submit a Ticket</h5>
          <div className='list-btn'>
            <ul className='filter-list'>
              <li>
                <button
                  className='btn btn-primary'
                  onClick={() => navigate('/tickets')}
                >
                  <i className='fa fa-eye me-2' aria-hidden='true'></i>
                  View All
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* /Page Header */}

      <div className='row'>
        <ManageTicket/>
      </div>
    </div>
  )
}
