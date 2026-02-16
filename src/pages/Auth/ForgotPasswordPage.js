import React from 'react'
import ForgotPassword from 'features/auth/ForgotPassword'

const ForgotPasswordPage = () => {
  return (
    <div className="login-30 tab-box">
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-6 col-md-12 bg-img">
                    <div id="bg">
                    </div>
                </div>
                <div className="col-lg-6 col-md-12 form-section">
                    <ForgotPassword/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ForgotPasswordPage