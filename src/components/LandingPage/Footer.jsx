import React from 'react'
import 'components/LandingPage/Footer.css'
import ColorLogo from 'assets/img/color_logo.png'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id='footer-main'>
      <div className='footer-top'>
        <div className='container'>
          <div className='row'>
            {/* Brand column */}
            <div className='col-lg-4 col-md-6 mb-4'>
              <div className='footer-brand'>
                <img src={ColorLogo} alt='Grant Maestro' className='footer-logo' />
                <p className='footer-tagline'>
                  The all-in-one grant management platform built for Australian
                  and New Zealand local governments.
                </p>
                <div className='footer-security-badges'>
                  <span className='footer-badge'>
                    <i className='fa fa-lock'></i> Secure &amp; Encrypted
                  </span>
                  <span className='footer-badge'>
                    <i className='fa fa-map-marker'></i> Australian Hosted
                  </span>
                  <span className='footer-badge'>
                    <i className='fa fa-shield'></i> Data Privacy Compliant
                  </span>
                </div>
              </div>
            </div>

            {/* Product links */}
            <div className='col-lg-2 col-md-6 mb-4'>
              <h6 className='footer-heading'>Product</h6>
              <ul className='footer-links'>
                <li><a href='#service-features'>Features</a></li>
                <li><a href='#pricing_section'>Pricing</a></li>
                <li><a href='/councils'>For Councils</a></li>
                <li><a href='/register'>Start Free Trial</a></li>
                <li><a href='/login'>Login</a></li>
              </ul>
            </div>

            {/* Company links */}
            <div className='col-lg-2 col-md-6 mb-4'>
              <h6 className='footer-heading'>Company</h6>
              <ul className='footer-links'>
                <li><a href='#fun-facts'>About Us</a></li>
                <li><a href='#clients-testmonials'>Our Clients</a></li>
                <li><a href='mailto:hello@grantmaestro.com.au'>Contact Us</a></li>
              </ul>
            </div>

            {/* Legal links */}
            <div className='col-lg-2 col-md-6 mb-4'>
              <h6 className='footer-heading'>Legal</h6>
              <ul className='footer-links'>
                <li><a href='/privacy-policy'>Privacy Policy</a></li>
                <li><a href='/terms-of-service'>Terms of Service</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className='col-lg-2 col-md-6 mb-4'>
              <h6 className='footer-heading'>Support</h6>
              <ul className='footer-links'>
                <li>
                  <a href='mailto:support@grantmaestro.com.au'>
                    <i className='fa fa-envelope'></i> Email Support
                  </a>
                </li>
                <li className='footer-support-note'>
                  We respond within 24–48 hours on business days.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='footer-bottom'>
        <div className='container'>
          <div className='row align-items-center'>
            <div className='col-md-8'>
              <p className='footer-copyright'>
                {currentYear} &copy; <strong>Grant Maestro</strong>. All rights reserved.
                &nbsp;|&nbsp;
                <a href='/privacy-policy'>Privacy Policy</a>
                &nbsp;|&nbsp;
                <a href='/terms-of-service'>Terms of Service</a>
              </p>
            </div>
            <div className='col-md-4 text-md-end'>
              <p className='footer-privacy-note'>
                <i className='fa fa-lock'></i> Your data is never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
