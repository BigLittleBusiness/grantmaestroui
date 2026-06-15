import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchPinSettings,
  savePinSettings,
  testPinConnection,
  clearPinTestResult,
} from '../../features/settings/settingsSlice'
import './settings.css'

/**
 * PinPaymentsSettingsPage
 *
 * System Admin-only page for configuring Pin Payments credentials.
 * Accessible at /admin/pin-settings (Super Admin only).
 *
 * Features:
 *   - Load existing configuration on mount (secret key shown as masked)
 *   - Save / update all credentials
 *   - Test connection against the Pin Payments API
 *   - Clear visual feedback for success / error states
 */
export default function PinPaymentsSettingsPage() {
  const dispatch = useDispatch()
  const { pinSettings, pinSettingsLoading, pinTestResult } = useSelector(
    (state) => state.settings
  )

  const [form, setForm] = useState({
    pin_publishable_key: '',
    pin_secret_key: '',
    pin_environment: 'test',
    pin_currency: 'AUD',
    pin_webhook_secret: '',
  })

  const [secretKeyChanged, setSecretKeyChanged] = useState(false)
  const [webhookSecretChanged, setWebhookSecretChanged] = useState(false)

  // Load existing settings on mount
  useEffect(() => {
    dispatch(fetchPinSettings())
    return () => dispatch(clearPinTestResult())
  }, [dispatch])

  // Populate form when settings arrive from the API
  useEffect(() => {
    if (pinSettings && Object.keys(pinSettings).length > 0) {
      setForm((prev) => ({
        ...prev,
        pin_publishable_key: pinSettings.pin_publishable_key || '',
        // Secret key is masked by the API – keep the placeholder visible
        pin_secret_key: pinSettings.pin_secret_key || '',
        pin_environment: pinSettings.pin_environment || 'test',
        pin_currency: pinSettings.pin_currency || 'AUD',
        pin_webhook_secret: pinSettings.pin_webhook_secret || '',
      }))
    }
  }, [pinSettings])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'pin_secret_key') setSecretKeyChanged(true)
    if (name === 'pin_webhook_secret') setWebhookSecretChanged(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const payload = {
      pin_publishable_key: form.pin_publishable_key,
      pin_environment:     form.pin_environment,
      pin_currency:        form.pin_currency,
    }
    // Only send secret fields if they were actually changed by the admin
    if (secretKeyChanged && !form.pin_secret_key.startsWith('•')) {
      payload.pin_secret_key = form.pin_secret_key
    }
    if (webhookSecretChanged && !form.pin_webhook_secret.startsWith('•')) {
      payload.pin_webhook_secret = form.pin_webhook_secret
    }
    dispatch(savePinSettings(payload))
  }

  const handleTestConnection = () => {
    dispatch(testPinConnection())
  }

  return (
    <div className="content container-fluid">
      {/* Page Header */}
      <div className="page-header">
        <div className="content-page-header d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <i className="fa fa-credit-card me-2 text-primary" />
            Pin Payments Configuration
          </h5>
          <span className="badge bg-warning text-dark">Super Admin Only</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="alert alert-info d-flex align-items-start mb-4" role="alert">
        <i className="fa fa-info-circle me-2 mt-1" />
        <div>
          <strong>Pin Payments Integration</strong>
          <p className="mb-0 mt-1">
            Enter your Pin Payments API credentials below. You can find these in your{' '}
            <a
              href="https://dashboard.pinpayments.com"
              target="_blank"
              rel="noreferrer"
              className="alert-link"
            >
              Pin Payments Dashboard
            </a>
            . Start with the <strong>Test</strong> environment to verify everything works
            before switching to <strong>Live</strong>.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 col-md-12">
          <form onSubmit={handleSave}>
            {/* Environment & Currency */}
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="fa fa-globe me-2" />
                  Environment Settings
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Environment <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="pin_environment"
                      value={form.pin_environment}
                      onChange={handleChange}
                      required
                    >
                      <option value="test">Test (Sandbox)</option>
                      <option value="live">Live (Production)</option>
                    </select>
                    <div className="form-text">
                      Use <strong>Test</strong> while setting up. Switch to{' '}
                      <strong>Live</strong> when ready to accept real payments.
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Currency</label>
                    <select
                      className="form-select"
                      name="pin_currency"
                      value={form.pin_currency}
                      onChange={handleChange}
                    >
                      <option value="AUD">AUD – Australian Dollar</option>
                      <option value="USD">USD – US Dollar</option>
                      <option value="NZD">NZD – New Zealand Dollar</option>
                      <option value="GBP">GBP – British Pound</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* API Keys */}
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="fa fa-key me-2" />
                  API Keys
                </h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Publishable Key <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control font-monospace"
                    name="pin_publishable_key"
                    placeholder={
                      form.pin_environment === 'live'
                        ? 'pk_live_...'
                        : 'pk_test_...'
                    }
                    value={form.pin_publishable_key}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                  <div className="form-text">
                    Safe to expose to the browser. Used by Pin Payments.js to tokenise cards.
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Secret Key <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control font-monospace"
                    name="pin_secret_key"
                    placeholder={
                      pinSettings.pin_secret_key
                        ? 'Leave blank to keep existing key'
                        : form.pin_environment === 'live'
                        ? 'sk_live_...'
                        : 'sk_test_...'
                    }
                    value={form.pin_secret_key}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <div className="form-text text-warning">
                    <i className="fa fa-lock me-1" />
                    Never share this key. It is encrypted before being stored.
                    {pinSettings.pin_secret_key && (
                      <span className="ms-2 text-success">
                        <i className="fa fa-check-circle me-1" />A key is currently saved.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Webhook */}
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="fa fa-bolt me-2" />
                  Webhook Configuration
                </h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Webhook Endpoint URL</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control font-monospace bg-light"
                      value={`${window.location.origin.replace(':5173', ':3005')}/v1/subscription/pin-webhook`}
                      readOnly
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${window.location.origin.replace(':5173', ':3005')}/v1/subscription/pin-webhook`
                        )
                      }
                    >
                      <i className="fa fa-copy" />
                    </button>
                  </div>
                  <div className="form-text">
                    Add this URL to your Pin Payments Dashboard under{' '}
                    <strong>Settings → Webhooks</strong>.
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Webhook Secret</label>
                  <input
                    type="password"
                    className="form-control font-monospace"
                    name="pin_webhook_secret"
                    placeholder={
                      pinSettings.pin_webhook_secret
                        ? 'Leave blank to keep existing secret'
                        : 'Enter webhook signing secret from Pin Payments Dashboard'
                    }
                    value={form.pin_webhook_secret}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <div className="form-text">
                    Used to verify that webhook events genuinely originate from Pin Payments.
                    Encrypted before storage.
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex gap-3 mb-4 flex-wrap">
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={pinSettingsLoading}
              >
                {pinSettingsLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fa fa-save me-2" />
                    Save Settings
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-outline-success px-4"
                onClick={handleTestConnection}
                disabled={pinSettingsLoading}
              >
                {pinSettingsLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Testing...
                  </>
                ) : (
                  <>
                    <i className="fa fa-plug me-2" />
                    Test Connection
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Side Panel */}
        <div className="col-lg-4 col-md-12">
          {/* Connection Test Result */}
          {pinTestResult && (
            <div
              className={`alert ${
                pinTestResult.success ? 'alert-success' : 'alert-danger'
              } mb-4`}
            >
              <h6 className="alert-heading">
                <i
                  className={`fa ${
                    pinTestResult.success ? 'fa-check-circle' : 'fa-times-circle'
                  } me-2`}
                />
                {pinTestResult.success ? 'Connection Successful' : 'Connection Failed'}
              </h6>
              {pinTestResult.success ? (
                <p className="mb-0">
                  Your Pin Payments credentials are valid and the API is reachable.
                </p>
              ) : (
                <p className="mb-0">{pinTestResult.message}</p>
              )}
            </div>
          )}

          {/* Help Card */}
          <div className="card border-0 bg-light mb-4">
            <div className="card-body">
              <h6 className="card-title fw-bold">
                <i className="fa fa-question-circle me-2 text-primary" />
                Where to find your keys
              </h6>
              <ol className="ps-3 mb-0 small">
                <li className="mb-2">
                  Log in to your{' '}
                  <a
                    href="https://dashboard.pinpayments.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Pin Payments Dashboard
                  </a>
                </li>
                <li className="mb-2">
                  Go to <strong>Your Account → API Keys</strong>
                </li>
                <li className="mb-2">
                  Copy the <strong>Publishable Key</strong> and{' '}
                  <strong>Secret Key</strong> for the relevant environment
                </li>
                <li>
                  For webhooks, go to <strong>Settings → Webhooks</strong> and add
                  the endpoint URL shown on the left
                </li>
              </ol>
            </div>
          </div>

          {/* Environment Status */}
          <div className="card border-0 mb-4">
            <div className="card-body">
              <h6 className="card-title fw-bold">
                <i className="fa fa-info-circle me-2 text-info" />
                Current Status
              </h6>
              <table className="table table-sm table-borderless mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted">Environment</td>
                    <td>
                      <span
                        className={`badge ${
                          form.pin_environment === 'live'
                            ? 'bg-success'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {form.pin_environment === 'live' ? 'LIVE' : 'TEST'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Currency</td>
                    <td>{form.pin_currency}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Publishable Key</td>
                    <td>
                      {form.pin_publishable_key ? (
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
                    <td className="text-muted">Secret Key</td>
                    <td>
                      {pinSettings.pin_secret_key ? (
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
                    <td className="text-muted">Webhook Secret</td>
                    <td>
                      {pinSettings.pin_webhook_secret ? (
                        <span className="text-success">
                          <i className="fa fa-check-circle me-1" />
                          Saved (encrypted)
                        </span>
                      ) : (
                        <span className="text-muted">
                          <i className="fa fa-minus-circle me-1" />
                          Optional
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
