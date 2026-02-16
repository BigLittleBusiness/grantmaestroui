import React from 'react'
import Register from '../../features/auth/Register'

const RegisterPage = () => {
  return (
    <div className='login-30 tab-box'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg-6 col-md-12 bg-img'>
            <div id='bg'></div>
          </div>
          <div className='col-lg-6 col-md-12 form-section'>
            <Register />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
