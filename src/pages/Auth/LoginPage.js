import React from 'react';
import Login from 'features/auth/Login';

export default function LoginPage() {
  return (
    <div className="login-30 tab-box">
    <div className="container-fluid">
        <div className="row">
            <div className="col-lg-6 col-md-12 bg-img">
                   <div id="bg">
                </div>
            </div>
            <div className="col-lg-6 col-md-12 form-section">
                <Login/>
            </div>
        </div>
    </div>
</div>
  );
}
