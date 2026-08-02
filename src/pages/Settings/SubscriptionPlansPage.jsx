import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAdminPlans,
  updateAdminPlan,
} from '../../features/settings/settingsSlice'
import './settings.css'

/**
 * SubscriptionPlansPage
 *
 * System Admin page for viewing and editing subscription plan pricing,
 * seat allowances, overage rates, and trial days.
 * Accessible at /admin/subscription-plans (Super Admin only).
 */
export default function SubscriptionPlansPage() {
  const dispatch = useDispatch()
  const { adminPlans, adminPlansLoading } = useSelector((s) => s.settings)

  // Track which plan is currently being edited (by plan_id), and its draft values
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(fetchAdminPlans())
  }, [dispatch])

  const startEdit = (plan) => {
    setEditingId(plan.plan_id)
    setDraft({ ...plan })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft({})
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setDraft((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    await dispatch(updateAdminPlan({ plan_id: editingId, ...draft }))
    setSaving(false)
    setEditingId(null)
    setDraft({})
  }

  const planBadgeColor = (name) => {
    if (!name) return 'secondary'
    const n = name.toLowerCase()
    if (n === 'starter') return 'info'
    if (n === 'pro') return 'primary'
    if (n === 'enterprise') return 'warning'
    return 'secondary'
  }

  return (
    <div className="content container-fluid">
      {/* Page Header */}
      <div className="page-header">
        <div className="content-page-header d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <i className="fa fa-tags me-2 text-primary" />
            Subscription Plans
          </h5>
          <span className="badge bg-warning text-dark">Super Admin Only</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="alert alert-info d-flex align-items-start mb-4" role="alert">
        <i className="fa fa-info-circle me-2 mt-1" />
        <div>
          <strong>Managing Subscription Plans</strong>
          <p className="mb-0 mt-1">
            Changes made here update both the database and the figures shown on the public
            pricing page. Adjust prices, seat allowances, overage rates, and trial days as
            needed. The plan names (Starter, Pro, Enterprise) are fixed to maintain
            consistency with payment processing records.
          </p>
        </div>
      </div>

      {adminPlansLoading ? (
        <div className="text-center py-5">
          <span className="spinner-border text-primary" />
          <p className="mt-2 text-muted">Loading plans...</p>
        </div>
      ) : (
        <div className="row g-4">
          {adminPlans.map((plan) => {
            const isEditing = editingId === plan.plan_id
            const d = isEditing ? draft : plan

            return (
              <div className="col-lg-4 col-md-6" key={plan.plan_id}>
                <div className={`card h-100 shadow-sm border-top border-3 border-${planBadgeColor(plan.plan_name)}`}>
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h6 className="mb-0 fw-bold">
                      <span className={`badge bg-${planBadgeColor(plan.plan_name)} me-2`}>
                        {plan.plan_name}
                      </span>
                      Plan
                    </h6>
                    {!isEditing && (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => startEdit(plan)}
                      >
                        <i className="fa fa-pencil me-1" /> Edit
                      </button>
                    )}
                  </div>

                  <div className="card-body">
                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted text-uppercase">
                        Description
                      </label>
                      {isEditing ? (
                        <textarea
                          className="form-control form-control-sm"
                          name="plan_description"
                          rows={2}
                          value={d.plan_description}
                          onChange={handleChange}
                        />
                      ) : (
                        <p className="small mb-0">{plan.plan_description}</p>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold small text-muted text-uppercase">
                          Monthly Price (AUD)
                        </label>
                        {isEditing ? (
                          <div className="input-group input-group-sm">
                            <span className="input-group-text">$</span>
                            <input
                              type="number"
                              className="form-control"
                              name="plan_price"
                              min="0"
                              step="0.01"
                              value={d.plan_price}
                              onChange={handleChange}
                            />
                          </div>
                        ) : (
                          <p className="fw-bold fs-5 mb-0 text-primary">${plan.plan_price}/mo</p>
                        )}
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold small text-muted text-uppercase">
                          Annual Price (AUD)
                        </label>
                        {isEditing ? (
                          <div className="input-group input-group-sm">
                            <span className="input-group-text">$</span>
                            <input
                              type="number"
                              className="form-control"
                              name="annual_price"
                              min="0"
                              step="0.01"
                              value={d.annual_price}
                              onChange={handleChange}
                            />
                          </div>
                        ) : (
                          <p className="fw-bold fs-5 mb-0 text-success">${plan.annual_price}/mo</p>
                        )}
                      </div>
                    </div>

                    {/* Seats */}
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold small text-muted text-uppercase">
                          Admin Seats
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            name="admin_seats"
                            min="1"
                            value={d.admin_seats}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="mb-0 fw-semibold">{plan.admin_seats}</p>
                        )}
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold small text-muted text-uppercase">
                          Team Seats
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            name="team_seats"
                            min="0"
                            value={d.team_seats}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="mb-0 fw-semibold">{plan.team_seats}</p>
                        )}
                      </div>
                    </div>

                    {/* Overage Rate */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted text-uppercase">
                        Per-Seat Overage Rate (AUD/mo)
                      </label>
                      {isEditing ? (
                        <div className="input-group input-group-sm">
                          <span className="input-group-text">$</span>
                          <input
                            type="number"
                            className="form-control"
                            name="overage_rate"
                            min="0"
                            step="0.01"
                            value={d.overage_rate}
                            onChange={handleChange}
                          />
                          <span className="input-group-text">/seat/mo</span>
                        </div>
                      ) : (
                        <p className="mb-0">${plan.overage_rate}/seat/mo</p>
                      )}
                    </div>

                    {/* Trial Days */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-muted text-uppercase">
                        Free Trial Days
                      </label>
                      {isEditing ? (
                        <div className="input-group input-group-sm">
                          <input
                            type="number"
                            className="form-control"
                            name="trial_days"
                            min="0"
                            max="90"
                            value={d.trial_days}
                            onChange={handleChange}
                          />
                          <span className="input-group-text">days</span>
                        </div>
                      ) : (
                        <p className="mb-0">
                          <span className="badge bg-success">{plan.trial_days} days free</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Edit Actions */}
                  {isEditing && (
                    <div className="card-footer d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm flex-fill"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? (
                          <><span className="spinner-border spinner-border-sm me-1" />Saving...</>
                        ) : (
                          <><i className="fa fa-save me-1" />Save Changes</>
                        )}
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={cancelEdit}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Summary Table */}
      {!adminPlansLoading && adminPlans.length > 0 && (
        <div className="card mt-4">
          <div className="card-header">
            <h6 className="mb-0">
              <i className="fa fa-table me-2" />
              Plan Summary
            </h6>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Plan</th>
                    <th>Monthly</th>
                    <th>Annual</th>
                    <th>Admin Seats</th>
                    <th>Team Seats</th>
                    <th>Overage</th>
                    <th>Trial</th>
                  </tr>
                </thead>
                <tbody>
                  {adminPlans.map((p) => (
                    <tr key={p.plan_id}>
                      <td>
                        <span className={`badge bg-${planBadgeColor(p.plan_name)}`}>
                          {p.plan_name}
                        </span>
                      </td>
                      <td>${p.plan_price}/mo</td>
                      <td>${p.annual_price}/mo</td>
                      <td>{p.admin_seats}</td>
                      <td>{p.team_seats}</td>
                      <td>${p.overage_rate}/seat/mo</td>
                      <td>{p.trial_days} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
