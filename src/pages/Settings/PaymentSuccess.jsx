import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../api'

const formatMoney = (amount, currency = 'aud') => new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: currency.toUpperCase(),
}).format(Number(amount || 0))

const formatDate = (isoDate) => new Date(isoDate).toLocaleDateString('en-AU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Australia/Sydney',
})

// Stripe may still be confirming the payment when the customer returns.
const MAX_ATTEMPTS = 5
const RETRY_DELAY_MS = 3000

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [state, setState] = useState({ status: sessionId ? 'loading' : 'error', data: null, message: '' })

  useEffect(() => {
    if (!sessionId) return undefined
    let active = true
    let timer = null

    const confirm = async (attempt) => {
      try {
        const response = await api.get(`subscription/checkout-session/${encodeURIComponent(sessionId)}`)
        if (!active) return
        const data = response.data?.data
        if (data?.paid) {
          setState({ status: 'paid', data, message: '' })
        } else if (data?.session_status === 'complete' && attempt < MAX_ATTEMPTS) {
          timer = setTimeout(() => confirm(attempt + 1), RETRY_DELAY_MS)
        } else {
          setState({ status: data?.session_status === 'complete' ? 'processing' : 'incomplete', data, message: '' })
        }
      } catch (error) {
        if (!active) return
        setState({
          status: 'error',
          data: null,
          message: error?.response?.data?.message || 'We could not confirm your payment.',
        })
      }
    }

    confirm(1)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [sessionId])

  const { status, data, message } = state

  return (
    <div className='content container-fluid'>
      <div className='row justify-content-center mt-5'>
        <div className='col-lg-6 col-md-8'>
          <div className='card border-0 shadow-sm p-4 p-md-5'>
            {status === 'loading' && (
              <div className='text-center py-4'>
                <span className='spinner-border text-primary mb-3' />
                <p className='text-muted mb-0'>Confirming your payment with Stripe…</p>
              </div>
            )}

            {status === 'paid' && data && (
              <>
                <div className='text-center mb-4'>
                  <i className='fa fa-check-circle text-success' style={{ fontSize: '4rem' }} />
                  <h4 className='text-success mt-3 mb-2'>Payment Successful</h4>
                  <p className='text-muted mb-0'>
                    Your GrantMaestro {data.plan_name} subscription is now active for your whole team.
                  </p>
                </div>

                <table className='table table-sm mb-3'>
                  <tbody>
                    <tr>
                      <td>{data.plan_name} · {data.billing_interval === 'year' ? 'Annual' : 'Monthly'}{data.extra_seats > 0 ? ` + ${data.extra_seats} extra seat${data.extra_seats === 1 ? '' : 's'}` : ''}</td>
                      <td className='text-end'>{formatMoney(data.amount_subtotal, data.currency)}</td>
                    </tr>
                    {data.amount_discount > 0 && (
                      <tr>
                        <td>Discount</td>
                        <td className='text-end'>−{formatMoney(data.amount_discount, data.currency)}</td>
                      </tr>
                    )}
                    <tr>
                      <td>{data.amount_tax > 0 ? 'GST (10%)' : `GST${data.billing_country && data.billing_country !== 'AU' ? ' (not applicable outside Australia)' : ''}`}</td>
                      <td className='text-end'>{formatMoney(data.amount_tax, data.currency)}</td>
                    </tr>
                    <tr className='fw-bold'>
                      <td>Total paid</td>
                      <td className='text-end'>{formatMoney(data.amount_total, data.currency)}</td>
                    </tr>
                  </tbody>
                </table>

                {data.next_renewal && (
                  <p className='small text-muted'>Your subscription renews automatically on {formatDate(data.next_renewal)}.</p>
                )}

                <div className='d-flex flex-wrap gap-2 justify-content-center mt-2'>
                  <a href='/dashboard' className='btn btn-primary px-4'>Go to Dashboard</a>
                  {data.invoice_url && (
                    <a href={data.invoice_url} target='_blank' rel='noreferrer' className='btn btn-outline-secondary px-4'>
                      <i className='fa fa-file-text-o me-2' />View Tax Invoice
                    </a>
                  )}
                </div>
              </>
            )}

            {status === 'processing' && (
              <div className='text-center'>
                <i className='fa fa-clock-o text-warning' style={{ fontSize: '4rem' }} />
                <h4 className='mt-3 mb-2'>Payment Processing</h4>
                <p className='text-muted'>
                  Stripe is still confirming your payment. Your subscription will activate automatically once it clears, and you will receive a confirmation email.
                </p>
                <a href='/dashboard' className='btn btn-primary px-4'>Go to Dashboard</a>
              </div>
            )}

            {status === 'incomplete' && (
              <div className='text-center'>
                <i className='fa fa-exclamation-circle text-warning' style={{ fontSize: '4rem' }} />
                <h4 className='mt-3 mb-2'>Checkout Not Completed</h4>
                <p className='text-muted'>This checkout was not completed and you have not been charged.</p>
                <a href='/payment/checkout' className='btn btn-primary px-4'>Return to Checkout</a>
              </div>
            )}

            {status === 'error' && (
              <div className='text-center'>
                <i className='fa fa-times-circle text-danger' style={{ fontSize: '4rem' }} />
                <h4 className='mt-3 mb-2'>We Could Not Confirm Your Payment</h4>
                <p className='text-muted'>
                  {message || 'This page is missing its payment reference.'} If you were charged, your subscription will still activate automatically. Please contact support if it does not appear within a few minutes.
                </p>
                <div className='d-flex flex-wrap gap-2 justify-content-center'>
                  <a href='/dashboard' className='btn btn-primary px-4'>Go to Dashboard</a>
                  <a href='/contact?topic=support' className='btn btn-outline-secondary px-4'>Contact Support</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
