import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPinCharge } from '../../features/settings/settingsSlice'
import api from '../../api'
import './settings.css'

const formatAud = (amount) => new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  minimumFractionDigits: 0,
}).format(Number(amount || 0))

const formatAudCents = (amount) => new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
}).format(Number(amount || 0))

const roundCents = (amount) => Math.round(amount * 100) / 100

// Australian GST. The authoritative amount is calculated by Stripe Tax from the
// billing address entered at checkout; this is only used for the estimate.
const GST_RATE = 0.1
const MAX_EXTRA_SEATS = 200

const validPrice = (value) => {
  const price = Number(value)
  return Number.isFinite(price) && price > 0 ? price : null
}

/**
 * Customer checkout. Annual billing is a single yearly charge equal to ten
 * monthly payments, giving the organisation two months free. Prices exclude
 * GST; Stripe adds 10% GST for Australian billing addresses.
 */
export default function PaymentCheckoutPage() {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.settings)
  const loggedInUser = useSelector((state) => state.auth?.user)

  const [plans, setPlans] = useState([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [billingInterval, setBillingInterval] = useState('year')
  const [extraSeats, setExtraSeats] = useState(0)
  const [cardToken, setCardToken] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentProvider, setPaymentProvider] = useState('loading')
  const [checkoutError, setCheckoutError] = useState('')

  const [promoCode, setPromoCode] = useState('')
  const [promoStatus, setPromoStatus] = useState(null)
  const [promoDetails, setPromoDetails] = useState(null)
  const promoDebounce = useRef(null)

  useEffect(() => {
    let active = true

    Promise.all([
      api.get('subscription/payment-provider').catch(() => ({ data: { data: { provider: 'pin' } } })),
      api.get('subscription/fetch-subscription-plans'),
    ])
      .then(([providerResponse, plansResponse]) => {
        if (!active) return
        setPaymentProvider(providerResponse.data?.data?.provider || 'pin')
        const availablePlans = plansResponse.data?.data?.plans || []
        setPlans(availablePlans)
        const preferredPlanId = loggedInUser?.preferred_subscription_plan_id
        if (preferredPlanId && availablePlans.some((plan) => Number(plan.plan_id) === Number(preferredPlanId))) {
          setSelectedPlan(String(preferredPlanId))
        }
        if (['month', 'year'].includes(loggedInUser?.preferred_subscription_billing_interval)) {
          setBillingInterval(loggedInUser.preferred_subscription_billing_interval)
        }
      })
      .catch(() => {
        if (!active) setCheckoutError('Subscription plans could not be loaded. Please refresh and try again.')
      })
      .finally(() => {
        if (active) setPlansLoading(false)
      })

    return () => {
      active = false
      if (promoDebounce.current) clearTimeout(promoDebounce.current)
    }
  }, [
    loggedInUser?.preferred_subscription_plan_id,
    loggedInUser?.preferred_subscription_billing_interval,
  ])

  const chosenPlan = useMemo(
    () => plans.find((plan) => String(plan.plan_id) === String(selectedPlan)),
    [plans, selectedPlan]
  )
  const monthlyPrice = validPrice(chosenPlan?.plan_price)
  const annualPrice = validPrice(chosenPlan?.annual_price)
  const chosenPrice = billingInterval === 'year'
    ? (annualPrice || (monthlyPrice ? monthlyPrice * 10 : 0))
    : (monthlyPrice || 0)
  const monthlySeatPrice = validPrice(chosenPlan?.overage_rate)
  const seatPrice = monthlySeatPrice
    ? (billingInterval === 'year' ? monthlySeatPrice * 10 : monthlySeatPrice)
    : 0
  const includedSeats = chosenPlan
    ? Number(chosenPlan.admin_seats || 0) + Number(chosenPlan.team_seats || 0)
    : 0
  const seatsTotal = roundCents(seatPrice * extraSeats)
  const subtotal = roundCents(chosenPrice + seatsTotal)
  const estimatedGst = roundCents(subtotal * GST_RATE)
  const periodLabel = billingInterval === 'year' ? '/year' : '/mo'
  const isStripe = paymentProvider === 'stripe'

  const handleExtraSeatsChange = (event) => {
    const value = Math.floor(Number(event.target.value))
    setExtraSeats(Number.isFinite(value) ? Math.min(Math.max(value, 0), MAX_EXTRA_SEATS) : 0)
  }

  const handlePromoChange = (event) => {
    const value = event.target.value.toUpperCase()
    setPromoCode(value)
    setPromoStatus(null)
    setPromoDetails(null)
    if (promoDebounce.current) clearTimeout(promoDebounce.current)
    if (!value.trim()) return

    setPromoStatus('checking')
    promoDebounce.current = setTimeout(async () => {
      try {
        const response = await api.post('subscription/validate-promo', { code: value.trim() })
        if (response.data?.status !== false && response.data?.data) {
          setPromoStatus('valid')
          setPromoDetails(response.data.data)
        } else {
          setPromoStatus('invalid')
        }
      } catch {
        setPromoStatus('invalid')
      }
    }, 600)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedPlan || !chosenPlan) return
    setCheckoutError('')

    const checkoutPayload = {
      preferred_plan_id: Number(selectedPlan),
      billing_interval: billingInterval,
      extra_seats: extraSeats,
    }
    if (promoStatus === 'valid' && promoCode.trim()) {
      checkoutPayload.promo_code = promoCode.trim()
    }

    if (paymentProvider === 'stripe') {
      try {
        const response = await api.post('subscription/create-checkout-session', checkoutPayload)
        if (response.data?.data?.url) {
          window.location.assign(response.data.data.url)
          return
        }
        setCheckoutError(response.data?.message || 'Unable to start Stripe checkout.')
      } catch (error) {
        setCheckoutError(error?.response?.data?.message || 'Unable to start Stripe checkout.')
      }
      return
    }

    if (!cardToken) {
      setCheckoutError('Enter a card token generated by Pin Payments before continuing.')
      return
    }

    const result = await dispatch(createPinCharge({
      ...checkoutPayload,
      card_token: cardToken,
      payment_made_for: loggedInUser?.user_id,
    }))
    if (createPinCharge.fulfilled.match(result)) setPaymentSuccess(true)
    else setCheckoutError(result.payload?.message || 'Payment could not be processed.')
  }

  if (paymentSuccess) {
    return (
      <div className='content container-fluid'>
        <div className='row justify-content-center mt-5'>
          <div className='col-md-6 text-center'>
            <div className='card border-0 shadow-sm p-5'>
              <div className='mb-4'>
                <i className='fa fa-check-circle text-success' style={{ fontSize: '4rem' }} />
              </div>
              <h4 className='text-success mb-3'>Payment Successful!</h4>
              <p className='text-muted mb-4'>
                Your GrantMaestro subscription is now active. You can start managing your grants immediately.
              </p>
              <a href='/dashboard' className='btn btn-primary px-5'>Go to Dashboard</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='content container-fluid'>
      <div className='page-header'>
        <div className='content-page-header'>
          <h5><i className='fa fa-credit-card me-2 text-primary' />Subscribe to GrantMaestro</h5>
        </div>
      </div>

      <div className='row justify-content-center'>
        <div className='col-lg-7 col-md-10'>
          <div className='alert alert-info mb-4'>
            <i className='fa fa-shield me-2' />
            <strong>Secure Payment</strong> – {paymentProvider === 'stripe'
              ? 'You will be redirected to Stripe’s secure hosted checkout. GrantMaestro never receives or stores your card details.'
              : 'Card details must be tokenised by Pin Payments and are never stored on GrantMaestro servers.'}
          </div>
          {checkoutError && <div className='alert alert-danger mb-4'>{checkoutError}</div>}

          <form onSubmit={handleSubmit}>
            <div className='card mb-4'>
              <div className='card-header'>
                <h6 className='mb-0'><i className='fa fa-list me-2' />Select Your Plan</h6>
              </div>
              <div className='card-body'>
                <select
                  className='form-select'
                  value={selectedPlan}
                  onChange={(event) => setSelectedPlan(event.target.value)}
                  disabled={plansLoading}
                  required
                >
                  <option value=''>{plansLoading ? 'Loading subscription plans…' : '-- Choose a subscription plan --'}</option>
                  {plans.map((plan) => (
                    <option key={plan.plan_id} value={plan.plan_id}>{plan.plan_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className='card mb-4'>
              <div className='card-header'>
                <h6 className='mb-0'><i className='fa fa-calendar me-2' />Choose Billing</h6>
              </div>
              <div className='card-body'>
                <div className='form-check border rounded p-3 mb-2'>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='billing_interval'
                    id='annual-billing'
                    value='year'
                    checked={billingInterval === 'year'}
                    onChange={(event) => setBillingInterval(event.target.value)}
                  />
                  <label className='form-check-label w-100' htmlFor='annual-billing'>
                    <strong>Annual — two months free</strong>
                    <span className='d-block small text-muted'>
                      {chosenPlan ? `${formatAud(annualPrice || (monthlyPrice ? monthlyPrice * 10 : 0))} billed once per year; pay for 10 months and receive 12 months of access.` : 'Pay for 10 months and receive 12 months of access.'}
                    </span>
                  </label>
                </div>
                <div className='form-check border rounded p-3'>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='billing_interval'
                    id='monthly-billing'
                    value='month'
                    checked={billingInterval === 'month'}
                    onChange={(event) => setBillingInterval(event.target.value)}
                  />
                  <label className='form-check-label w-100' htmlFor='monthly-billing'>
                <strong>Monthly</strong>
                    <span className='d-block small text-muted'>{chosenPlan ? `${formatAud(monthlyPrice || 0)} billed each month.` : 'Billed each month.'}</span>
                  </label>
                </div>
              </div>
            </div>

            {chosenPlan && isStripe && (
              <div className='card mb-4'>
                <div className='card-header'>
                  <h6 className='mb-0'><i className='fa fa-users me-2' />Extra Seats <span className='text-muted fw-normal'>(optional)</span></h6>
                </div>
                <div className='card-body'>
                  <p className='small text-muted mb-2'>
                    {chosenPlan.plan_name} includes {includedSeats} seat{includedSeats === 1 ? '' : 's'} ({chosenPlan.admin_seats} admin + {chosenPlan.team_seats} team).
                    {seatPrice > 0 && ` Extra seats are ${formatAudCents(seatPrice)} each${periodLabel}.`}
                  </p>
                  <div className='input-group' style={{ maxWidth: 220 }}>
                    <button type='button' className='btn btn-outline-secondary' onClick={() => setExtraSeats((seats) => Math.max(seats - 1, 0))} disabled={extraSeats === 0} aria-label='Remove a seat'>−</button>
                    <input
                      type='number'
                      className='form-control text-center'
                      min={0}
                      max={MAX_EXTRA_SEATS}
                      value={extraSeats}
                      onChange={handleExtraSeatsChange}
                      aria-label='Number of extra seats'
                    />
                    <button type='button' className='btn btn-outline-secondary' onClick={() => setExtraSeats((seats) => Math.min(seats + 1, MAX_EXTRA_SEATS))} disabled={extraSeats >= MAX_EXTRA_SEATS} aria-label='Add a seat'>+</button>
                  </div>
                </div>
              </div>
            )}

            {chosenPlan && (
              <div className='card mb-4 border'>
                <div className='card-body'>
                  <div className='d-flex justify-content-between mb-1'>
                    <span>{chosenPlan.plan_name} · {billingInterval === 'year' ? 'Annual billing' : 'Monthly billing'}</span>
                    <span>{formatAudCents(chosenPrice)}</span>
                  </div>
                  {extraSeats > 0 && (
                    <div className='d-flex justify-content-between mb-1'>
                      <span>{extraSeats} extra seat{extraSeats === 1 ? '' : 's'} × {formatAudCents(seatPrice)}</span>
                      <span>{formatAudCents(seatsTotal)}</span>
                    </div>
                  )}
                  <div className='d-flex justify-content-between border-top pt-2 mt-2'>
                    <strong>{isStripe ? 'Subtotal (excl. GST)' : 'Total'}</strong>
                    <strong>{formatAudCents(subtotal)}{periodLabel}</strong>
                  </div>
                  {isStripe && (
                    <>
                      <div className='d-flex justify-content-between text-muted small mt-1'>
                        <span>+ GST 10% (Australian billing addresses)</span>
                        <span>{formatAudCents(estimatedGst)}</span>
                      </div>
                      <div className='d-flex justify-content-between mt-1'>
                        <span>Total for Australian organisations</span>
                        <strong>{formatAudCents(subtotal + estimatedGst)}{periodLabel}</strong>
                      </div>
                      <p className='small text-muted mb-0 mt-2'>
                        All prices are in AUD and exclude GST. 10% GST is added at checkout when your billing address is in Australia; organisations outside Australia are not charged GST. Any promo code discount is applied before GST.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className='card mb-4'>
              <div className='card-header'>
                <h6 className='mb-0'><i className='fa fa-ticket me-2' />Promo Code <span className='text-muted fw-normal'>(optional)</span></h6>
              </div>
              <div className='card-body'>
                <div className='input-group'>
                  <input
                    type='text'
                    className={`form-control text-uppercase font-monospace${promoStatus === 'valid' ? ' is-valid' : promoStatus === 'invalid' ? ' is-invalid' : ''}`}
                    placeholder='Enter promo code (e.g. EARLYBIRD25)'
                    value={promoCode}
                    onChange={handlePromoChange}
                    autoComplete='off'
                    maxLength={50}
                  />
                  {promoStatus === 'checking' && <span className='input-group-text'><span className='spinner-border spinner-border-sm text-primary' /></span>}
                  {promoStatus === 'valid' && <span className='input-group-text text-success'><i className='fa fa-check-circle' /></span>}
                  {promoStatus === 'invalid' && <span className='input-group-text text-danger'><i className='fa fa-times-circle' /></span>}
                </div>
                {promoStatus === 'valid' && promoDetails && (
                  <div className='alert alert-success mt-2 mb-0 py-2'>
                    <i className='fa fa-tag me-1' />
                    <strong>{promoDetails.code}</strong> applied — {promoDetails.discount_type === 'percentage' ? `${promoDetails.discount_value}% off` : `$${promoDetails.discount_value} off`} for {promoDetails.duration_months} month{promoDetails.duration_months !== 1 ? 's' : ''}.
                  </div>
                )}
                {promoStatus === 'invalid' && <div className='text-danger small mt-1'>This promo code is not valid or has expired.</div>}
              </div>
            </div>

            {paymentProvider === 'pin' && (
              <div className='card mb-4'>
                <div className='card-header'><h6 className='mb-0'><i className='fa fa-credit-card me-2' />Card Details</h6></div>
                <div className='card-body'>
                  <div className='alert alert-warning mb-3'>
                    <i className='fa fa-info-circle me-2' />
                    <strong>Developer Note:</strong> In production, integrate <a href='https://pinpayments.com/developers/integration-guides/payment-forms' target='_blank' rel='noreferrer'>Pin Payments.js</a> to tokenise cards client-side. Enter the card token below for testing.
                  </div>
                  <div className='mb-3'>
                    <label className='form-label fw-semibold'>Card Token</label>
                    <input
                      type='text'
                      className='form-control font-monospace'
                      placeholder='card_token from Pin Payments.js'
                      value={cardToken}
                      onChange={(event) => setCardToken(event.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentProvider === 'stripe' && (
              <div className='card mb-4 border-primary'>
                <div className='card-body text-center py-4'>
                  <i className='fa fa-lock text-primary me-2' />
                  <strong>Stripe Hosted Checkout</strong>
                  <p className='text-muted small mb-0 mt-2'>Continue to Stripe to complete payment securely. Your plan, extra seats, billing frequency and any valid GrantMaestro promo code will be applied there. Enter your organisation's billing address (and ABN, if you would like it on your tax invoice); GST is calculated from that address.</p>
                </div>
              </div>
            )}

            <button
              type='submit'
              className='btn btn-primary btn-lg w-100'
              disabled={loading || plansLoading || paymentProvider === 'loading' || !selectedPlan || (paymentProvider === 'pin' && !cardToken)}
            >
              {loading ? <><span className='spinner-border spinner-border-sm me-2' />Processing Payment...</> : <><i className='fa fa-lock me-2' />{paymentProvider === 'stripe' ? 'Continue to Secure Stripe Checkout' : 'Pay Securely with Pin Payments'}</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
