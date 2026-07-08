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
                  <span className='register-benefit-icon'>✅</span>
                  <div>
                    <strong>14-day free trial</strong>
                    <p>Full access from day one. No credit card required.</p>
                  </div>
                </div>
                <div className='register-benefit-item'>
                  <span className='register-benefit-icon'>🔒</span>
                  <div>
                    <strong>Secure &amp; Australian Hosted</strong>
                    <p>Your data is encrypted and stored on AWS Australian servers, never shared with third parties.</p>
                  </div>
                </div>
                <div className='register-benefit-item'>
                  <span className='register-benefit-icon'>📋</span>
                  <div>
                    <strong>Built for public sector accountability</strong>
                    <p>Full audit trail and document management meets local government transparency requirements.</p>
                  </div>
                </div>
                <div className='register-benefit-item'>
                  <span className='register-benefit-icon'>🗓️</span>
                  <div>
                    <strong>Never miss a deadline</strong>
                    <p>Automated reminders for closing dates, milestone reports, and acquittals.</p>
                  </div>
                </div>
                <div className='register-benefit-item'>
                  <span className='register-benefit-icon'>👥</span>
                  <div>
                    <strong>Your whole team, in sync</strong>
                    <p>Assign tasks across departments and track progress in real time.</p>
                  </div>
                </div>
              </div>

              <div className='register-panel-security'>
                <span className='register-security-badge'>🔐 2FA Account Verification</span>
                <span className='register-security-badge'>🇦🇺 Australian Hosted</span>
                <span className='register-security-badge'>🔒 Data Encrypted</span>
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
