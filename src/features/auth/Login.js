import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { loginUser } from './authSlice'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { validateAuthToken } from '../../utils/auth'
import logo from 'assets/brand/grantmaestro-logo-full-colour-transparent.png'
import { FieldError, FormErrorSummary, PasswordField } from 'components/auth/AccessibleAuthFields'

const validationSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
})

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isLoggedIn, user } = useSelector((state) => state.auth)
  const [searchParams] = useSearchParams()
  const subscriptionEnded = searchParams.get('reason') === 'subscription-ended'
  const [submissionErrors, setSubmissionErrors] = useState({})

  useEffect(() => {
    if (isLoggedIn) navigate(user?.requires_password_reset ? '/force-password-reset' : '/dashboard')
    else validateAuthToken(dispatch).then((isValid) => { if (isValid) navigate('/dashboard') })
  }, [isLoggedIn, navigate, dispatch, user])

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: (values) => dispatch(loginUser({ email: values.email, password: btoa(values.password) }))
      .unwrap()
      .then((result) => navigate(result?.data?.userDetails?.requires_password_reset ? '/force-password-reset' : '/dashboard'))
      .catch((err) => console.error('Failed to login: ', err)),
  })

  const submit = async (event) => {
    event.preventDefault()
    const errors = await formik.validateForm()
    formik.setTouched({ email: true, password: true }, false)
    setSubmissionErrors(errors)
    if (Object.keys(errors).length) {
      document.getElementById(Object.keys(errors)[0])?.focus()
      return
    }
    formik.submitForm()
  }
  const showError = (name) => (formik.touched[name] || submissionErrors[name]) ? formik.errors[name] : ''

  return (
    <div className='login-inner-form'>
      <div className='details'>
        <div className='logo-2 mb-3'><a href='/'><img src={logo} alt='GrantMaestro' style={{ width: '200px' }} /></a></div>
        <h1 className='mb-3'>Sign in to your account</h1>
        <form onSubmit={submit} noValidate>
          <FormErrorSummary errors={submissionErrors} />
          <div className='form-group gm-auth-field'>
            <label htmlFor='email' className='form-label float-start'>Email address <span className='gm-required-mark' aria-hidden='true'>*</span></label>
            <input name='email' type='email' className={`form-control${showError('email') ? ' is-invalid' : ''}`} id='email' autoComplete='email' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} required aria-required='true' aria-invalid={Boolean(showError('email'))} aria-describedby={showError('email') ? 'email-error' : undefined} />
            <FieldError id='email-error' error={showError('email')} />
          </div>
          <PasswordField id='password' name='password' label='Password' value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} error={showError('password')} autoComplete='current-password' helperText='' />
          <div className='checkbox form-group clearfix'>
            <div className='form-check float-start'><input className='form-check-input' type='checkbox' id='rememberme' /><label className='form-check-label' htmlFor='rememberme'>Remember me</label></div>
            <Link to='/forgot-password' className='float-end forgot-password'>Forgot your password?</Link>
          </div>
          <div className='form-group clearfix'><button type='submit' className='btn btn-lg btn-primary btn-theme' disabled={loading}><span>{loading ? 'Signing in…' : 'Sign in'}</span></button></div>
        </form>
        {loading && <p role='status'>Signing you in…</p>}
        {subscriptionEnded && !error && (
          <p className='text-danger' role='alert'>Your organisation's subscription has ended. Please contact your administrator to renew.</p>
        )}
        {error && <p className='text-danger' role='alert'>{error.message}</p>}
        <div className='gm-auth-links'><Link to='/register'>Start your free trial</Link><Link to='/contact?topic=support'>Need help?</Link></div>
      </div>
    </div>
  )
}

export default Login
