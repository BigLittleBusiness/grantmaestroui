import React from 'react'

export default function GeneralInformation({ grant }) {
  return (
    <div className='col-xl-4 col-md-4 generalInformation'>
      <div
        className='card super-admin-dash-card p-2 pt-3'
        style={{ height: '415px', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <div className='card-header'>
          <div className='row align-center'>
            <div className='col'>
              <h5 className='card-title'>General Information</h5>
            </div>
          </div>
        </div>
        <div className='card-body p-0'>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Grant Title</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.grant_title}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Grant URL:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.origination_url}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Fund Originator:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.fund_originator}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Funds Sought:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.funding_sought_amount}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Max Funds:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.max_fund_amount}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Assigned To:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.assignedTo}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
