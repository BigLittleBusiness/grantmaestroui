import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchPromoCodes,
  createPromoCode,
  deletePromoCode,
} from '../../features/settings/settingsSlice'
import './settings.css'

const EMPTY_FORM = {
  code: '',
  discount_type: 'percentage',
  discount_value: '',
  duration_months: 1,
  expires_at: '',
}

/**
 * PromoCodesPage
 *
 * System Admin page for creating and managing promotional discount codes.
 * Accessible at /admin/promo-codes (Super Admin only).
 *
 * Features:
 *   - View all active promo codes in a table
 *   - Create new codes: percentage or fixed-dollar discount, duration, expiry
 *   - Delete (soft-delete) any code
 *   - One code per subscription; codes are reusable until deleted or expired
 */
export default function PromoCodesPage() {
  const dispatch = useDispatch()
  const { promoCodes, promoCodesLoading } = useSelector((s) => s.settings)

  const [form, setForm] = useState(EMPTY_FORM)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null) // promo_id to confirm

  useEffect(() => {
    dispatch(fetchPromoCodes())
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    const payload = {
      code: form.code.trim().toUpperCase(),
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      duration_months: parseInt(form.duration_months, 10),
      expires_at: form.expires_at || null,
    }
    const result = await dispatch(createPromoCode(payload))
    setCreating(false)
    if (!result.error) {
      setForm(EMPTY_FORM)
      setShowForm(false)
    }
  }

  const handleDelete = async (promo_id) => {
    await dispatch(deletePromoCode(promo_id))
    setConfirmDelete(null)
  }

  const formatDiscount = (type, value) => {
    if (type === 'percentage') return `${value}% off`
    return `$${value} off`
  }

  const formatExpiry = (date) => {
    if (!date) return <span className="text-muted">No expiry</span>
    const d = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expired = d < today
    return (
      <span className={expired ? 'text-danger' : 'text-success'}>
        {expired ? <i className="fa fa-times-circle me-1" /> : <i className="fa fa-check-circle me-1" />}
        {d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })}
        {expired && ' (expired)'}
      </span>
    )
  }

  return (
    <div className="content container-fluid">
      {/* Page Header */}
      <div className="page-header">
        <div className="content-page-header d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <i className="fa fa-ticket me-2 text-primary" />
            Promo Codes
          </h5>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-warning text-dark">Super Admin Only</span>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowForm((v) => !v)}
            >
              <i className={`fa fa-${showForm ? 'times' : 'plus'} me-1`} />
              {showForm ? 'Cancel' : 'Create Promo Code'}
            </button>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card mb-4 border-primary">
          <div className="card-header bg-primary text-white">
            <h6 className="mb-0">
              <i className="fa fa-plus-circle me-2" />
              New Promo Code
            </h6>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreate}>
              <div className="row g-3">
                {/* Code */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">
                    Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control text-uppercase font-monospace"
                    name="code"
                    placeholder="e.g. EARLYBIRD25"
                    value={form.code}
                    onChange={handleChange}
                    required
                    maxLength={50}
                    pattern="[A-Za-z0-9_\-]+"
                    title="Letters, numbers, hyphens and underscores only"
                  />
                  <div className="form-text">Letters, numbers, hyphens and underscores only. Stored in uppercase.</div>
                </div>

                {/* Discount Type */}
                <div className="col-md-2">
                  <label className="form-label fw-semibold">
                    Type <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="discount_type"
                    value={form.discount_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div className="col-md-2">
                  <label className="form-label fw-semibold">
                    Value <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      {form.discount_type === 'percentage' ? '%' : '$'}
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      name="discount_value"
                      placeholder={form.discount_type === 'percentage' ? '10' : '50'}
                      value={form.discount_value}
                      onChange={handleChange}
                      required
                      min="0.01"
                      max={form.discount_type === 'percentage' ? '100' : undefined}
                      step="0.01"
                    />
                  </div>
                  <div className="form-text">
                    {form.discount_type === 'percentage'
                      ? 'Enter 1–100'
                      : 'Dollar amount off per month'}
                  </div>
                </div>

                {/* Duration */}
                <div className="col-md-2">
                  <label className="form-label fw-semibold">
                    Duration (months) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      name="duration_months"
                      placeholder="1"
                      value={form.duration_months}
                      onChange={handleChange}
                      required
                      min="1"
                      max="24"
                    />
                    <span className="input-group-text">mo</span>
                  </div>
                  <div className="form-text">How many months the discount applies</div>
                </div>

                {/* Expiry Date */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Expiry Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="expires_at"
                    value={form.expires_at}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <div className="form-text">Leave blank for no expiry</div>
                </div>
              </div>

              {/* Preview */}
              {form.code && form.discount_value && (
                <div className="alert alert-light border mt-3 mb-0">
                  <strong>Preview:</strong> Code{' '}
                  <span className="badge bg-dark font-monospace">{form.code.toUpperCase()}</span>{' '}
                  gives{' '}
                  <strong>
                    {form.discount_type === 'percentage'
                      ? `${form.discount_value}% off`
                      : `$${form.discount_value} off`}
                  </strong>{' '}
                  for{' '}
                  <strong>{form.duration_months} month{form.duration_months > 1 ? 's' : ''}</strong>
                  {form.expires_at && (
                    <>, expiring <strong>{new Date(form.expires_at).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></>
                  )}
                  .
                </div>
              )}

              <div className="mt-3">
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Creating...</>
                  ) : (
                    <><i className="fa fa-plus me-2" />Create Code</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promo Codes Table */}
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h6 className="mb-0">
            <i className="fa fa-list me-2" />
            Active Promo Codes
          </h6>
          <span className="badge bg-secondary">{promoCodes.length} code{promoCodes.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="card-body p-0">
          {promoCodesLoading ? (
            <div className="text-center py-4">
              <span className="spinner-border text-primary" />
            </div>
          ) : promoCodes.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="fa fa-ticket fa-2x mb-2 d-block" />
              No promo codes created yet.
              <br />
              <button
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={() => setShowForm(true)}
              >
                Create your first code
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Duration</th>
                    <th>Expiry</th>
                    <th>Created</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {promoCodes.map((promo) => (
                    <tr key={promo.promo_id}>
                      <td>
                        <span className="badge bg-dark font-monospace fs-6 px-3 py-2">
                          {promo.code}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${promo.discount_type === 'percentage' ? 'bg-info text-dark' : 'bg-success'}`}>
                          {formatDiscount(promo.discount_type, promo.discount_value)}
                        </span>
                      </td>
                      <td>
                        {promo.duration_months} month{promo.duration_months !== 1 ? 's' : ''}
                      </td>
                      <td>{formatExpiry(promo.expires_at)}</td>
                      <td className="text-muted small">
                        {new Date(promo.created_at).toLocaleDateString('en-AU', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="text-end">
                        {confirmDelete === promo.promo_id ? (
                          <div className="d-flex gap-1 justify-content-end">
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(promo.promo_id)}
                            >
                              <i className="fa fa-check me-1" />Confirm
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => setConfirmDelete(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => setConfirmDelete(promo.promo_id)}
                            title="Delete promo code"
                          >
                            <i className="fa fa-trash" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
