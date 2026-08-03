/**
 * PaymentSettingsPage.jsx
 *
 * Combined payment gateway settings for Super Admin.
 * Two tabs: Pin Payments | Stripe
 * Route: /admin/payment-settings
 */
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchPinSettings,
  savePinSettings,
  testPinConnection,
  clearPinTestResult,
  fetchStripeSettings,
  saveStripeSettings,
  testStripeConnection,
} from '../../features/settings/settingsSlice'
import baseServerUrl from '../../config/apiConfig'
import './settings.css'

const WEBHOOK_URL_PIN    = `${baseServerUrl.replace(/\/v1\/$/, '')}/v1/subscription/pin-webhook`
const WEBHOOK_URL_STRIPE = `${baseServerUrl.replace(/\/v1\/$/, '')}/v1/subscription/stripe-webhook`

// ─── Pin Payments Tab ────────────────────────────────────────────────────────
function PinTab() {
  const dispatch = useDispatch()
  const { pinSettings, pinSettingsLoading, pinTestResult } = useSelector((s) => s.settings)

  const [form, setForm] = useState({
    pin_publishable_key: '',
    pin_secret_key: '',
    pin_environment: 'test',
    pin_currency: 'AUD',
    pin_webhook_secret: '',
  })
  const [secretKeyChanged, setSecretKeyChanged] = useState(false)
  const [webhookSecretChanged, setWebhookSecretChanged] = useState(false)

  useEffect(() => {
    dispatch(fetchPinSettings())
    return () => dispatch(clearPinTestResult())
  }, [dispatch])

  useEffect(() => {
    if (pinSettings && Object.keys(pinSettings).length > 0) {
      setForm((prev) => ({
        ...prev,
        pin_publishable_key: pinSettings.pin_publishable_key || '',
        pin_secret_key:      pinSettings.pin_secret_key || '',
        pin_environment:     pinSettings.pin_environment || 'test',
        pin_currency:        pinSettings.pin_currency || 'AUD',
        pin_webhook_secret:  pinSettings.pin_webhook_secret || '',
      }))
    }
  }, [pinSettings])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'pin_secret_key')     setSecretKeyChanged(true)
    if (name === 'pin_webhook_secret') setWebhookSecretChanged(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const payload = {
      pin_publishable_key: form.pin_publishable_key,
      pin_environment:     form.pin_environment,
      pin_currency:        form.pin_currency,
    }
    if (secretKeyChanged && !form.pin_secret_key.startsWith('•'))
      payload.pin_secret_key = form.pin_secret_key
    if (webhookSecretChanged && !form.pin_webhook_secret.startsWith('•'))
      payload.pin_webhook_secret = form.pin_webhook_secret
    dispatch(savePinSettings(payload))
  }

  return (
    <div className="row mt-3">
      <div className="col-lg-8 col-md-12">
        <div className="alert alert-info d-flex align-items-start mb-4">
          <i className="fa fa-info-circle me-2 mt-1" />
          <div>
            <strong>Pin Payments Integration</strong>
            <p className="mb-0 mt-1">
              Enter your Pin Payments API credentials. Find them in your{' '}
              <a href="https://dashboard.pinpayments.com" target="_blank" rel="noreferrer" className="alert-link">
                Pin Payments Dashboard
              </a>. Use <strong>Test</strong> first, then switch to <strong>Live</strong>.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          {/* Environment & Currency */}
          <div className="card mb-4">
            <div className="card-header"><h6 className="mb-0"><i className="fa fa-globe me-2" />Environment Settings</h6></div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Environment <span className="text-danger">*</span></label>
                  <select className="form-select" name="pin_environment" value={form.pin_environment} onChange={handleChange} required>
                    <option value="test">Test (Sandbox)</option>
                    <option value="live">Live (Production)</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Currency</label>
                  <select className="form-select" name="pin_currency" value={form.pin_currency} onChange={handleChange}>
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
            <div className="card-header"><h6 className="mb-0"><i className="fa fa-key me-2" />API Keys</h6></div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Publishable Key <span className="text-danger">*</span></label>
                <input type="text" className="form-control font-monospace" name="pin_publishable_key"
                  placeholder={form.pin_environment === 'live' ? 'pk_live_...' : 'pk_test_...'}
                  value={form.pin_publishable_key} onChange={handleChange} required autoComplete="off" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Secret Key <span className="text-danger">*</span></label>
                <input type="password" className="form-control font-monospace" name="pin_secret_key"
                  placeholder={pinSettings.pin_secret_key ? 'Leave blank to keep existing key' : (form.pin_environment === 'live' ? 'sk_live_...' : 'sk_test_...')}
                  value={form.pin_secret_key} onChange={handleChange} autoComplete="new-password" />
                <div className="form-text text-warning"><i className="fa fa-lock me-1" />Encrypted before storage.
                  {pinSettings.pin_secret_key && <span className="ms-2 text-success"><i className="fa fa-check-circle me-1" />A key is saved.</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Webhook */}
          <div className="card mb-4">
            <div className="card-header"><h6 className="mb-0"><i className="fa fa-bolt me-2" />Webhook</h6></div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Webhook Endpoint URL</label>
                <div className="input-group">
                  <input type="text" className="form-control font-monospace bg-light" value={WEBHOOK_URL_PIN} readOnly />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigator.clipboard.writeText(WEBHOOK_URL_PIN)}>
                    <i className="fa fa-copy" />
                  </button>
                </div>
                <div className="form-text">Add this to Pin Payments Dashboard → <strong>Settings → Webhooks</strong>.</div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Webhook Secret</label>
                <input type="password" className="form-control font-monospace" name="pin_webhook_secret"
                  placeholder={pinSettings.pin_webhook_secret ? 'Leave blank to keep existing secret' : 'Webhook signing secret'}
                  value={form.pin_webhook_secret} onChange={handleChange} autoComplete="new-password" />
              </div>
            </div>
          </div>

          <div className="d-flex gap-3 mb-4 flex-wrap">
            <button type="submit" className="btn btn-primary px-4" disabled={pinSettingsLoading}>
              {pinSettingsLoading ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><i className="fa fa-save me-2" />Save Settings</>}
            </button>
            <button type="button" className="btn btn-outline-success px-4" onClick={() => dispatch(testPinConnection())} disabled={pinSettingsLoading}>
              <i className="fa fa-plug me-2" />Test Connection
            </button>
          </div>
        </form>
      </div>

      {/* Side panel */}
      <div className="col-lg-4 col-md-12">
        {pinTestResult && (
          <div className={`alert ${pinTestResult.success ? 'alert-success' : 'alert-danger'} mb-4`}>
            <h6 className="alert-heading">
              <i className={`fa ${pinTestResult.success ? 'fa-check-circle' : 'fa-times-circle'} me-2`} />
              {pinTestResult.success ? 'Connection Successful' : 'Connection Failed'}
            </h6>
            <p className="mb-0">{pinTestResult.success ? 'Your Pin Payments credentials are valid.' : pinTestResult.message}</p>
          </div>
        )}
        <div className="card border-0 bg-light mb-4">
          <div className="card-body">
            <h6 className="card-title fw-bold"><i className="fa fa-question-circle me-2 text-primary" />Where to find your keys</h6>
            <ol className="ps-3 mb-0 small">
              <li className="mb-2">Log in to your <a href="https://dashboard.pinpayments.com" target="_blank" rel="noreferrer">Pin Payments Dashboard</a></li>
              <li className="mb-2">Go to <strong>Your Account → API Keys</strong></li>
              <li>Copy the <strong>Publishable Key</strong> and <strong>Secret Key</strong></li>
            </ol>
          </div>
        </div>
        <div className="card border-0 mb-4">
          <div className="card-body">
            <h6 className="card-title fw-bold"><i className="fa fa-info-circle me-2 text-info" />Current Status</h6>
            <table className="table table-sm table-borderless mb-0">
              <tbody>
                <tr><td className="text-muted">Environment</td>
                  <td><span className={`badge ${form.pin_environment === 'live' ? 'bg-success' : 'bg-warning text-dark'}`}>{form.pin_environment === 'live' ? 'LIVE' : 'TEST'}</span></td></tr>
                <tr><td className="text-muted">Publishable Key</td>
                  <td>{form.pin_publishable_key ? <span className="text-success"><i className="fa fa-check-circle me-1" />Set</span> : <span className="text-danger"><i className="fa fa-times-circle me-1" />Not set</span>}</td></tr>
                <tr><td className="text-muted">Secret Key</td>
                  <td>{pinSettings.pin_secret_key ? <span className="text-success"><i className="fa fa-check-circle me-1" />Saved (encrypted)</span> : <span className="text-danger"><i className="fa fa-times-circle me-1" />Not set</span>}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Stripe Tab ──────────────────────────────────────────────────────────────
function StripeTab() {
  const dispatch = useDispatch()
  const { stripeSettings, stripeSettingsLoading, stripeTestResult } = useSelector((s) => s.settings)

  const [form, setForm] = useState({
    stripe_publishable_key: '',
    stripe_secret_key: '',
    stripe_environment: 'test',
    stripe_currency: 'AUD',
    stripe_webhook_secret: '',
  })
  const [secretChanged, setSecretChanged] = useState(false)
  const [webhookChanged, setWebhookChanged] = useState(false)

  useEffect(() => {
    dispatch(fetchStripeSettings())
  }, [dispatch])

  useEffect(() => {
    if (stripeSettings && Object.keys(stripeSettings).length > 0) {
      setForm((prev) => ({
        ...prev,
        stripe_publishable_key: stripeSettings.stripe_publishable_key || '',
        stripe_secret_key:      stripeSettings.stripe_secret_key || '',
        stripe_environment:     stripeSettings.stripe_environment || 'test',
        stripe_currency:        stripeSettings.stripe_currency || 'AUD',
        stripe_webhook_secret:  stripeSettings.stripe_webhook_secret || '',
      }))
    }
  }, [stripeSettings])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'stripe_secret_key')     setSecretChanged(true)
    if (name === 'stripe_webhook_secret') setWebhookChanged(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const payload = {
      stripe_publishable_key: form.stripe_publishable_key,
      stripe_environment:     form.stripe_environment,
      stripe_currency:        form.stripe_currency,
    }
    if (secretChanged && !form.stripe_secret_key.startsWith('•'))
      payload.stripe_secret_key = form.stripe_secret_key
    if (webhookChanged && !form.stripe_webhook_secret.startsWith('•'))
      payload.stripe_webhook_secret = form.stripe_webhook_secret
    dispatch(saveStripeSettings(payload))
  }

  return (
    <div className="row mt-3">
      <div className="col-lg-8 col-md-12">
        <div className="alert alert-info d-flex align-items-start mb-4">
          <i className="fa fa-info-circle me-2 mt-1" />
          <div>
            <strong>Stripe Integration</strong>
            <p className="mb-0 mt-1">
              Enter your Stripe API credentials. Find them in your{' '}
              <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer" className="alert-link">
                Stripe Dashboard → Developers → API Keys
              </a>. Use <strong>Test</strong> keys first, then switch to <strong>Live</strong> when ready.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          {/* Environment & Currency */}
          <div className="card mb-4">
            <div className="card-header"><h6 className="mb-0"><i className="fa fa-globe me-2" />Environment Settings</h6></div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Environment <span className="text-danger">*</span></label>
                  <select className="form-select" name="stripe_environment" value={form.stripe_environment} onChange={handleChange} required>
                    <option value="test">Test (Sandbox)</option>
                    <option value="live">Live (Production)</option>
                  </select>
                  <div className="form-text">Test keys start with <code>pk_test_</code> / <code>sk_test_</code>. Live keys start with <code>pk_live_</code> / <code>sk_live_</code>.</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Currency</label>
                  <select className="form-select" name="stripe_currency" value={form.stripe_currency} onChange={handleChange}>
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
            <div className="card-header"><h6 className="mb-0"><i className="fa fa-key me-2" />API Keys</h6></div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Publishable Key <span className="text-danger">*</span></label>
                <input type="text" className="form-control font-monospace" name="stripe_publishable_key"
                  placeholder={form.stripe_environment === 'live' ? 'pk_live_...' : 'pk_test_...'}
                  value={form.stripe_publishable_key} onChange={handleChange} required autoComplete="off" />
                <div className="form-text">Safe to expose to the browser. Used by Stripe.js to tokenise cards.</div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Secret Key <span className="text-danger">*</span></label>
                <input type="password" className="form-control font-monospace" name="stripe_secret_key"
                  placeholder={stripeSettings?.stripe_secret_key ? 'Leave blank to keep existing key' : (form.stripe_environment === 'live' ? 'sk_live_...' : 'sk_test_...')}
                  value={form.stripe_secret_key} onChange={handleChange} autoComplete="new-password" />
                <div className="form-text text-warning"><i className="fa fa-lock me-1" />Never share this key. Encrypted before storage.
                  {stripeSettings?.stripe_secret_key && <span className="ms-2 text-success"><i className="fa fa-check-circle me-1" />A key is saved.</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Webhook */}
          <div className="card mb-4">
            <div className="card-header"><h6 className="mb-0"><i className="fa fa-bolt me-2" />Webhook</h6></div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Webhook Endpoint URL</label>
                <div className="input-group">
                  <input type="text" className="form-control font-monospace bg-light" value={WEBHOOK_URL_STRIPE} readOnly />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigator.clipboard.writeText(WEBHOOK_URL_STRIPE)}>
                    <i className="fa fa-copy" />
                  </button>
                </div>
                <div className="form-text">Add this to Stripe Dashboard → <strong>Developers → Webhooks → Add endpoint</strong>.</div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Webhook Signing Secret</label>
                <input type="password" className="form-control font-monospace" name="stripe_webhook_secret"
                  placeholder={stripeSettings?.stripe_webhook_secret ? 'Leave blank to keep existing secret' : 'whsec_...'}
                  value={form.stripe_webhook_secret} onChange={handleChange} autoComplete="new-password" />
                <div className="form-text">Found in Stripe Dashboard → Developers → Webhooks → your endpoint → <strong>Signing secret</strong>. Encrypted before storage.</div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3 mb-4 flex-wrap">
            <button type="submit" className="btn btn-primary px-4" disabled={stripeSettingsLoading}>
              {stripeSettingsLoading ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><i className="fa fa-save me-2" />Save Settings</>}
            </button>
            <button type="button" className="btn btn-outline-success px-4" onClick={() => dispatch(testStripeConnection())} disabled={stripeSettingsLoading}>
              <i className="fa fa-plug me-2" />Test Connection
            </button>
          </div>
        </form>
      </div>

      {/* Side panel */}
      <div className="col-lg-4 col-md-12">
        {stripeTestResult && (
          <div className={`alert ${stripeTestResult.success ? 'alert-success' : 'alert-danger'} mb-4`}>
            <h6 className="alert-heading">
              <i className={`fa ${stripeTestResult.success ? 'fa-check-circle' : 'fa-times-circle'} me-2`} />
              {stripeTestResult.success ? 'Connection Successful' : 'Connection Failed'}
            </h6>
            <p className="mb-0">{stripeTestResult.success ? 'Your Stripe credentials are valid and the API is reachable.' : stripeTestResult.message}</p>
          </div>
        )}
        <div className="card border-0 bg-light mb-4">
          <div className="card-body">
            <h6 className="card-title fw-bold"><i className="fa fa-question-circle me-2 text-primary" />Where to find your keys</h6>
            <ol className="ps-3 mb-0 small">
              <li className="mb-2">Log in to your <a href="https://dashboard.stripe.com" target="_blank" rel="noreferrer">Stripe Dashboard</a></li>
              <li className="mb-2">Go to <strong>Developers → API Keys</strong></li>
              <li className="mb-2">Copy the <strong>Publishable key</strong> and <strong>Secret key</strong></li>
              <li>For webhooks, go to <strong>Developers → Webhooks</strong> and add the endpoint URL shown on the left</li>
            </ol>
          </div>
        </div>
        <div className="card border-0 mb-4">
          <div className="card-body">
            <h6 className="card-title fw-bold"><i className="fa fa-info-circle me-2 text-info" />Current Status</h6>
            <table className="table table-sm table-borderless mb-0">
              <tbody>
                <tr><td className="text-muted">Environment</td>
                  <td><span className={`badge ${form.stripe_environment === 'live' ? 'bg-success' : 'bg-warning text-dark'}`}>{form.stripe_environment === 'live' ? 'LIVE' : 'TEST'}</span></td></tr>
                <tr><td className="text-muted">Publishable Key</td>
                  <td>{form.stripe_publishable_key ? <span className="text-success"><i className="fa fa-check-circle me-1" />Set</span> : <span className="text-danger"><i className="fa fa-times-circle me-1" />Not set</span>}</td></tr>
                <tr><td className="text-muted">Secret Key</td>
                  <td>{stripeSettings?.stripe_secret_key ? <span className="text-success"><i className="fa fa-check-circle me-1" />Saved (encrypted)</span> : <span className="text-danger"><i className="fa fa-times-circle me-1" />Not set</span>}</td></tr>
                <tr><td className="text-muted">Webhook Secret</td>
                  <td>{stripeSettings?.stripe_webhook_secret ? <span className="text-success"><i className="fa fa-check-circle me-1" />Saved (encrypted)</span> : <span className="text-muted"><i className="fa fa-minus-circle me-1" />Optional</span>}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function PaymentSettingsPage() {
  const [activeTab, setActiveTab] = useState('pin')

  return (
    <div className="content container-fluid">
      <div className="page-header">
        <div className="content-page-header d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <i className="fe fe-credit-card me-2 text-primary" />
            Payment Settings
          </h5>
          <span className="badge bg-warning text-dark">Super Admin Only</span>
        </div>
      </div>

      {/* Gateway tabs */}
      <ul className="nav nav-tabs mb-0" role="tablist">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'pin' ? 'active' : ''}`}
            onClick={() => setActiveTab('pin')}
          >
            <i className="fa fa-credit-card me-2" />
            Pin Payments
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'stripe' ? 'active' : ''}`}
            onClick={() => setActiveTab('stripe')}
          >
            <i className="fa fa-stripe me-2" style={{ fontStyle: 'normal', fontWeight: 700 }}>S</i>
            {' '}Stripe
          </button>
        </li>
      </ul>

      <div className="tab-content border border-top-0 rounded-bottom p-3 bg-white">
        {activeTab === 'pin'    && <PinTab />}
        {activeTab === 'stripe' && <StripeTab />}
      </div>
    </div>
  )
}
