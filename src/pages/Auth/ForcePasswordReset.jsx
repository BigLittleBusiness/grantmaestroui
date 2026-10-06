import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { forcePasswordReset } from 'features/auth/authSlice'
import { PASSWORD_POLICY } from 'components/auth/AccessibleAuthFields'

const ForcePasswordReset = () => {
  const dispatch = useDispatch(); const navigate = useNavigate(); const { loading } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ new_password: '', confirm_password: '' })
  const [errors, setErrors] = useState({}); const [serverError, setServerError] = useState(''); const [showPasswords, setShowPasswords] = useState(false)
  const validate = () => {
    const next = {}
    if (!form.new_password) next.new_password = 'New password is required.'
    else if (form.new_password.length < 8) next.new_password = 'Password must be at least 8 characters.'
    else if (!/[A-Z]/.test(form.new_password)) next.new_password = 'Password must contain at least one uppercase letter.'
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.new_password)) next.new_password = 'Password must contain at least one special character.'
    if (!form.confirm_password) next.confirm_password = 'Please confirm your new password.'
    else if (form.new_password !== form.confirm_password) next.confirm_password = 'Passwords do not match.'
    return next
  }
  const handleChange = (event) => { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); setErrors((current) => ({ ...current, [event.target.name]: '' })) }
  const handleSubmit = async (event) => {
    event.preventDefault(); const nextErrors = validate()
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); document.getElementById(Object.keys(nextErrors)[0])?.focus(); return }
    try { await dispatch(forcePasswordReset({ new_password: btoa(form.new_password) })).unwrap(); navigate('/login', { state: { message: 'Password updated. Please sign in with your new password.' } }) } catch { setServerError('Failed to update password. Please try again or contact support.') }
  }
  return (
    <main className='gm-force-reset' id='main-content' tabIndex='-1'>
      <div className='gm-force-reset__card'><header className='gm-force-reset__header'><h1>GrantMaestro</h1><p>Set up your secure account access</p></header><section className='gm-force-reset__body'><div className='gm-force-reset__icon' aria-hidden='true'>🔐</div><h2>Set your password</h2><p>For security, invited team members must set a personal password before accessing the workspace. Your temporary password will be replaced immediately.</p><form onSubmit={handleSubmit} noValidate>{Object.keys(errors).length > 0 && <div className='gm-form-error-summary' role='alert'>Please correct the highlighted fields.</div>}<div className='gm-force-reset__field'><label htmlFor='new_password'>New password <span className='gm-required-mark' aria-hidden='true'>*</span></label><input id='new_password' type={showPasswords ? 'text' : 'password'} name='new_password' value={form.new_password} onChange={handleChange} autoComplete='new-password' required aria-required='true' aria-invalid={Boolean(errors.new_password)} aria-describedby={errors.new_password ? 'new-password-policy new-password-error' : 'new-password-policy'} /><p id='new-password-policy'>{PASSWORD_POLICY}</p>{errors.new_password && <p id='new-password-error' className='gm-field-error' role='alert'>{errors.new_password}</p>}</div><div className='gm-force-reset__field'><label htmlFor='confirm_password'>Confirm new password <span className='gm-required-mark' aria-hidden='true'>*</span></label><input id='confirm_password' type={showPasswords ? 'text' : 'password'} name='confirm_password' value={form.confirm_password} onChange={handleChange} autoComplete='new-password' required aria-required='true' aria-invalid={Boolean(errors.confirm_password)} aria-describedby={errors.confirm_password ? 'confirm-password-error' : undefined} />{errors.confirm_password && <p id='confirm-password-error' className='gm-field-error' role='alert'>{errors.confirm_password}</p>}</div><button type='button' className='gm-force-reset__show' onClick={() => setShowPasswords((current) => !current)} aria-pressed={showPasswords}>{showPasswords ? 'Hide passwords' : 'Show passwords'}</button>{serverError && <p className='gm-field-error' role='alert'>{serverError}</p>}<button type='submit' className='gm-force-reset__submit' disabled={loading}>{loading ? 'Saving…' : 'Set password & continue'}</button></form></section><footer className='gm-force-reset__footer'>Need help? <a href='/contact?topic=support'>Contact support</a></footer></div>
    </main>
  )
}
export default ForcePasswordReset
