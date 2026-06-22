import { Link } from 'react-router-dom'
import GrantCreate from '../../features/grant/GrantCreate'

const GrantCreatePage = () => {
  return (
    <div className='content container-fluid grantCreate'>
      <div className='page-header'>
        <div className='content-page-header'>
          <h5>Grant Create</h5>
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
      <GrantCreate />
    </div>
  )
}

export default GrantCreatePage
