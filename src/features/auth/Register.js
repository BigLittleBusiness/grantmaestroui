import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { registerUser, verifyOtp } from './authSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import { validateAuthToken } from '../../utils/auth'
import api from '../../api'
import logo from 'assets/img/logos/logo.png'

const registrationSchema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  organization_name: yup.string().required('Organisation name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    )
    .required('Password is required'),
})

const otpSchema = yup.object({
  otp: yup
    .string()
    .length(4, 'Verification code must be 4 digits')
    .matches(/^\d{4}$/, 'Verification code must be 4 digits')
    .required('Verification code is required'),
})

const planLabels = {
  starter: 'Starter — $89/pm (annual) · 1 Admin + 3 Team Members',
  pro: 'Pro — $249/pm (annual) · 2 Admins + 10 Team Members',
  enterprise: 'Enterprise — $562/pm (annual) · 5 Admins + 20 Team Members',
}

const planIds = {
  starter: 1,
  pro: 2,
  enterprise: 3,
}

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const query = new URLSearchParams(useLocation().search)
  const membership = query.get('membership-preference') || 'starter'
  const { loading, error, isLoggedIn } = useSelector((state) => state.auth)
  const [step, setStep] = useState('register') // 'register' | 'verify'
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [otpError, setOtpError] = useState('')

  // Promo code state
  const [promoCode, setPromoCode] = useState('')
  const [promoStatus, setPromoStatus] = useState(null) // null | 'checking' | 'valid' | 'invalid'
  const [promoDetails, setPromoDetails] = useState(null)
  const promoDebounce = useRef(null)

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard')
    } else {
      validateAuthToken(dispatch).then((isValid) => {
        if (isValid) navigate('/dashboard')
      })
    }
  }, [isLoggedIn, navigate, dispatch])

  // Live promo code validation with debounce
  const handlePromoChange = (e) => {
    const val = e.target.value.toUpperCase()
    setPromoCode(val)
    setPromoStatus(null)
    setPromoDetails(null)
    if (promoDebounce.current) clearTimeout(promoDebounce.current)
    if (!val.trim()) return
    setPromoStatus('checking')
    promoDebounce.current = setTimeout(async () => {
      try {
        const res = await api.post('subscription/validate-promo', { code: val.trim() })
        if (res.data?.status !== false && res.data?.data) {
          setPromoStatus('valid')
          setPromoDetails(res.data.data)
        } else {
          setPromoStatus('invalid')
        }
      } catch {
        setPromoStatus('invalid')
      }
    }, 600)
  }

  const registrationFormik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      organization_name: '',
      email: '',
      password: '',
    },
    validationSchema: registrationSchema,
    onSubmit: (values) => {
      const user = {
        first_name: values.first_name,
        last_name: values.last_name,
        organization_name: values.organization_name,
        email: values.email,
        password: btoa(values.password),
        preferred_subscription_plan_id: planIds[membership] || 1,
      }
      if (promoStatus === 'valid' && promoCode.trim()) {
        user.promo_code = promoCode.trim()
      }
      dispatch(registerUser(user))
        .unwrap()
        .then(() => {
          setRegisteredEmail(values.email)
          setStep('verify')
        })
        .catch((err) => {
          console.error('Failed to register: ', err)
        })
    },
  })

  const otpFormik = useFormik({
    initialValues: { otp: '' },
    validationSchema: otpSchema,
    onSubmit: (values) => {
      setOtpError('')
      dispatch(verifyOtp({ email: registeredEmail, otp: values.otp }))
        .unwrap()
        .then(() => {
          navigate('/dashboard')
        })
        .catch((err) => {
          setOtpError(err?.message || 'Invalid code. Please try again.')
        })
    },
  })

  if (step === 'verify') {
    return (
      <div className='login-inner-form'>
        <div className='details'>
          <div className='logo-2 mb-3'>
            <a href='/'>
              <img src={logo} alt='Grant Maestro' style={{ width: '200px' }} />
            </a>
          </div>
          <h1 className='mb-2'>Verify Your Account</h1>
          <p className='text-muted mb-4' style={{ fontSize: '0.9rem' }}>
            We have sent a 4-digit verification code to{' '}
            <strong>{registeredEmail}</strong>. Please enter it below to
            activate your account and access your dashboard.
          </p>
          <form onSubmit={otpFormik.handleSubmit} noValidate>
            <div className='form-group'>
              <label htmlFor='otp' className='form-label float-start'>
                Verification Code
              </label>
              <input
                name='otp'
                type='text'
                className='form-control text-center'
                id='otp'
                maxLength={4}
                placeholder='0000'
                style={{ fontSize: '1.8rem', letterSpacing: '0.5em', fontWeight: 700 }}
                value={otpFormik.values.otp}
                onChange={otpFormik.handleChange}
                onBlur={otpFormik.handleBlur}
                autoComplete='one-time-code'
              />
              {otpFormik.touched.otp && otpFormik.errors.otp ? (
                <div className='text-danger mt-1'>{otpFormik.errors.otp}</div>
              ) : null}
              {otpError && (
                <div className='text-danger mt-1'>{otpError}</div>
              )}
            </div>
            <div className='form-group clearfix mt-3'>
              <button
                type='submit'
                className='btn btn-lg btn-primary btn-theme w-100'
                disabled={loading}
              >
                {loading ? 'Verifying…' : 'Verify & Go to Dashboard'}
              </button>
            </div>
          </form>
          <p className='text-muted mt-3' style={{ fontSize: '0.82rem' }}>
            Did not receive the code? Check your spam folder or{' '}
            <button
              className='btn btn-link p-0'
              style={{ fontSize: '0.82rem' }}
              onClick={() => setStep('register')}
            >
              go back and try again
            </button>
            .
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='login-inner-form'>
      <div className='details'>
        <div className='logo-2 mb-3'>
          <a href='/'>
            <img src={logo} alt='Grant Maestro' style={{ width: '200px' }} />
          </a>
        </div>
        <h1 className='mb-1'>Start Your Free Trial</h1>
        {membership && planLabels[membership] && (
          <div
            className='alert alert-info py-2 px-3 mb-3'
            style={{ fontSize: '0.82rem' }}
          >
            <strong>Selected plan:</strong> {planLabels[membership]}
          </div>
        )}
        <p className='text-muted mb-3' style={{ fontSize: '0.85rem' }}>
          14-day free trial · No credit card required
        </p>
        <form onSubmit={registrationFormik.handleSubmit} noValidate>
          <div className='row'>
            <div className='col-6'>
              <div className='form-group'>
                <label htmlFor='first_name' className='form-label float-start'>
                  First Name
                </label>
                <input
                  name='first_name'
                  type='text'
                  className='form-control'
                  id='first_name'
                  placeholder='Jane'
                  value={registrationFormik.values.first_name}
                  onChange={registrationFormik.handleChange}
                  onBlur={registrationFormik.handleBlur}
                />
                {registrationFormik.touched.first_name && registrationFormik.errors.first_name ? (
                  <div className='text-danger small'>{registrationFormik.errors.first_name}</div>
                ) : null}
              </div>
            </div>
            <div className='col-6'>
              <div className='form-group'>
                <label htmlFor='last_name' className='form-label float-start'>
                  Last Name
                </label>
                <input
                  name='last_name'
                  type='text'
                  className='form-control'
                  id='last_name'
                  placeholder='Smith'
                  value={registrationFormik.values.last_name}
                  onChange={registrationFormik.handleChange}
                  onBlur={registrationFormik.handleBlur}
                />
                {registrationFormik.touched.last_name && registrationFormik.errors.last_name ? (
                  <div className='text-danger small'>{registrationFormik.errors.last_name}</div>
                ) : null}
              </div>
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='organization_name' className='form-label float-start'>
              Council / Organisation Name
            </label>
            <input
              name='organization_name'
              type='text'
              className='form-control'
              id='organization_name'
              placeholder='e.g. City of Melbourne'
              value={registrationFormik.values.organization_name}
              onChange={registrationFormik.handleChange}
              onBlur={registrationFormik.handleBlur}
            />
            {registrationFormik.touched.organization_name && registrationFormik.errors.organization_name ? (
              <div className='text-danger small'>{registrationFormik.errors.organization_name}</div>
            ) : null}
          </div>
          <div className='form-group'>
            <label htmlFor='email' className='form-label float-start'>
              Work Email Address
            </label>
            <input
              name='email'
              type='email'
              className='form-control'
              id='email'
              autoComplete='off'
              placeholder='jane.smith@council.gov.au'
              value={registrationFormik.values.email}
              onChange={registrationFormik.handleChange}
              onBlur={registrationFormik.handleBlur}
            />
            {registrationFormik.touched.email && registrationFormik.errors.email ? (
              <div className='text-danger small'>{registrationFormik.errors.email}</div>
            ) : null}
          </div>
          <div className='form-group'>
            <label htmlFor='password' className='form-label float-start'>
              Password
            </label>
            <input
              name='password'
              type='password'
              className='form-control'
              autoComplete='off'
              id='password'
              placeholder='Min 8 chars, 1 uppercase, 1 special character'
              value={registrationFormik.values.password}
              onChange={registrationFormik.handleChange}
              onBlur={registrationFormik.handleBlur}
            />
            {registrationFormik.touched.password && registrationFormik.errors.password ? (
              <div className='text-danger small'>{registrationFormik.errors.password}</div>
            ) : null}
          </div>

          {/* Promo Code Field */}
          <div className='form-group'>
            <label htmlFor='promo_code' className='form-label float-start'>
              Promo Code <span className='text-muted fw-normal'>(optional)</span>
            </label>
            <div className='input-group'>
              <input
                name='promo_code'
                type='text'
                className={`form-control text-uppercase font-monospace${
                  promoStatus === 'valid' ? ' is-valid' : promoStatus === 'invalid' ? ' is-invalid' : ''
                }`}
                id='promo_code'
                placeholder='e.g. EARLYBIRD25'
                value={promoCode}
                onChange={handlePromoChange}
                autoComplete='off'
                maxLength={50}
              />
              {promoStatus === 'checking' && (
                <span className='input-group-text'>
                  <span className='spinner-border spinner-border-sm text-primary' />
                </span>
              )}
              {promoStatus === 'valid' && (
                <span className='input-group-text text-success'>
                  <i className='fa fa-check-circle' />
                </span>
              )}
              {promoStatus === 'invalid' && (
                <span className='input-group-text text-danger'>
                  <i className='fa fa-times-circle' />
                </span>
              )}
            </div>
            {promoStatus === 'valid' && promoDetails && (
              <div className='valid-feedback d-block text-success small mt-1'>
                <i className='fa fa-tag me-1' />
                <strong>{promoDetails.code}</strong> applied —{' '}
                {promoDetails.discount_type === 'percentage'
                  ? `${promoDetails.discount_value}% off`
                  : `$${promoDetails.discount_value} off`}{' '}
                for {promoDetails.duration_months} month{promoDetails.duration_months !== 1 ? 's' : ''}.
              </div>
            )}
            {promoStatus === 'invalid' && (
              <div className='invalid-feedback d-block small mt-1'>
                This promo code is not valid or has expired.
              </div>
            )}
          </div>

          <div className='form-group clearfix mt-3'>
            <button
              type='submit'
              className='btn btn-lg btn-primary btn-theme w-100'
              disabled={loading}
            >
              {loading ? 'Creating Account…' : 'Create Account & Continue'}
            </button>
          </div>
        </form>
        {error && (
          <p className='text-danger mt-2'>{error.message || 'Registration failed. Please try again.'}</p>
        )}
        <p className='text-muted mt-3' style={{ fontSize: '0.82rem' }}>
          Already have an account?{' '}
          <a href='/login'>Log in here</a>
        </p>
        <p className='text-muted' style={{ fontSize: '0.78rem' }}>
          <i className='fa fa-lock'></i> Your data is encrypted and stored
          securely on Australian servers. We never share your information.
        </p>
      </div>
    </div>
  )
}

export default Register
