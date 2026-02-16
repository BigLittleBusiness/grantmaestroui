import React, { useState, useEffect } from 'react'
import GrantAppliedFor from 'features/reports'
import { fetchGrants } from 'features/grant/grantSlice'
import { useDispatch, useSelector } from 'react-redux'

const ReportPage = () => {
  const dispatch = useDispatch()
  const grants = useSelector((state) => state.grant.grants) || []
  const [appliedGrants, setAppliedGrants] = useState([])
  const [grantsOwn, setGrantOwn] = useState(0)
  const [grantsLost, setGrantsLost] = useState(0)
  const [grantAppliedValue, setgrantAppliedValue] = useState(0)
  useEffect(() => {
    dispatch(fetchGrants({ searchText: '' }))
  }, [dispatch])

  useEffect(() => {
    setAppliedGrants(
      grants?.filter(
        (g) => g.submissionDate && g.submissionDate.trim() !== ''
      ) || []
    )
    setGrantOwn(
      grants?.filter((g) => g.outcome && g.outcome?.toLowerCase() === 'won')
        ?.length
    )
    setGrantsLost(
      grants?.filter((g) => g.outcome && g.outcome?.toLowerCase() === 'lost')
        ?.length
    )
    setgrantAppliedValue(
      grants
        ?.filter((g) => g.submissionDate && g.submissionDate.trim() !== '')
        .reduce(
          (sum, gr) => sum + (parseFloat(gr.funding_sought_amount) || 0),
          0
        )
    )
  }, [grants])

  const downloadExcel = () => {
    if (appliedGrants.length > 0) {
      const headers = [
        'Grant Title',
        'Outcome',
        'Closing Date',
        'Opening Date',
        'Funds Sought',
      ]
      const rows = appliedGrants.map((grant) => [
        `"${grant.grant_title || ''}"`,
        `"${grant.outcome || ''}"`,
        `"${grant.closingDate || ''}"`,
        `"${grant.opening_date || ''}"`,
        `"${grant.funding_sought_amount || ''}"`,
      ])

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'applied_grants.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert('No applied grants available to download.')
    }
  }

  return (
    <div className='content container-fluid grantList'>
      <div className='page-header mb-0'>
        <div className='content-page-header mb-0'>
          <h5>Grant Reports</h5>
          <div className='list-btn' style={{ justifySelf: 'end' }}>
            <ul className='filter-list'>
              <li>
                <div
                  className='dropdown dropdown-action'
                  data-bs-toggle='tooltip'
                  data-bs-placement='bottom'
                  title='Download'
                >
                  <button className='btn-filters btn' onClick={downloadExcel}>
                    Export
                    <span>
                      <i className='fe fe-download'></i>
                    </span>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-sm-12'>
          <div className='card-table'>
            <div className='card-body'>
              <GrantAppliedFor appliedGrants={appliedGrants} />
            </div>
            <div className='card-body'>
              <div class='super-admin-dash-card mt-1  mb-0 border-0 p-0'>
                <div class='row'>
                  <div class='col-md-5'>
                    <div class='dash-plane-list pt-3 pb-3 card bg-white'>
                      <div class='plane-info'>
                        <div class='plane-name'>
                          <strong>Grant Value Applied For:</strong>
                        </div>
                      </div>
                      <span class='plane-rate'>${grantAppliedValue}</span>
                    </div>
                    <div class='dash-plane-list pt-3 card pb-3 bg-white'>
                      <div class='plane-info'>
                        <div class='plane-name'>
                          <strong>Grants Won vs Grants Lost:</strong>
                        </div>
                      </div>
                      <span class='plane-rate'>
                        {' '}
                        {grantsOwn} Won / {grantsLost} Lost
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportPage
