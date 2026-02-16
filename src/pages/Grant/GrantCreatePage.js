import { useEffect } from 'react'
import GrantCreate from '../../features/grant/GrantCreate'


const GrantCreatePage = () => {
  
  return (
    <div className='content container-fluid grantCreate'>
      <div class='page-header'>
        <div class='content-page-header'>
          <h5>Grant Create</h5>
          <div class='list-btn'>
            <ul class='filter-list'>
              <li>
                <a class='btn btn-primary' href='grant-list.html'>
                  <i class='fa fa-eye me-2' aria-hidden='true'></i>View All
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <GrantCreate />
    </div>
  )
}

export default GrantCreatePage
