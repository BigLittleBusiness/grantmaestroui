import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGrants } from 'features/grant/grantSlice'

function calculateProgress(grant) {
  const { opening_date, submission_date, closing_date, outcome } = grant
  const currentDate = new Date()

  if (outcome) {
    return 100 // Grant outcome has a value
  }
  if (closing_date && new Date(closing_date) < currentDate) {
    return 75 // Passed closing date
  }
  if (submission_date && new Date(submission_date) < currentDate) {
    return 50 // Passed submission date
  }
  if (opening_date && new Date(opening_date) < currentDate) {
    return 25 // Passed opening date
  }
  return 0 // No progress yet
}

export default function AdminGrantCard() {
  const grants = useSelector((state) => state.grant?.grants)
  const [grantsList, setGrantsList] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    if (!grants.length) {
      dispatch(fetchGrants())
    }
  }, [dispatch, grants.length])

  useEffect(() => {
    const grantList = grants.map((grant) => ({
      name: grant?.grant_title,
      id: grant?.organization_grant_id,
      progress: calculateProgress(grant),
    }))
    setGrantsList(grantList)
  }, [grants])

  const handleViewAllClick = () => {
    window.location.href = '/grant' // Redirect to the grants list page
  }

  return (
    <div className='col-xl-7 d-flex'>
      <div className='card super-admin-dash-card'>
        <div className='card-body p-0'>
          <div className='table-responsive mytable'>
            <table className='table table-stripped table-hover'>
              <tbody>
                <tr>
                  <td bgcolor='white'>
                    <h5
                      className='card-title'
                      style={{ fontSize: '18px', fontWeight: '600' }}
                    >
                      Grants Applying For
                    </h5>
                  </td>
                  <td bgcolor='white'>
                    <h5
                      className='card-title'
                      style={{ fontSize: '18px', fontWeight: '600' }}
                    >
                      Progress
                    </h5>
                  </td>
                  <td bgcolor='white' align='right'>
                    <button
                      onClick={handleViewAllClick}
                      className='btn-right btn btn-sm btn-primary'
                      style={{ padding: '8px 15px' }}
                    >
                      View All
                    </button>
                  </td>
                </tr>
                {grantsList.map((grant, index) => (
                  <tr key={index}>
                    <td>
                      <h2 className='table-avatar'>
                        <Link to={`/grant/details/${grant.id}`}>
                          {grant.name}
                        </Link>
                      </h2>
                    </td>
                    <td>
                      <div className='progress'>
                        <div
                          className='progress-bar'
                          style={{ width: `${grant.progress}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className='text-end'>
                      <Link
                        to={`/grant/details/${grant.id}`}
                        className='btn-right btn btn-sm btn-primary'
                        style={{ color: 'white' }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
