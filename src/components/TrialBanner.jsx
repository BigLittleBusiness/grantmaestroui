import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ROLE } from 'utils/roleAccess'

const DAY_MS = 24 * 60 * 60 * 1000
const URGENT_DAYS = 3

const formatDate = (date) => date.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })

/**
 * Free-trial countdown shown above every organisation page. The trial ends
 * when access ends (the expiry date is a UTC date, as the API compares it).
 */
export default function TrialBanner({ user }) {
  const { pathname } = useLocation()
  if (!user?.subscription_is_in_trial || user.subscription_expired || !user.subscription_expiry_date) return null
  if (pathname.startsWith('/payment/')) return null

  const endsAt = new Date(user.subscription_expiry_date)
  const daysLeft = Math.max(Math.ceil((endsAt.getTime() - Date.now()) / DAY_MS), 0)
  const isOrgAdmin = Number(user.user_role_id) === ROLE.ORGANISATION_ADMIN
  const remaining = daysLeft === 0 ? 'ends today' : `ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`

  return (
    <div
      className={`alert ${daysLeft <= URGENT_DAYS ? 'alert-warning' : 'alert-info'} d-flex flex-wrap align-items-center justify-content-between gap-2 mx-3 mt-3 mb-0 py-2`}
      role='status'
    >
      <span>
        <i className='fa fa-clock-o me-2' aria-hidden='true' />
        Your free trial <strong>{remaining}</strong> ({formatDate(endsAt)}).
        {!isOrgAdmin && ' Your organisation administrator can subscribe to keep your access.'}
      </span>
      {isOrgAdmin && (
        <Link to='/payment/checkout' className='btn btn-sm btn-primary'>Subscribe now</Link>
      )}
    </div>
  )
}
