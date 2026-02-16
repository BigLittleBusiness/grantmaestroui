import React from 'react'
import GrantEdit from '../../features/grant/GrantEdit'
import { Link } from 'react-router-dom'

const GrantEditPage = () => {
  return (
    <div className='content container-fluid grantCreate'>
      <div className='page-header'>
        <div className='content-page-header'>
          <h5>Grant Update</h5>
          <div className='list-btn'>
            <ul className='filter-list'>
              <li>
                <Link className='btn btn-primary' to='/grant'>
                  <i className='fa fa-eye me-2' aria-hidden='true'></i>View All
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <GrantEdit />
    </div>
  )
}

export default GrantEditPage
