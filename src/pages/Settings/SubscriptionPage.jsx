import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api'
import './settings.css'

const MAX_EXTRA_SEATS = 200

const formatMoney = (amount, currency = 'aud') => new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: currency.toUpperCase(),
}).format(Number(amount || 0))

const formatDate = (value) => (value
  ? new Date(value).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Sydney' })
  : '')

const intervalLabel = (interval) => (interval === 'year' ? 'Annual' : 'Monthly')
const periodLabel = (interval) => (interval === 'year' ? '/year' : '/month')

/** Status badge text and colour for the organisation's subscription. */
const describeStatus = (details) => {
  const stripe = details.stripe
  if (stripe?.cancel_at_period_end) return { text: `Cancels on ${formatDate(stripe.cancel_at || stripe.current_period_end)}`, tone: 'warning' }
  if (stripe?.status === 'active') return { text: 'Active', tone: 'success' }
  if (stripe?.status === 'past_due') return { text: 'Payment overdue', tone: 'danger' }
  if (stripe && ['canceled', 'unpaid', 'incomplete_expired'].includes(stripe.status)) return { text: 'Cancelled', tone: 'secondary' }
  if (details.expired) return { text: details.in_trial ? 'Trial ended' : 'Expired', tone: 'danger' }
  if (details.in_trial) return { text: 'Free trial', tone: 'info' }
  return { text: 'Active', tone: 'success' }
}

export default function SubscriptionPage() {
  const [details, setDetails] = useState(null)
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [portalLoading, setPortalLoading] = useState(false)

  const [changePlanId, setChangePlanId] = useState('')
  const [changeInterval, setChangeInterval] = useState('month')
  const [changeSeats, setChangeSeats] = useState(0)
  const [preview, setPreview] = useState(null)
  const [changeLoading, setChangeLoading] = useState(false)
  const [changeError, setChangeError] = useState('')

  const loadDetails = useCallback(async () => {
    setError('')
    try {
      const [detailsResponse, plansResponse] = await Promise.all([
        api.get('subscription/subscription-details'),
        api.get('subscription/fetch-subscription-plans'),
      ])
      const data = detailsResponse.data?.data
      setDetails(data)
      setPlans(plansResponse.data?.data?.plans || [])
      setChangePlanId(String(data?.plan?.plan_id || ''))
      setChangeInterval(data?.stripe?.billing_interval || data?.billing_interval || 'month')
      setChangeSeats(data?.stripe?.extra_seats || 0)
    } catch (loadError) {
      setError(loadError?.response?.data?.message || 'Your subscription details could not be loaded. Please refresh and try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadDetails() }, [loadDetails])

  const selectedPlan = useMemo(
    () => plans.find((plan) => String(plan.plan_id) === String(changePlanId)),
    [plans, changePlanId]
  )
  const selectedIncluded = selectedPlan ? Number(selectedPlan.admin_seats || 0) + Number(selectedPlan.team_seats || 0) : 0
  const minimumExtraSeats = details ? Math.max(details.seats_used - selectedIncluded, 0) : 0

  const resetPreview = () => {
    setPreview(null)
    setChangeError('')
  }

  const openBillingPortal = async () => {
    setPortalLoading(true)
    setError('')
    try {
      const response = await api.post('subscription/billing-portal')
      window.location.assign(response.data.data.url)
    } catch (portalError) {
      setError(portalError?.response?.data?.message || 'The billing portal could not be opened. Please try again.')
      setPortalLoading(false)
    }
  }

  const submitChange = async (confirm) => {
    setChangeLoading(true)
    setChangeError('')
    try {
      const response = await api.post('subscription/change-plan', {
        plan_id: Number(changePlanId),
        billing_interval: changeInterval,
        extra_seats: changeSeats,
        confirm,
      })
      if (confirm) {
        setPreview(null)
        setNotice(response.data?.message || 'Your subscription has been updated.')
        await loadDetails()
      } else {
        setPreview(response.data?.data)
      }
    } catch (changeRequestError) {
      setChangeError(changeRequestError?.response?.data?.message || 'The change could not be made. Please try again.')
    } finally {
      setChangeLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='content container-fluid text-center py-5'>
        <span className='spinner-border text-primary' />
      </div>
    )
  }

  const stripe = details?.stripe
  const status = details ? describeStatus(details) : null
  const extraSeats = stripe?.extra_seats || 0
  const includedSeats = details?.plan?.included_seats || 0
  const hasLiveSubscription = stripe && ['active', 'trialing', 'past_due'].includes(stripe.status)

  return (
    <div className='content container-fluid'>
      <div className='page-header'>
        <div className='content-page-header'>
          <h5><i className='fa fa-credit-card me-2 text-primary' />Subscription</h5>
        </div>
      </div>

      {error && <div className='alert alert-danger'>{error}</div>}
      {notice && <div className='alert alert-success'>{notice}</div>}

      {details && (
        <div className='row'>
          <div className='col-lg-7'>
            {/* Current plan */}
            <div className='card mb-4'>
              <div className='card-header d-flex justify-content-between align-items-center'>
                <h6 className='mb-0'>Current plan</h6>
                <span className={`badge bg-${status.tone}`}>{status.text}</span>
              </div>
              <div className='card-body'>
                <h4 className='mb-1'>{details.plan?.plan_name || 'No plan selected'}</h4>
                <p className='text-muted mb-3'>
                  {intervalLabel(stripe?.billing_interval || details.billing_interval)} billing
                  {!hasLiveSubscription && details.expiry_date && (
                    <> · {details.expired ? 'ended' : 'access until'} {formatDate(details.expiry_date)}</>
                  )}
                </p>

                <dl className='row mb-0'>
                  <dt className='col-sm-5'>Seats in use</dt>
                  <dd className='col-sm-7'>
                    {details.seats_used} of {includedSeats + extraSeats}
                    <span className='text-muted small'> ({includedSeats} included{extraSeats > 0 ? ` + ${extraSeats} extra` : ''})</span>
                  </dd>
                  {stripe?.next_invoice && (
                    <>
                      <dt className='col-sm-5'>Next payment</dt>
                      <dd className='col-sm-7'>
                        {formatMoney(stripe.next_invoice.total, stripe.next_invoice.currency)} on {formatDate(stripe.next_invoice.date)}
                        {stripe.next_invoice.tax > 0 && (
                          <span className='text-muted small'> (incl. {formatMoney(stripe.next_invoice.tax, stripe.next_invoice.currency)} GST)</span>
                        )}
                      </dd>
                    </>
                  )}
                  {stripe?.cancel_at_period_end && (
                    <>
                      <dt className='col-sm-5'>Access ends</dt>
                      <dd className='col-sm-7'>{formatDate(stripe.cancel_at || stripe.current_period_end)} (no further charges)</dd>
                    </>
                  )}
                  {stripe?.payment_method && (
                    <>
                      <dt className='col-sm-5'>Payment method</dt>
                      <dd className='col-sm-7 text-capitalize'>
                        {stripe.payment_method.brand} •••• {stripe.payment_method.last4}
                        <span className='text-muted small'> (expires {String(stripe.payment_method.exp_month).padStart(2, '0')}/{stripe.payment_method.exp_year})</span>
                      </dd>
                    </>
                  )}
                </dl>

                {stripe?.status === 'past_due' && (
                  <div className='alert alert-danger mt-3 mb-0'>
                    Your last payment failed. Update your payment method in Manage billing to keep your team&apos;s access.
                  </div>
                )}

                <div className='d-flex flex-wrap gap-2 mt-4'>
                  {stripe && (
                    <button type='button' className='btn btn-primary' onClick={openBillingPortal} disabled={portalLoading}>
                      {portalLoading ? <span className='spinner-border spinner-border-sm me-2' /> : <i className='fa fa-external-link me-2' />}
                      Manage billing
                    </button>
                  )}
                  {!hasLiveSubscription && (
                    <Link to='/payment/checkout' className='btn btn-success'>
                      <i className='fa fa-lock me-2' />Subscribe
                    </Link>
                  )}
                  <Link to='/seat-usage' className='btn btn-outline-secondary'>View seat usage</Link>
                </div>
                {stripe && (
                  <p className='small text-muted mt-2 mb-0'>
                    Manage billing opens Stripe, where you can update your card and billing details (including ABN), download invoices, or cancel.
                  </p>
                )}
                {details.provider === 'pin' && !stripe && (
                  <p className='small text-muted mt-3 mb-0'>To change your plan or payment details, please contact support.</p>
                )}
              </div>
            </div>

            {/* Change plan or seats */}
            {stripe?.can_change_plan && (
              <div className='card mb-4'>
                <div className='card-header'>
                  <h6 className='mb-0'>Change plan or seats</h6>
                </div>
                <div className='card-body'>
                  <div className='row g-3'>
                    <div className='col-md-6'>
                      <label className='form-label' htmlFor='change-plan'>Plan</label>
                      <select
                        id='change-plan'
                        className='form-select'
                        value={changePlanId}
                        onChange={(event) => { setChangePlanId(event.target.value); resetPreview() }}
                      >
                        {plans.map((plan) => (
                          <option key={plan.plan_id} value={plan.plan_id}>
                            {plan.plan_name} · {Number(plan.admin_seats) + Number(plan.team_seats)} seats included
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='col-md-6'>
                      <label className='form-label' htmlFor='change-interval'>Billing</label>
                      <select
                        id='change-interval'
                        className='form-select'
                        value={changeInterval}
                        onChange={(event) => { setChangeInterval(event.target.value); resetPreview() }}
                      >
                        <option value='month'>Monthly</option>
                        <option value='year'>Annual (two months free)</option>
                      </select>
                    </div>
                    <div className='col-md-6'>
                      <label className='form-label' htmlFor='change-seats'>Extra seats</label>
                      <input
                        id='change-seats'
                        type='number'
                        className='form-control'
                        min={0}
                        max={MAX_EXTRA_SEATS}
                        value={changeSeats}
                        onChange={(event) => {
                          const value = Math.floor(Number(event.target.value))
                          setChangeSeats(Number.isFinite(value) ? Math.min(Math.max(value, 0), MAX_EXTRA_SEATS) : 0)
                          resetPreview()
                        }}
                      />
                      {minimumExtraSeats > 0 && (
                        <div className='form-text'>You have {details.seats_used} users, so this plan needs at least {minimumExtraSeats} extra seat(s).</div>
                      )}
                    </div>
                  </div>

                  {changeError && <div className='alert alert-danger mt-3 mb-0'>{changeError}</div>}

                  {preview && (
                    <div className='alert alert-light border mt-3 mb-0'>
                      <div className='fw-semibold mb-1'>
                        {preview.plan_name} · {intervalLabel(preview.billing_interval)} · {preview.extra_seats} extra seat(s)
                      </div>
                      <div>
                        New price: {formatMoney(preview.recurring_subtotal, preview.currency)}{periodLabel(preview.billing_interval)} + GST where applicable
                      </div>
                      <div>
                        {preview.due_now.total >= 0
                          ? <>Charged now: <strong>{formatMoney(preview.due_now.total, preview.currency)}</strong>{preview.due_now.tax > 0 && ` (incl. ${formatMoney(preview.due_now.tax, preview.currency)} GST)`}, prorated for the rest of your current period.</>
                          : <>Credit of <strong>{formatMoney(-preview.due_now.total, preview.currency)}</strong> for unused time, applied to your next invoices.</>}
                      </div>
                    </div>
                  )}

                  <div className='d-flex gap-2 mt-3'>
                    {!preview ? (
                      <button type='button' className='btn btn-outline-primary' onClick={() => submitChange(false)} disabled={changeLoading || !changePlanId}>
                        {changeLoading && <span className='spinner-border spinner-border-sm me-2' />}Review change
                      </button>
                    ) : (
                      <>
                        <button type='button' className='btn btn-primary' onClick={() => submitChange(true)} disabled={changeLoading}>
                          {changeLoading && <span className='spinner-border spinner-border-sm me-2' />}Confirm change
                        </button>
                        <button type='button' className='btn btn-outline-secondary' onClick={resetPreview} disabled={changeLoading}>Back</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Invoices */}
          <div className='col-lg-5'>
            <div className='card mb-4'>
              <div className='card-header'>
                <h6 className='mb-0'>Invoices</h6>
              </div>
              <div className='card-body p-0'>
                {stripe?.invoices?.length ? (
                  <table className='table table-sm mb-0'>
                    <thead>
                      <tr>
                        <th className='ps-3'>Date</th>
                        <th className='text-end'>Total</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {stripe.invoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className='ps-3'>
                            {formatDate(invoice.date)}
                            <div className='small text-muted'>{invoice.number}{invoice.status !== 'paid' && ` · ${invoice.status}`}</div>
                          </td>
                          <td className='text-end'>
                            {formatMoney(invoice.total, invoice.currency)}
                            {invoice.tax > 0 && <div className='small text-muted'>incl. {formatMoney(invoice.tax, invoice.currency)} GST</div>}
                          </td>
                          <td className='text-end pe-3'>
                            {invoice.invoice_pdf && <a href={invoice.invoice_pdf} target='_blank' rel='noreferrer'>PDF</a>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className='text-muted p-3 mb-0'>No invoices yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
