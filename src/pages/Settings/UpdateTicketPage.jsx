import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTicketInfo } from 'features/settings/settingsSlice'
import ManageTicket from 'features/settings/ManageTicket'
import { useDispatch } from 'react-redux'

const UpdateTicketPage = () => {
    const { ticket_id } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (ticket_id) {
          dispatch(getTicketInfo(ticket_id))
        }
    }, [dispatch, ticket_id])
    return (
        <div className='content container-fluid'>
            {/* Page Header */}
            <div className='page-header'>
                <div className='content-page-header'>
                    <h5>Update Ticket</h5>
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

export default UpdateTicketPage