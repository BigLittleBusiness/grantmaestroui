import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { loginUser } from './authSlice'
import { Link, useNavigate } from 'react-router-dom'
import { validateAuthToken } from '../../utils/auth'
import logo from 'assets/img/logos/logo.png'

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
})

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isLoggedIn } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard')
    } else {
      validateAuthToken(dispatch).then((isValid) => {
        if (isValid) {
          navigate('/dashboard')
        }
      })
    }
  }, [isLoggedIn, navigate, dispatch])

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const user = {
        email: values.email,
        password: btoa(values.password) //values.password,
      }
      dispatch(loginUser(user))
        .unwrap()
        .then(() => {
          navigate('/dashboard')
        })
        .catch((err) => {
          console.error('Failed to login: ', err)
        })
    },
  })

  return (
    <div className='login-inner-form'>
      <div className='details'>
        <div className='logo-2 mb-3'>
          <a href='index.html'>
            <img src={logo} alt='logo' style={{ width: '200px' }} />
          </a>
        </div>

        <h1 className='mb-3'>Sign Into Your Account</h1>

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className='form-group'>
            <label htmlFor='email' className='form-label float-start'>
              Email address
            </label>
            <input
              name='email'
              type='email'
              className='form-control'
              id='email'
              placeholder='Email Address'
              aria-label='Email Address'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className='text-danger'>{formik.errors.email}</div>
            ) : null}
          </div>
          <div className='form-group clearfix'>
            <label htmlFor='password' className='form-label float-start'>
              Password
            </label>
            <input
              name='password'
              type='password'
              className='form-control'
              autoComplete='off'
              id='password'
              placeholder='Password'
              aria-label='Password'
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className='text-danger'>{formik.errors.password}</div>
            ) : null}
          </div>
          <div className='checkbox form-group clearfix'>
            <div className='form-check float-start'>
              <input
                className='form-check-input'
                type='checkbox'
                id='rememberme'
              />
              <label className='form-check-label' htmlFor='rememberme'>
                Remember me
              </label>
            </div>
            <Link to='/forgot-password' className='float-end forgot-password'>
              Forgot your password?
            </Link>
          </div>
          <div className='form-group clearfix'>
            <button
              type='submit'
              className='btn btn-lg btn-primary btn-theme'
              disabled={loading}
            >
              <span>Login</span>
            </button>
          </div>
        </form>
        {loading && <p>Loading...</p>}
        {error && <p className='text-danger'>{error.message}</p>}
      </div>
    </div>
  )
}

export default Login
