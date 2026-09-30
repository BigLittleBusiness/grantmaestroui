import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    twoFactor: false,
    notifyFinance: false,
    gdprCompliance: false,
    emailAddresses: ['', '', ''],
    dataRetention: '1 Month',
  })

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target
    setSettings((prev) => ({
      ...prev,
      [id]: checked,
    }))
  }

  const handleEmailChange = (index, value) => {
    const updatedEmails = [...settings.emailAddresses]
    updatedEmails[index] = value
    setSettings((prev) => ({
      ...prev,
      emailAddresses: updatedEmails,
    }))
  }

  const handleSelectChange = (e) => {
    const { id, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  return (
    <div className='content container-fluid'>
      {/* Page Header */}
      <div className='page-header'>
        <div className='content-page-header'>
          <h5>Settings</h5>
        </div>
      </div>
      {/* /Page Header */}

      <div className='content container-fluid pb-0 p-0'>
        {/* Security Settings */}
        <div className='card shadow-sm'>
          <div className='card-header'>
            <h5>Security Settings</h5>
          </div>
          <div className='card-body'>
            <div className='mb-4'>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  id='twoFactor'
                  checked={settings.twoFactor}
                  onChange={handleCheckboxChange}
                />
                <label className='form-check-label' htmlFor='twoFactor'>
                  Enable Two-Factor Authentication
                </label>
              </div>
              <button className='btn btn-warning mt-2'>Reset Password</button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className='card shadow-sm'>
          <div className='card-header'>
            <h5>Notifications</h5>
          </div>
          <div className='card-body'>
            <div className='mb-4'>
              <label className='form-label'>Notify Finance</label>
              <div className='form-check form-switch'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  id='notifyFinance'
                  checked={settings.notifyFinance}
                  onChange={handleCheckboxChange}
                />
                <label className='form-check-label' htmlFor='notifyFinance'>
                  Yes/No
                </label>
              </div>
              {settings.emailAddresses.map((email, index) => (
                <input
                  key={index}
                  type='email'
                  className='form-control my-2'
                  placeholder={`Email Address ${index + 1}`}
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                />
              ))}
              <small className='text-muted'>
                Emails will be sent when a grant is won
              </small>
            </div>
          </div>
        </div>

        {/* Billing & Subscription */}
        <div className='card shadow-sm'>
          <div className='card-header'>
            <h5>Billing & Subscription</h5>
          </div>
          <div className='card-body'>
            <div className='mb-4'>
              <a href='/payment/checkout' className='btn btn-primary'>
                Subscription &amp; Payment
              </a>
              <a href='/seat-usage' className='btn btn-secondary ms-2'>
                View Current Uses
              </a>
            </div>
            <div className='mb-4'>
              <h5 className='mb-3'>Data Management</h5>
              <button className='btn btn-info me-2'>Export Data</button>
              <button className='btn btn-info'>Backup Data</button>
              <label className='mt-2'>Data Retention Policy</label>
              <select
                className='form-select mt-2'
                id='dataRetention'
                value={settings.dataRetention}
                onChange={handleSelectChange}
              >
                <option>1 Month</option>
                <option>6 Months</option>
                <option>1 Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className='card shadow-sm'>
          <div className='card-header'>
            <h5>Privacy Settings</h5>
          </div>
          <div className='card-body'>
            <div className='mb-4'>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  id='gdprCompliance'
                  checked={settings.gdprCompliance}
                  onChange={handleCheckboxChange}
                />
                <label className='form-check-label' htmlFor='gdprCompliance'>
                  Enable GDPR Compliance
                </label>
              </div>
              <button className='btn btn-danger mt-2'>
                Edit Privacy Settings
              </button>
            </div>
          </div>
        </div>

        {/* Support & Help */}
        <div className='card shadow-sm'>
          <div className='card-header'>
            <h5>Support & Help</h5>
          </div>
          <div className='card-body'>
            <div className='mb-4'>
              <Link to='/submit-ticket' className='btn btn-success me-2'>Submit a Ticket</Link>
              <button className='btn btn-success'>View FAQs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
