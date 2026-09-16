import React from 'react'
import Register from '../../features/auth/Register'
import './RegisterPage.css'

const RegisterPage = () => {
  return (
    <div className='login-30 tab-box register-page-layout'>
      <div className='container-fluid h-100'>
        <div className='row h-100'>
          {/* Left panel — contextual reassurance */}
          <div className='col-lg-6 col-md-12 register-panel-left d-none d-lg-flex'>
            <div className='register-panel-content'>
              <div className='register-panel-logo'>
                <h2 className='text-white'>Grant Maestro</h2>
                <p className='text-white-50'>Grant management built for local government.</p>
              </div>

              <div className='register-panel-benefits'>
                <div className='register-benefit-item'>
                  <span className='register-benefit-icon' aria-hidden='true'><i className='fa fa-check-circle'></i></span>
                  <div>
                    <strong>14-day free trial</strong>
                    <p>Full access from day one. No credit card required.</p>
                  </div>
                </div>
                <div className='register-benefit-item'>
                  <span className='register-benefit-icon' aria-hidden='true'><i className='fa fa-map-marker'></i></span>
                  <div>
                    <strong>Australian-hosted infrastructure</strong>
                    <p>Designed for Australian organisations that need clear grant records, shared work and practical governance.</p>
                  </div>
                </div>
                <div className='register-benefit-item'>
                  <span className='register-benefit-icon' aria-hidden='true'><i className='fa fa-clipboard'></i></span>
                  <div>
                    <strong>Built for public sector accountability</strong>
                    <p>Keep grant decisions, supporting notes and documents together for clearer internal accountability.</p>
                  </div>
                </div>
                <div className='register-benefit-item'>
                  <span className='register-benefit-icon' aria-hidden='true'><i className='fa fa-calendar'></i></span>
                  <div>
                    <strong>Keep deadlines visible</strong>
                    <p>Track closing dates, milestone reporting and acquittal commitments in a shared work queue.</p>
                  </div>
                </div>
                <div className='register-benefit-item'>
                  <span className='register-benefit-icon' aria-hidden='true'><i className='fa fa-users'></i></span>
                  <div>
                    <strong>Your whole team, in sync</strong>
                    <p>Assign tasks across departments and track progress in real time.</p>
                  </div>
                </div>
              </div>

              <div className='register-panel-security'>
                <span className='register-security-badge'><i className='fa fa-shield' aria-hidden='true'></i> Email verification</span>
                <span className='register-security-badge'><i className='fa fa-map-marker' aria-hidden='true'></i> Australian-hosted infrastructure</span>
                <span className='register-security-badge'><i className='fa fa-file-text' aria-hidden='true'></i> Privacy Policy available</span>
              </div>
            </div>
          </div>

          {/* Right panel — registration form */}
          <div className='col-lg-6 col-md-12 form-section register-form-col'>
            <Register />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
