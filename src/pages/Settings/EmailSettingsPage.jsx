/**
 * EmailSettingsPage.jsx
 *
 * Sys Admin page to configure AWS SES email credentials.
 * Settings are stored in grant_system_settings and encrypted at rest.
 * Accessible only to Super Admins (user_role_id = 2).
 */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchEmailSettings,
  saveEmailSettings,
  testEmailSettings,
} from 'features/settings/settingsSlice'

export default function EmailSettingsPage() {
  const dispatch = useDispatch()
  const { emailSettings, emailSettingsLoading, emailTestResult } = useSelector(
    (s) => s.settings
  )

  const [form, setForm] = useState({
    aws_ses_region: 'ap-southeast-2',
    aws_access_key_id: '',
    aws_secret_access_key: '',
    from_email: '',
    from_name: 'GrantMaestro',
  })
  const [saveMsg, setSaveMsg] = useState(null)
  const [testing, setTesting] = useState(false)
  const [testEmail, setTestEmail] = useState('')

  useEffect(() => {
    dispatch(fetchEmailSettings())
  }, [dispatch])

  useEffect(() => {
    if (emailSettings && Object.keys(emailSettings).length > 0) {
      setForm((prev) => ({
        ...prev,
        aws_ses_region: emailSettings.aws_ses_region || 'ap-southeast-2',
        aws_access_key_id: emailSettings.aws_access_key_id || '',
        // secret key is never returned from API — leave blank unless user types a new one
        from_email: emailSettings.from_email || '',
        from_name: emailSettings.from_name || 'GrantMaestro',
      }))
    }
  }, [emailSettings])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaveMsg(null)
    const result = await dispatch(saveEmailSettings(form))
    if (result.payload?.success) {
      setSaveMsg({ type: 'success', text: 'Email settings saved successfully.' })
    } else {
      setSaveMsg({ type: 'danger', text: result.payload?.message || 'Failed to save settings.' })
    }
  }

  const handleTest = async () => {
    if (!testEmail) return
    setTesting(true)
    await dispatch(testEmailSettings({ to: testEmail }))
    setTesting(false)
  }

  const regions = [
    { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney) — ap-southeast-2' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore) — ap-southeast-1' },
    { value: 'us-east-1', label: 'US East (N. Virginia) — us-east-1' },
    { value: 'eu-west-1', label: 'Europe (Ireland) — eu-west-1' },
  ]

  return (
    <div className="content container-fluid">
      {/* Page Header */}
      <div className="page-header">
        <div className="content-page-header">
          <h5>Email Settings</h5>
          <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
            Configure AWS SES credentials for transactional email delivery.
          </p>
        </div>
      </div>

      <div className="row">
        {/* Left — Configuration Form */}
        <div className="col-lg-7">
          <div className="card shadow-sm mb-4">
            <div className="card-header">
              <h6 className="mb-0 fw-bold">
                <i className="fa fa-envelope me-2 text-primary" />
                AWS SES Configuration
              </h6>
            </div>
            <div className="card-body">
              {saveMsg && (
                <div className={`alert alert-${saveMsg.type} py-2`} role="alert">
                  {saveMsg.text}
                </div>
              )}
              <form onSubmit={handleSave}>
                {/* Region */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    AWS SES Region <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="aws_ses_region"
                    value={form.aws_ses_region}
                    onChange={handleChange}
                    required
                  >
                    {regions.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <div className="form-text">
                    For Australian hosting, Sydney (ap-southeast-2) is recommended.
                  </div>
                </div>

                {/* Access Key ID */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    AWS Access Key ID <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control font-monospace"
                    name="aws_access_key_id"
                    value={form.aws_access_key_id}
                    onChange={handleChange}
                    placeholder="AKIAIOSFODNN7EXAMPLE"
                    autoComplete="off"
                    required
                  />
                </div>

                {/* Secret Access Key */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    AWS Secret Access Key{' '}
                    {emailSettings?.aws_access_key_id && (
                      <span className="badge bg-success ms-2" style={{ fontSize: '11px' }}>
                        Saved
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    className="form-control font-monospace"
                    name="aws_secret_access_key"
                    value={form.aws_secret_access_key}
                    onChange={handleChange}
                    placeholder={
                      emailSettings?.aws_access_key_id
                        ? 'Leave blank to keep existing key'
                        : 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
                    }
                    autoComplete="new-password"
                  />
                  <div className="form-text">
                    Stored encrypted. Leave blank to keep the currently saved key.
                  </div>
                </div>

                {/* From Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    From Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="from_email"
                    value={form.from_email}
                    onChange={handleChange}
                    placeholder="noreply@grantmaestro.com.au"
                    required
                  />
                  <div className="form-text">
                    Must be a verified identity in your AWS SES account.
                  </div>
                </div>

                {/* From Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">From Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="from_name"
                    value={form.from_name}
                    onChange={handleChange}
                    placeholder="GrantMaestro"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={emailSettingsLoading}
                >
                  {emailSettingsLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <i className="fa fa-save me-2" />
                      Save Settings
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Test Email */}
          <div className="card shadow-sm mb-4">
            <div className="card-header">
              <h6 className="mb-0 fw-bold">
                <i className="fa fa-paper-plane me-2 text-success" />
                Send Test Email
              </h6>
            </div>
            <div className="card-body">
              <p className="text-muted small mb-3">
                Send a test email to verify your SES configuration is working correctly.
              </p>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="recipient@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
                <button
                  className="btn btn-outline-success"
                  onClick={handleTest}
                  disabled={testing || !testEmail}
                >
                  {testing ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    'Send Test'
                  )}
                </button>
              </div>
              {emailTestResult && (
                <div
                  className={`alert mt-3 py-2 ${
                    emailTestResult.success ? 'alert-success' : 'alert-danger'
                  }`}
                >
                  <i
                    className={`fa ${
                      emailTestResult.success ? 'fa-check-circle' : 'fa-times-circle'
                    } me-2`}
                  />
                  {emailTestResult.success
                    ? 'Test email sent successfully. Check your inbox.'
                    : emailTestResult.message || 'Failed to send test email.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right — Status & Help */}
        <div className="col-lg-5">
          {/* Current Status */}
          <div className="card shadow-sm mb-4">
            <div className="card-header">
              <h6 className="mb-0 fw-bold">
                <i className="fa fa-info-circle me-2 text-info" />
                Current Status
              </h6>
            </div>
            <div className="card-body p-0">
              <table className="table table-sm table-borderless mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted ps-3">Region</td>
                    <td className="pe-3">
                      {emailSettings?.aws_ses_region || (
                        <span className="text-danger">Not set</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted ps-3">Access Key ID</td>
                    <td className="pe-3">
                      {emailSettings?.aws_access_key_id ? (
                        <span className="text-success">
                          <i className="fa fa-check-circle me-1" />
                          Configured
                        </span>
                      ) : (
                        <span className="text-danger">
                          <i className="fa fa-times-circle me-1" />
                          Not set
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted ps-3">Secret Key</td>
                    <td className="pe-3">
                      {emailSettings?.aws_access_key_id ? (
                        <span className="text-success">
                          <i className="fa fa-check-circle me-1" />
                          Saved (encrypted)
                        </span>
                      ) : (
                        <span className="text-danger">
                          <i className="fa fa-times-circle me-1" />
                          Not set
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted ps-3">From Email</td>
                    <td className="pe-3">
                      {emailSettings?.from_email || (
                        <span className="text-danger">Not set</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted ps-3">From Name</td>
                    <td className="pe-3">
                      {emailSettings?.from_name || (
                        <span className="text-muted">GrantMaestro (default)</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted ps-3">Email Delivery</td>
                    <td className="pe-3">
                      {emailSettings?.aws_access_key_id && emailSettings?.from_email ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-warning text-dark">Not Configured</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Help */}
          <div className="card border-0 bg-light mb-4">
            <div className="card-body">
              <h6 className="card-title fw-bold">
                <i className="fa fa-question-circle me-2 text-primary" />
                Setup Guide
              </h6>
              <ol className="ps-3 mb-0 small">
                <li className="mb-2">
                  Log in to the{' '}
                  <a
                    href="https://console.aws.amazon.com/ses/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    AWS SES Console
                  </a>
                </li>
                <li className="mb-2">
                  Verify your sending domain or email address under{' '}
                  <strong>Verified Identities</strong>
                </li>
                <li className="mb-2">
                  Create an IAM user with <strong>AmazonSESFullAccess</strong> policy
                  and generate an Access Key
                </li>
                <li className="mb-2">
                  If your account is in <strong>SES Sandbox</strong>, request
                  production access to send to unverified recipients
                </li>
                <li>
                  Enter the credentials above and send a test email to confirm delivery
                </li>
              </ol>
            </div>
          </div>

          {/* Emails sent by the platform */}
          <div className="card border-0 bg-light">
            <div className="card-body">
              <h6 className="card-title fw-bold">
                <i className="fa fa-list me-2 text-secondary" />
                Automated Emails
              </h6>
              <ul className="ps-3 mb-0 small">
                <li>Welcome email on registration</li>
                <li>OTP verification on sign-up</li>
                <li>Team member invitation with temporary password</li>
                <li>Forced password reset on first login</li>
                <li>Task assignment &amp; completion notifications</li>
                <li>Grant deadline warnings (7 days &amp; 1 day)</li>
                <li>Subscription expiry warnings (14 days &amp; 3 days)</li>
                <li>Acquittal reminders (30 days &amp; 7 days)</li>
                <li>Payment confirmation</li>
                <li>Seat limit warnings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
