import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { registerUser, verifyOtp } from './authSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import { validateAuthToken } from '../../utils/auth'
import api from '../../api'
import logo from 'assets/brand/grantmaestro-logo-full-colour-transparent.png'
import { FieldError, FormErrorSummary, PASSWORD_POLICY, PasswordField } from 'components/auth/AccessibleAuthFields'

const registrationSchema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  organization_name: yup.string().required('Organisation name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').matches(/[A-Z]/, 'Password must contain at least one uppercase letter').matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character').required('Password is required'),
})
const otpSchema = yup.object({ otp: yup.string().length(4, 'Verification code must be 4 digits').matches(/^\d{4}$/, 'Verification code must be 4 digits').required('Verification code is required') })
const planLabels = { starter: 'Starter · 1 Admin + 3 Team Members', pro: 'Pro · 2 Admins + 10 Team Members', enterprise: 'Enterprise · 5 Admins + 20 Team Members' }
const planPricing = { starter: { monthly: 99, annual: 990 }, pro: { monthly: 275, annual: 2750 }, enterprise: { monthly: 825, annual: 8250 } }
const planIds = { starter: 1, pro: 2, enterprise: 3 }

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const query = new URLSearchParams(useLocation().search)
  const initialMembership = query.get('membership-preference') || 'starter'
  const requestedBilling = query.get('billing')
  const [membership, setMembership] = useState(initialMembership)
  const [billingInterval, setBillingInterval] = useState(requestedBilling === 'month' ? 'month' : 'year')
  const { loading, error, isLoggedIn } = useSelector((state) => state.auth)
  const [step, setStep] = useState('register')
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [otpError, setOtpError] = useState('')
  const [submissionErrors, setSubmissionErrors] = useState({})
  const [promoCode, setPromoCode] = useState('')
  const [promoStatus, setPromoStatus] = useState(null)
  const [promoDetails, setPromoDetails] = useState(null)
  const promoDebounce = useRef(null)

  useEffect(() => {
    if (isLoggedIn) navigate('/dashboard')
    else validateAuthToken(dispatch).then((isValid) => { if (isValid) navigate('/dashboard') })
  }, [isLoggedIn, navigate, dispatch])

  const handlePromoChange = (event) => {
    const value = event.target.value.toUpperCase()
    setPromoCode(value); setPromoStatus(null); setPromoDetails(null)
    if (promoDebounce.current) clearTimeout(promoDebounce.current)
    if (!value.trim()) return
    setPromoStatus('checking')
    promoDebounce.current = setTimeout(async () => {
      try {
        const res = await api.post('subscription/validate-promo', { code: value.trim() })
        if (res.data?.status !== false && res.data?.data) { setPromoStatus('valid'); setPromoDetails(res.data.data) } else setPromoStatus('invalid')
      } catch { setPromoStatus('invalid') }
    }, 600)
  }

  const registrationFormik = useFormik({
    initialValues: { first_name: '', last_name: '', organization_name: '', email: '', password: '' },
    validationSchema: registrationSchema,
    onSubmit: (values) => {
      const user = { ...values, password: btoa(values.password), preferred_subscription_plan_id: planIds[membership] || 1, preferred_subscription_billing_interval: billingInterval }
      if (promoStatus === 'valid' && promoCode.trim()) user.promo_code = promoCode.trim()
      dispatch(registerUser(user)).unwrap().then(() => { setRegisteredEmail(values.email); setStep('verify') }).catch((err) => console.error('Failed to register: ', err))
    },
  })

  const otpFormik = useFormik({
    initialValues: { otp: '' }, validationSchema: otpSchema,
    onSubmit: (values) => { setOtpError(''); dispatch(verifyOtp({ email: registeredEmail, otp: values.otp })).unwrap().then(() => navigate('/dashboard')).catch((err) => setOtpError(err?.message || 'Invalid code. Please try again.')) },
  })

  const submitRegistration = async (event) => {
    event.preventDefault()
    const errors = await registrationFormik.validateForm()
    registrationFormik.setTouched(Object.keys(registrationFormik.values).reduce((all, key) => ({ ...all, [key]: true }), {}), false)
    setSubmissionErrors(errors)
    if (Object.keys(errors).length) { document.getElementById(Object.keys(errors)[0])?.focus(); return }
    registrationFormik.submitForm()
  }
  const errorFor = (name) => (registrationFormik.touched[name] || submissionErrors[name]) ? registrationFormik.errors[name] : ''

  if (step === 'verify') return (
    <div className='login-inner-form'><div className='details'>
      <div className='logo-2 mb-3'><a href='/'><img src={logo} alt='GrantMaestro' style={{ width: '200px' }} /></a></div>
      <p className='gm-register-step'>Step 2 of 3 · Secure email verification</p><h1 className='mb-2'>Verify your account</h1>
      <p className='text-muted mb-4' style={{ fontSize: '0.9rem' }}>We sent a 4-digit verification code to <strong>{registeredEmail}</strong>. Enter it below to activate your workspace.</p>
      <form onSubmit={otpFormik.handleSubmit} noValidate>
        <div className='form-group gm-auth-field'><label htmlFor='otp' className='form-label float-start'>Verification code <span className='gm-required-mark' aria-hidden='true'>*</span></label><input name='otp' type='text' inputMode='numeric' className={`form-control text-center${otpFormik.touched.otp && otpFormik.errors.otp ? ' is-invalid' : ''}`} id='otp' maxLength={4} value={otpFormik.values.otp} onChange={otpFormik.handleChange} onBlur={otpFormik.handleBlur} autoComplete='one-time-code' required aria-required='true' aria-invalid={Boolean(otpFormik.touched.otp && otpFormik.errors.otp)} aria-describedby={otpFormik.touched.otp && otpFormik.errors.otp ? 'otp-error' : undefined} /><FieldError id='otp-error' error={otpFormik.touched.otp && otpFormik.errors.otp} />{otpError && <p className='gm-field-error' role='alert'>{otpError}</p>}</div>
        <div className='form-group clearfix mt-3'><button type='submit' className='btn btn-lg btn-primary btn-theme w-100' disabled={loading}>{loading ? 'Verifying…' : 'Verify & Go to Dashboard'}</button></div>
      </form>
      <div className='gm-auth-links'><button className='btn btn-link p-0' onClick={() => setStep('register')}>Go back and try again</button><a href='/contact?topic=support'>Need help?</a></div>
    </div></div>
  )

  return (
    <div className='login-inner-form'><div className='details'>
      <div className='logo-2 mb-3'><a href='/'><img src={logo} alt='GrantMaestro' style={{ width: '200px' }} /></a></div>
      <p className='gm-register-step'>Step 1 of 3 · Create your council workspace</p><h1 className='mb-1'>Start your free trial</h1><p className='gm-register-intro'>Choose a plan now. Your trial starts after secure email verification; no credit card is required today.</p>
      <div className='form-group'><label htmlFor='membership_plan' className='form-label float-start'>Selected plan</label><select id='membership_plan' className='form-select' value={membership} onChange={(event) => setMembership(event.target.value)}>{Object.entries(planLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><small className='text-muted d-block mt-1'>You can review plan options and inclusions at any time.</small></div>
      <fieldset className='gm-billing-fieldset'><legend>Billing preference</legend><label className='form-check border rounded gm-billing-option'><input className='form-check-input' type='radio' name='billing_interval' value='year' checked={billingInterval === 'year'} onChange={(event) => setBillingInterval(event.target.value)} /><span className='form-check-label'><strong>Annual — two months free</strong><span className='d-block small text-muted'>${planPricing[membership]?.annual.toLocaleString('en-AU')}/year + GST. Pay for 10 months and receive 12 months of access.</span></span></label><label className='form-check border rounded gm-billing-option'><input className='form-check-input' type='radio' name='billing_interval' value='month' checked={billingInterval === 'month'} onChange={(event) => setBillingInterval(event.target.value)} /><span className='form-check-label'><strong>Monthly</strong><span className='d-block small text-muted'>${planPricing[membership]?.monthly.toLocaleString('en-AU')}/month + GST.</span></span></label></fieldset>
      <p className='text-muted mb-3' style={{ fontSize: '0.85rem' }}>14-day free trial · No credit card required</p>
      <form onSubmit={submitRegistration} noValidate>
        <FormErrorSummary errors={submissionErrors} />
        <div className='row gm-auth-name-row'><div className='col-6'><div className='form-group gm-auth-field'><label htmlFor='first_name' className='form-label float-start'>First name <span className='gm-required-mark' aria-hidden='true'>*</span></label><input name='first_name' type='text' className={`form-control${errorFor('first_name') ? ' is-invalid' : ''}`} id='first_name' autoComplete='given-name' value={registrationFormik.values.first_name} onChange={registrationFormik.handleChange} onBlur={registrationFormik.handleBlur} required aria-required='true' aria-invalid={Boolean(errorFor('first_name'))} aria-describedby={errorFor('first_name') ? 'first_name-error' : undefined} /><FieldError id='first_name-error' error={errorFor('first_name')} /></div></div><div className='col-6'><div className='form-group gm-auth-field'><label htmlFor='last_name' className='form-label float-start'>Last name <span className='gm-required-mark' aria-hidden='true'>*</span></label><input name='last_name' type='text' className={`form-control${errorFor('last_name') ? ' is-invalid' : ''}`} id='last_name' autoComplete='family-name' value={registrationFormik.values.last_name} onChange={registrationFormik.handleChange} onBlur={registrationFormik.handleBlur} required aria-required='true' aria-invalid={Boolean(errorFor('last_name'))} aria-describedby={errorFor('last_name') ? 'last_name-error' : undefined} /><FieldError id='last_name-error' error={errorFor('last_name')} /></div></div></div>
        <div className='form-group gm-auth-field'><label htmlFor='organization_name' className='form-label float-start'>Council / Organisation name <span className='gm-required-mark' aria-hidden='true'>*</span></label><input name='organization_name' type='text' className={`form-control${errorFor('organization_name') ? ' is-invalid' : ''}`} id='organization_name' autoComplete='organization' value={registrationFormik.values.organization_name} onChange={registrationFormik.handleChange} onBlur={registrationFormik.handleBlur} required aria-required='true' aria-invalid={Boolean(errorFor('organization_name'))} aria-describedby={errorFor('organization_name') ? 'organization_name-error' : undefined} /><FieldError id='organization_name-error' error={errorFor('organization_name')} /></div>
        <div className='form-group gm-auth-field'><label htmlFor='email' className='form-label float-start'>Work email address <span className='gm-required-mark' aria-hidden='true'>*</span></label><input name='email' type='email' className={`form-control${errorFor('email') ? ' is-invalid' : ''}`} id='email' autoComplete='email' value={registrationFormik.values.email} onChange={registrationFormik.handleChange} onBlur={registrationFormik.handleBlur} required aria-required='true' aria-invalid={Boolean(errorFor('email'))} aria-describedby={errorFor('email') ? 'registration-email-error' : undefined} /><FieldError id='registration-email-error' error={errorFor('email')} /></div>
        <PasswordField id='password' name='password' label='Password' value={registrationFormik.values.password} onChange={registrationFormik.handleChange} onBlur={registrationFormik.handleBlur} error={errorFor('password')} autoComplete='new-password' helperText={PASSWORD_POLICY} />
        <div className='form-group'><label htmlFor='promo_code' className='form-label float-start'>Promo code <span className='text-muted fw-normal'>(optional)</span></label><div className='input-group'><input name='promo_code' type='text' className={`form-control text-uppercase font-monospace${promoStatus === 'valid' ? ' is-valid' : promoStatus === 'invalid' ? ' is-invalid' : ''}`} id='promo_code' placeholder='e.g. EARLYBIRD25' value={promoCode} onChange={handlePromoChange} autoComplete='off' maxLength={50} />{promoStatus === 'checking' && <span className='input-group-text'><span className='spinner-border spinner-border-sm text-primary' /></span>}{promoStatus === 'valid' && <span className='input-group-text text-success'><i className='fa fa-check-circle' /></span>}{promoStatus === 'invalid' && <span className='input-group-text text-danger'><i className='fa fa-times-circle' /></span>}</div>{promoStatus === 'valid' && promoDetails && <div className='valid-feedback d-block text-success small mt-1'><i className='fa fa-tag me-1' /><strong>{promoDetails.code}</strong> applied — {promoDetails.discount_type === 'percentage' ? `${promoDetails.discount_value}% off` : `$${promoDetails.discount_value} off`} for {promoDetails.duration_months} month{promoDetails.duration_months !== 1 ? 's' : ''}.</div>}{promoStatus === 'invalid' && <div className='invalid-feedback d-block small mt-1'>This promo code is not valid or has expired.</div>}</div>
        <div className='form-group clearfix mt-3'><button type='submit' className='btn btn-lg btn-primary btn-theme w-100' disabled={loading}>{loading ? 'Creating account…' : 'Create account & continue'}</button></div>
      </form>
      {error && <p className='text-danger mt-2' role='alert'>{error.message || 'Registration failed. Please try again.'}</p>}
      <p className='text-muted mt-3' style={{ fontSize: '0.82rem' }}>Already have an account? <a href='/login'>Log in</a></p>
      <p className='text-muted' style={{ fontSize: '0.78rem' }}><i className='fa fa-shield' aria-hidden='true'></i> By creating an account, you agree to the <a href='/terms-of-service'>Terms of Service</a> and acknowledge the <a href='/privacy-policy'>Privacy Policy</a>. We use email verification before activating your workspace.</p>
    </div></div>
  )
}
export default Register
