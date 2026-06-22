import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { updatePassword } from './authSlice'


const validationSchema = yup.object({
  old_password: yup.string().required('Old password is required'),
  confirm_password: yup.string().oneOf([yup.ref("new_password"), null], "Confirm Password must match with new password").required('Confirm password is required'),
  new_password: yup.string().required('New password is required')
})

const ChangePassword = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error } = useSelector((state) => state.auth)
    const formik = useFormik({
        initialValues: {
          old_password: '',
          new_password: '',
          confirm_password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const passObj = {
                old_password: btoa(values.old_password),
                new_password: btoa(values.new_password) //values.password,
            }
            dispatch(updatePassword(passObj))
            .unwrap()
            .then(() => {
                navigate('/login')
            })
            .catch((err) => {
                console.error('Failed to login: ', err)
            })
        },
        enableReinitialize: true,
    })
    return (
        <div className='content container-fluid'>
        <div className='page-header'>
            <div className='content-page-header'>
            <h5>Change Password</h5>
            </div>
        </div>
        <div className='content container-fluid pb-0 p-0'>
            <form onSubmit={formik.handleSubmit}>
            <div className='card shadow-sm'>
                <div className='card-header'>
                <h5></h5>
                </div>
                <div className='card-body'>
                <div className='mb-4 row'>
                    <div className='mb-3 col-lg-6'>
                        <label className='form-label'>Old Password:</label>
                        <input
                            name='old_password'
                            type='password'
                            className='form-control'
                            id='old_password'
                            autoComplete='off'
                            placeholder='Old Password'
                            aria-label='Old Password'
                            value={formik.values.old_password}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.old_password && (
                            <div className='text-danger'>{formik.errors.old_password}</div>
                        )}
                    </div>
                    <div className='mb-3 col-lg-6'></div>
                    <div className='mb-3 col-lg-6'>
                    <label className='form-label'>New Password:</label>
                    <input
                        name='new_password'
                        type='password'
                        className='form-control'
                        id='new_password'
                        autoComplete='off'
                        placeholder='New Password'
                        aria-label='New Password'
                        value={formik.values.new_password}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.new_password && (
                        <div className='text-danger'>{formik.errors.new_password}</div>
                      )}
                    </div>
                    <div className='mb-3 col-lg-6'>
                        <label className='form-label'>Confirm Password:</label>
                        <input
                            name='confirm_password'
                            type='password'
                            className='form-control'
                            id='confirm_password'
                            autoComplete='off'
                            placeholder='Confirm Password'
                            aria-label='Confirm Password'
                            value={formik.values.confirm_password}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.confirm_password && (
                            <div className='text-danger'>{formik.errors.confirm_password}</div>
                          )}
                    </div>
                    
                    
                </div>
                </div>
            </div>
            <button className='btn btn-primary' type='submit' disabled={loading}>
                {loading ? 'Saving...' : 'Change Password'}
            </button>
            {error && <p className='text-danger mt-2'>{error}</p>}
            </form>
        </div>
        </div>
    )
}

export default ChangePassword