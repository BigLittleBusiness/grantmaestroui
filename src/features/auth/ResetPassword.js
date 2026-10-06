import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { resetPassword } from './authSlice'
import logo from 'assets/brand/grantmaestro-logo-full-colour-transparent.png'
import { FormErrorSummary, PASSWORD_POLICY, PasswordField } from 'components/auth/AccessibleAuthFields'

const validationSchema = yup.object({
  password: yup.string().min(8, 'Password must be at least 8 characters').matches(/[A-Z]/, 'Password must contain at least one uppercase letter').matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character').required('Password is required'),
  confirm_password: yup.string().oneOf([yup.ref('password'), null], 'Confirm password must match your new password').required('Confirm password is required'),
})

const ResetPassword = () => {
  const dispatch = useDispatch(); const navigate = useNavigate(); const { loading, error } = useSelector((state) => state.auth)
  const search = useLocation().search; const identity = new URLSearchParams(search).get('uid'); const salt = new URLSearchParams(search).get('code')
  const [submissionErrors, setSubmissionErrors] = useState({})
  const validLink = Boolean(identity && salt)
  const formik = useFormik({
    initialValues: { password: '', confirm_password: '' }, validationSchema,
    onSubmit: (values) => dispatch(resetPassword({ password: btoa(values.password), identity, salt })).unwrap().then(() => navigate('/login')).catch((err) => console.error('Password reset failed: ', err)),
  })
  const submit = async (event) => {
    event.preventDefault(); const errors = await formik.validateForm(); formik.setTouched({ password: true, confirm_password: true }, false); setSubmissionErrors(errors)
    if (Object.keys(errors).length) { document.getElementById(Object.keys(errors)[0])?.focus(); return }
    formik.submitForm()
  }
  const errorFor = (name) => (formik.touched[name] || submissionErrors[name]) ? formik.errors[name] : ''

  return (
    <div className='login-inner-form'><div className='details'>
      <div className='logo-2 mb-3'><a href='/'><img src={logo} alt='GrantMaestro' style={{ width: '200px' }} /></a></div>
      <h1 className='mb-3'>Reset your password</h1>
      {!validLink ? <div className='gm-form-error-summary' role='alert'><strong>This reset link is incomplete or no longer available.</strong><p>Request a new password-reset link to continue. For security, reset links can expire or be used only once.</p></div> : <>
        <p className='text-muted mb-3'>Choose a new password for your GrantMaestro account.</p>
        <form onSubmit={submit} noValidate><FormErrorSummary errors={submissionErrors} /><PasswordField id='password' name='password' label='New password' value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} error={errorFor('password')} helperText={PASSWORD_POLICY} /><PasswordField id='confirm_password' name='confirm_password' label='Confirm new password' value={formik.values.confirm_password} onChange={formik.handleChange} onBlur={formik.handleBlur} error={errorFor('confirm_password')} helperText='Re-enter your new password exactly as above.' /><div className='form-group clearfix'><button type='submit' className='btn btn-lg btn-primary btn-theme' disabled={loading}><span>{loading ? 'Resetting…' : 'Reset password'}</span></button></div></form>
      </>}
      {error && <p className='text-danger' role='alert'>{error.message}</p>}
      <div className='gm-auth-links'><a href='/login'>Back to sign in</a><a href='/forgot-password'>Request a new link</a><a href='/contact?topic=support'>Need support?</a></div>
    </div></div>
  )
}
export default ResetPassword
