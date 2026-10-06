import React from 'react'
import 'components/LandingPage/Footer.css'
import BrandLogoWhite from 'assets/brand/grantmaestro-logo-white-transparent.png'

const LinkGroup = ({ title, children }) => (
  <nav className='footer-link-group' aria-label={title}>
    <p className='footer-heading'>{title}</p>
    <ul className='footer-links'>{children}</ul>
  </nav>
)

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id='footer-main'>
      <div className='footer-top'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-4 col-md-6 mb-4'>
              <div className='footer-brand'>
                <img src={BrandLogoWhite} alt='GrantMaestro' className='footer-logo' />
                <p className='footer-tagline'>The practical grant-management workspace for Australian and New Zealand councils and organisations managing inward funding.</p>
                <p className='footer-support-note'>Learn how GrantMaestro handles personal information, service providers and support requests in the published policies below.</p>
              </div>
            </div>
            <div className='col-lg-2 col-md-6 mb-4'>
              <LinkGroup title='Product'>
                <li><a href='/#service-features'>Features</a></li>
                <li><a href='/#pricing_section'>Pricing</a></li>
                <li><a href='/councils'>For councils</a></li>
                <li><a href='/grant-portfolio-readiness'>Readiness Snapshot</a></li>
                <li><a href='/register'>Start Free Trial</a></li>
                <li><a href='/login'>Login</a></li>
              </LinkGroup>
            </div>
            <div className='col-lg-2 col-md-6 mb-4'>
              <LinkGroup title='Resources'>
                <li><a href='/councils'>Why GrantMaestro for councils</a></li>
                <li><a href='/grant-portfolio-readiness'>Grant portfolio diagnostic</a></li>
                <li><a href='/support'>Support centre</a></li>
                <li><a href='/contact'>Contact form</a></li>
              </LinkGroup>
            </div>
            <div className='col-lg-2 col-md-6 mb-4'>
              <LinkGroup title='Legal'>
                <li><a href='/privacy-policy'>Privacy Policy</a></li>
                <li><a href='/terms-of-service'>Terms of Service</a></li>
                <li><a href='/terms-of-service#billing'>Billing, trial and cancellation</a></li>
              </LinkGroup>
            </div>
            <div className='col-lg-2 col-md-6 mb-4'>
              <LinkGroup title='Support'>
                <li><a href='/support'><i className='fa fa-life-ring' aria-hidden='true'></i> Support centre</a></li>
                <li><a href='/contact?topic=support'>Submit a support enquiry</a></li>
                <li className='footer-support-note'>For help with access, billing, grants workspace or technical issues, use the secure form.</li>
              </LinkGroup>
            </div>
          </div>
        </div>
      </div>
      <div className='footer-bottom'>
        <div className='container'>
          <div className='row align-items-center'>
            <div className='col-md-8'>
              <p className='footer-copyright'>{currentYear} &copy; <strong>GrantMaestro</strong>. All rights reserved. &nbsp;|&nbsp; <a href='/privacy-policy'>Privacy Policy</a> &nbsp;|&nbsp; <a href='/terms-of-service'>Terms of Service</a></p>
            </div>
            <div className='col-md-4 text-md-end'>
              <p className='footer-privacy-note'><i className='fa fa-lock' aria-hidden='true'></i> Privacy and data-handling details are available in our Privacy Policy.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
