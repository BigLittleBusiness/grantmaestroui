import React from 'react'

export default function Internal({ grant }) {
  return (
    <div className='col-xl-4 col-md-4'>
      <div
        className='card super-admin-dash-card p-2 pt-3'
        style={{ height: '415px', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <div className='card-header'>
          <div className='row align-center'>
            <div className='col'>
              <h5 className='card-title'>Internal</h5>
            </div>
          </div>
        </div>
        <div className='card-body p-0'>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Department:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.submission_department}</span>
          </div>

          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Representative:</strong>
              </div>
            </div>
            <span className='plane-rate'>
              {grant.submission_department_representative}
            </span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Project Name:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.submission_project_name}</span>
          </div>

          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Reasoning:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.submission_reasoning}</span>
          </div>

          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Due Date:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.grant_submission_date}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Co-contribution:</strong>
              </div>
            </div>
            <span className='plane-rate'>
              {grant.submission_co_contributor}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
