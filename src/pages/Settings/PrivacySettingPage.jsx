import React, { useState } from 'react'

export default function PrivacySettingPage() {
  const [settings, setSettings] = useState({
    emailNotifications: false,
    twoFactor: false,
  })

  const handleChange = (e) => {
    const { id, checked } = e.target
    setSettings((prevSettings) => ({
      ...prevSettings,
      [id]: checked,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Saved Settings:', settings)
    // Add logic to save settings to the backend or state management
    alert('Privacy settings saved successfully!')
  }

  return (
    <div className='content container-fluid'>
      {/* Page Header */}
      <div className='page-header'>
        <div className='content-page-header'>
          <h5>Edit Privacy Settings</h5>
        </div>
      </div>
      {/* /Page Header */}

      <div className='content container-fluid pb-0 p-0'>
        <div className='card shadow-sm'>
          <div className='card-header'>
            <h5>Edit Privacy</h5>
          </div>
          <div className='card-body'>
            <div className='mb-4'>
              <form onSubmit={handleSubmit}>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id='emailNotifications'
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                  />
                  <label
                    className='form-check-label'
                    htmlFor='emailNotifications'
                  >
                    Allow email notifications
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id='twoFactor'
                    checked={settings.twoFactor}
                    onChange={handleChange}
                  />
                  <label className='form-check-label' htmlFor='twoFactor'>
                    Enable two-factor authentication
                  </label>
                </div>
                <button type='submit' className='btn btn-primary btn-save mt-3'>
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
