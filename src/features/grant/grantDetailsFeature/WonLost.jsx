import React from 'react'

export default function WonLost({ grant }) {
  return (
    <div className='col-xl-4 col-md-4'>
      <div
        className='card super-admin-dash-card p-2 pt-3'
        style={{ height: '415px', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <div className='card-header'>
          <div className='row align-center'>
            <div className='col'>
              <h5 className='card-title'>Won/Lost</h5>
            </div>
          </div>
        </div>
        <div className='card-body p-0'>
          <div className='row'>
            <div className='dash-plane-list pt-2 pb-2'>
              <div className='plane-info'>
                <div className='plane-name'>
                  <strong>Closing Date:</strong>
                </div>
              </div>
              <span className='plane-rate'>{grant.closing_date}</span>
            </div>
            <div className='dash-plane-list pt-2 pb-2'>
              <div className='plane-info'>
                <div className='plane-name'>
                  <strong>Outcome Date:</strong>
                </div>
              </div>
              <span className='plane-rate'>{grant.outcome_date}</span>
            </div>
            <div className='dash-plane-list pt-2 pb-2'>
              <div className='plane-info'>
                <div className='plane-name'>
                  <strong>Result:</strong>
                </div>
              </div>
              <span className='plane-rate'>{grant.outcome}</span>
            </div>
            <div className='dash-plane-list pt-2 pb-2'>
              <div className='plane-info'>
                <div className='plane-name'>
                  <strong>Agreement Signed:</strong>
                </div>
              </div>
              <span className='plane-rate'>{grant.agreement_signed}</span>
            </div>
            <div className='dash-plane-list pt-2 pb-2'>
              <div className='plane-info'>
                <div className='plane-name'>
                  <strong>Funds Released:</strong>
                </div>
              </div>
              <span className='plane-rate'>{grant.received_fund_amount}</span>
            </div>
            <div className='dash-plane-list pt-2 pb-2'>
              <div className='plane-info'>
                <div className='plane-name'>
                  <strong>Learnings:</strong>
                </div>
              </div>
              <span className='plane-rate'>{grant.learning}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
