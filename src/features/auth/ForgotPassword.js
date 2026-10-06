import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { forgotPassword } from './authSlice'
import logo from 'assets/brand/grantmaestro-logo-full-colour-transparent.png'
import { FieldError, FormErrorSummary } from 'components/auth/AccessibleAuthFields'

const validationSchema = yup.object({ email: yup.string().email('Invalid email address').required('Email is required') })

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)
  const [submissionErrors, setSubmissionErrors] = useState({})
  const [requested, setRequested] = useState(false)
  const formik = useFormik({
    initialValues: { email: '' }, validationSchema,
    onSubmit: (values) => dispatch(forgotPassword({ email: values.email })).unwrap().then(() => setRequested(true)).catch((err) => console.error('Password reset request failed: ', err)),
  })
  const submit = async (event) => {
    event.preventDefault()
    const errors = await formik.validateForm()
    formik.setTouched({ email: true }, false); setSubmissionErrors(errors)
    if (Object.keys(errors).length) { document.getElementById('email')?.focus(); return }
    formik.submitForm()
  }
  const emailError = (formik.touched.email || submissionErrors.email) ? formik.errors.email : ''
  return (
    <div className='login-inner-form'><div className='details'>
      <div className='logo-2 mb-3'><a href='/'><img src={logo} alt='GrantMaestro' style={{ width: '200px' }} /></a></div>
      <h1 className='mb-3'>Reset your password</h1>
      {requested ? <div className='gm-form-error-summary' role='status'><strong>Check your inbox.</strong><p>If an account matches that email address, a reset link has been sent. Check junk mail too. For security, this message does not confirm whether an account exists.</p></div> : <>
        <p className='text-muted mb-3'>Enter the email address used for your account. If it matches an account, we will send a reset link.</p>
        <form onSubmit={submit} noValidate><FormErrorSummary errors={submissionErrors} />
          <div className='form-group gm-auth-field'><label htmlFor='email' className='form-label float-start'>Email address <span className='gm-required-mark' aria-hidden='true'>*</span></label><input name='email' type='email' className={`form-control${emailError ? ' is-invalid' : ''}`} id='email' autoComplete='email' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} required aria-required='true' aria-invalid={Boolean(emailError)} aria-describedby={emailError ? 'email-error' : undefined} /><FieldError id='email-error' error={emailError} /></div>
          <div className='form-group clearfix'><button type='submit' className='btn btn-lg btn-primary btn-theme' disabled={loading}><span>{loading ? 'Sending…' : 'Send reset link'}</span></button></div>
        </form>
      </>}
      {error && <p className='text-danger' role='alert'>{error.message}</p>}
      <div className='gm-auth-links'><a href='/login'>Back to sign in</a><a href='/contact?topic=support'>Need support?</a></div>
    </div></div>
  )
}
export default ForgotPassword
