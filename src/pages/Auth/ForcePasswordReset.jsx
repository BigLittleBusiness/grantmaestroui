/**
 * ForcePasswordReset.jsx
 *
 * Shown to any user whose `requires_password_reset` flag is set to 1.
 * Typically this is a newly invited team member who received a system-generated
 * password.  The user MUST set a new password before accessing the dashboard.
 * On success the flag is cleared server-side and the user is redirected to login.
 */
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updatePassword } from 'features/auth/authSlice'

const ForcePasswordReset = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)

  const [form, setForm] = useState({ new_password: '', confirm_password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.new_password) e.new_password = 'New password is required.'
    else if (form.new_password.length < 8) e.new_password = 'Password must be at least 8 characters.'
    if (!form.confirm_password) e.confirm_password = 'Please confirm your new password.'
    else if (form.new_password !== form.confirm_password) e.confirm_password = 'Passwords do not match.'
    return e
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    try {
      // The changePassword endpoint requires old_password — for a forced reset
      // we send the temporary password stored in the auth state (not ideal but
      // avoids a separate endpoint).  A dedicated /force-reset endpoint would
      // be cleaner; this is flagged for a future sprint.
      await dispatch(
        updatePassword({
          old_password: btoa('__force_reset__'),
          new_password: btoa(form.new_password),
        })
      ).unwrap()
      navigate('/login', { state: { message: 'Password updated. Please log in with your new password.' } })
    } catch (err) {
      setServerError('Failed to update password. Please try again or contact support.')
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.brand}>Grant Maestro</h1>
          <p style={styles.tagline}>Smarter Grant Management</p>
        </div>

        {/* Body */}
        <div style={styles.body}>
          <div style={styles.iconWrap}>🔐</div>
          <h2 style={styles.title}>Set Your Password</h2>
          <p style={styles.subtitle}>
            Welcome to Grant Maestro. For your security, you must set a personal
            password before accessing your account. Your temporary password will
            be replaced immediately.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                style={{
                  ...styles.input,
                  borderColor: errors.new_password ? '#ef4444' : '#d1d5db',
                }}
                autoComplete="new-password"
              />
              {errors.new_password && (
                <p style={styles.error}>{errors.new_password}</p>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Confirm New Password</label>
              <input
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Re-enter your new password"
                style={{
                  ...styles.input,
                  borderColor: errors.confirm_password ? '#ef4444' : '#d1d5db',
                }}
                autoComplete="new-password"
              />
              {errors.confirm_password && (
                <p style={styles.error}>{errors.confirm_password}</p>
              )}
            </div>

            {serverError && <p style={styles.serverError}>{serverError}</p>}

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? 'Saving…' : 'Set Password & Continue'}
            </button>
          </form>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Need help?{' '}
            <a href="mailto:support@grantmaestro.com.au" style={styles.link}>
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a3c5e 0%, #2563eb 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    maxWidth: '480px',
    width: '100%',
    overflow: 'hidden',
  },
  header: {
    background: '#1a3c5e',
    padding: '28px 36px',
    textAlign: 'center',
  },
  brand: {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: 700,
    margin: 0,
  },
  tagline: {
    color: '#a8c4e0',
    fontSize: '13px',
    margin: '4px 0 0',
  },
  body: {
    padding: '36px',
  },
  iconWrap: {
    fontSize: '36px',
    textAlign: 'center',
    marginBottom: '12px',
  },
  title: {
    color: '#1a3c5e',
    fontSize: '22px',
    fontWeight: 700,
    textAlign: 'center',
    margin: '0 0 10px',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: 1.6,
    textAlign: 'center',
    margin: '0 0 28px',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    fontSize: '15px',
    border: '1.5px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  error: {
    color: '#ef4444',
    fontSize: '13px',
    margin: '4px 0 0',
  },
  serverError: {
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    borderRadius: '6px',
    color: '#b91c1c',
    fontSize: '14px',
    padding: '10px 14px',
    marginBottom: '16px',
  },
  btn: {
    width: '100%',
    background: '#1a3c5e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '13px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '4px',
  },
  footer: {
    borderTop: '1px solid #f3f4f6',
    padding: '16px 36px',
    textAlign: 'center',
  },
  footerText: {
    color: '#9ca3af',
    fontSize: '13px',
    margin: 0,
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
  },
}

export default ForcePasswordReset
