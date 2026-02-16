import React, { useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { fetchtickets, updateTicketStatus, deleteSupportTicket } from '../../features/settings/settingsSlice'

const TicketListPage = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const tickets = useSelector((state) => state.settings.tickets)
  console.log(tickets)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleAddTicketClick = () => {
    navigate('/submit-ticket')
  }
  useEffect(() => {
        dispatch(fetchtickets())
    }, [dispatch])
  const toggleCollapse = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index)
  }
  const handleDeleteClick = (ticketId) => {
    console.log('Delete ticket with ID:', ticketId)
    dispatch(deleteSupportTicket(ticketId))
  }
  const markResolved = (ticketId) => {
    console.log('update ticket status with ID:', ticketId)
    dispatch(updateTicketStatus({ticket_id : ticketId, ticket_status: 'resolved'}))
      
  }
  return (
    <div className='content container-fluid ticketList'>
      <div className='page-header'>
        <div className='content-page-header'>
          <h5>List of Support Tickets</h5>
          <div className='list-btn'>
              <ul className='filter-list'>
                <li>
                  <button
                    className='btn btn-primary'
                    onClick={handleAddTicketClick}
                  >
                    <i className='fa fa-plus-circle me-2' aria-hidden='true'></i>
                    Add Support Ticket
                  </button>
                </li>
              </ul>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='card-body p-0'>
            <div className='accordion custom-accordion' id='custom-accordion-one'>
              {tickets.map((item, index) => (
              <div className='card mb-1' key={index}>
                <div className='card-header' id={`heading${index}`}>
                <h6 className='accordion-faq m-0 position-relative'>
                  <Link
                    className='custom-accordion-title text-reset d-block no-underline'
                    onClick={() => toggleCollapse(index)}
                    aria-expanded={activeIndex === index ? 'true' : 'false'}
                    aria-controls={`collapse${index}`}
                  >
                    {item.ticket_title}
                    <i
                    className={`fa fa-chevron-${
                      activeIndex === index ? 'up' : 'down'
                    } accordion-arrow`}
                    style={{ float: 'right' }}
                  ></i> 
                  </Link>
                </h6>
              </div>
              <div
                id={`collapse${index}`}
                className={`collapse ${activeIndex === index ? 'show' : ''}`}
                aria-labelledby={`heading${index}`}
                data-bs-parent='#custom-accordion-one'
              >
                <div className='dash-plane-list pt-2 pb-2'>
                  <div className='plane-info'>
                    <div className='plane-name'>
                      <strong>{item.ticket_description}</strong>
                    </div>
                    </div>
                      <span className='plane-rate'>{item.ticket_status}</span>
                    </div>
                    <button
                    onClick={() => navigate(`/update-ticket/${item.ticket_id}`)}
                    className='btn btn-sm btn-primary me-2'
                  >
                    <i className='fa fa-edit'></i>
                  </button>
                  <button
                    onClick={() => markResolved(item.ticket_id)}
                    className='btn btn-sm btn-secondary me-2'
                  >
                    <i className='fa fa-eye'></i>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item.ticket_id)}
                    className='btn btn-sm btn-danger me-2'
                  >
                    <i className='fa fa-trash'></i>
                  </button>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  )
}

export default TicketListPage