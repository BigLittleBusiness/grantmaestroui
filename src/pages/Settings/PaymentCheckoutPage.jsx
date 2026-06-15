import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPinCharge } from '../../features/settings/settingsSlice'
import './settings.css'

/**
 * PaymentCheckoutPage
 *
 * Customer-facing checkout page using Pin Payments.
 *
 * In production, the Pin Payments.js script (loaded via the publishable key)
 * tokenises the card client-side so that raw card data never touches the
 * Grant Maestro server.  The resulting card_token is sent to the backend.
 *
 * For the initial launch, this page uses the Pin Payments hosted fields
 * approach via a simple form.  Upgrade to Pin Payments.js for PCI-DSS
 * SAQ-A compliance.
 */
export default function PaymentCheckoutPage() {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.settings)
  const { subscriptionPlans } = useSelector((state) => state.subscription || { subscriptionPlans: [] })
  const loggedInUser = useSelector((state) => state.auth?.loggedInUser)

  const [selectedPlan, setSelectedPlan] = useState('')
  const [cardToken, setCardToken] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!cardToken || !selectedPlan) return

    const result = await dispatch(
      createPinCharge({
        card_token:       cardToken,
        preferred_plan_id: parseInt(selectedPlan, 10),
        payment_made_for:  loggedInUser?.user_id,
      })
    )

    if (createPinCharge.fulfilled.match(result)) {
      setPaymentSuccess(true)
    }
  }

  if (paymentSuccess) {
    return (
      <div className="content container-fluid">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6 text-center">
            <div className="card border-0 shadow-sm p-5">
              <div className="mb-4">
                <i className="fa fa-check-circle text-success" style={{ fontSize: '4rem' }} />
              </div>
              <h4 className="text-success mb-3">Payment Successful!</h4>
              <p className="text-muted mb-4">
                Your Grant Maestro subscription is now active. You can start managing
                your grants immediately.
              </p>
              <a href="/dashboard" className="btn btn-primary px-5">
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content container-fluid">
      <div className="page-header">
        <div className="content-page-header">
          <h5>
            <i className="fa fa-credit-card me-2 text-primary" />
            Subscribe to Grant Maestro
          </h5>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-10">
          <div className="alert alert-info mb-4">
            <i className="fa fa-shield me-2" />
            <strong>Secure Payment</strong> – Your card details are tokenised by
            Pin Payments and never stored on Grant Maestro servers.
          </div>

          <form onSubmit={handleSubmit}>
            {/* Plan Selection */}
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="fa fa-list me-2" />
                  Select Your Plan
                </h6>
              </div>
              <div className="card-body">
                <select
                  className="form-select"
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  required
                >
                  <option value="">-- Choose a subscription plan --</option>
                  {subscriptionPlans && subscriptionPlans.map((plan) => (
                    <option key={plan.plan_id} value={plan.plan_id}>
                      {plan.plan_name} – ${plan.plan_price}/{plan.plan_duration}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Card Token Input */}
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="fa fa-credit-card me-2" />
                  Card Details
                </h6>
              </div>
              <div className="card-body">
                <div className="alert alert-warning mb-3">
                  <i className="fa fa-info-circle me-2" />
                  <strong>Developer Note:</strong> In production, integrate{' '}
                  <a
                    href="https://pinpayments.com/developers/integration-guides/payment-forms"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Pin Payments.js
                  </a>{' '}
                  to tokenise cards client-side. Enter the card token below for testing.
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Card Token</label>
                  <input
                    type="text"
                    className="form-control font-monospace"
                    placeholder="card_token from Pin Payments.js (e.g. card_nytGw7koRg23EEp9NTmz9A)"
                    value={cardToken}
                    onChange={(e) => setCardToken(e.target.value)}
                    required
                  />
                  <div className="form-text">
                    For testing, use token <code>card_nytGw7koRg23EEp9NTmz9A</code> in
                    the test environment.
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100"
              disabled={loading || !selectedPlan || !cardToken}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <i className="fa fa-lock me-2" />
                  Pay Securely with Pin Payments
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
