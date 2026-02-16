import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { resetPassword } from './authSlice'
import logo from 'assets/img/logos/logo.png'


const validationSchema = yup.object({
  password: yup.string().required('Password is required'),
  confirm_password: yup.string().oneOf([yup.ref("password"), null], "Confirm Password must match with password").required('Confirm password is required'),
})

const ResetPassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)
  const search = useLocation().search;
  const identity=new URLSearchParams(search).get("uid");
  const salt=new URLSearchParams(search).get("code");

  const formik = useFormik({
      initialValues: {
        password: '',
        confirm_password: ''
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        const user = {
          password: btoa(values.password),
          identity,
          salt
        }
        dispatch(resetPassword(user))
          .unwrap()
          .then(() => {
            navigate('/login')
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

            <h1 className='mb-3'>Reset your login password</h1>

            <form onSubmit={formik.handleSubmit} noValidate>
                
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
              <div className='form-group clearfix'>
                <label htmlFor='password' className='form-label float-start'>
                  Confirm Password
                </label>
                <input
                  name='confirm_password'
                  type='password'
                  className='form-control'
                  autoComplete='off'
                  id='confirm_password'
                  placeholder='Confirm Password'
                  aria-label='confirm_password'
                  value={formik.values.confirm_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.confirm_password && formik.errors.confirm_password ? (
                  <div className='text-danger'>{formik.errors.confirm_password}</div>
                ) : null}
              </div>
              <div className='form-group clearfix'>
                  <button
                  type='submit'
                  className='btn btn-lg btn-primary btn-theme'
                  disabled={loading}
                  >
                  <span>Reset</span>
                  </button>
              </div>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p className='text-danger'>{error.message}</p>}
        </div>
    </div>
  )
}

export default ResetPassword