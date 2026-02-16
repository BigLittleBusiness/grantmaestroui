import React from 'react'
import GrantDetails from 'features/grant/GrantDetails'
import { Link, useParams } from 'react-router-dom'

const GrantDetailsPage = () => {
  const { id } = useParams()

  return (
    <div className='content container-fluid'>
      <div className='page-header'>
        <div className='content-page-header'>
          <h5>Grant Details</h5>
          <div className='list-btn'>
            <ul className='filter-list'>
              <li>
                <Link className='btn btn-primary' to={`/grant/edit/${id}`}>
                  <i className='fa fa-edit me-2' aria-hidden='true'></i>Edit
                  Grant
                </Link>
              </li>
              <li>
                <Link className='btn btn-primary' to='/grant'>
                  <i className='fa fa-eye me-2' aria-hidden='true'></i>View All
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <GrantDetails />
    </div>
  )
}

export default GrantDetailsPage
