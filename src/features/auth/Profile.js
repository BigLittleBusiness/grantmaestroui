import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { updateProfile } from './authSlice'

const validationSchema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  address: yup.string().optional(),
  phone_no: yup.string().optional(),
  organization_website: yup.string().url('Invalid URL').required('Website is required'),
  organization_name: yup.string().optional(),
  abn_no: yup.string().required(),
  profile_image: yup.string().optional(),
})

export default function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useSelector((state) => state.auth)
  const [profileImage, setProfileImage] = useState(null)
  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      address: user?.address || '',
      phone_no: user?.phone_no || '',
      organization_website: user?.organization_website || '',
      organization_name: user?.organization_name || '',
      abn_no: user?.abn_no || '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = new FormData()
      formData.append('first_name', values.first_name)
      formData.append('last_name', values.last_name)
      formData.append('email', values.email)
      formData.append('address', values.address)
      formData.append('phone_no', values.phone_no)
      formData.append('organization_website', values.organization_website)
      formData.append('organization_name', values.organization_name)
      formData.append('abn_no', values.abn_no)
      if (profileImage) {
        formData.append('profile_image', profileImage)
      }
      dispatch(updateProfile(formData)).then((action) => {
        if (action.type === 'auth/updateProfile/fulfilled') {
          navigate('/dashboard')
        }
      })
    },
    enableReinitialize: true,
  })

  return (
    <div className='content container-fluid'>
      <div className='page-header'>
        <div className='content-page-header'>
          <h5>Profile</h5>
        </div>
      </div>
      <div className='content container-fluid pb-0 p-0'>
        <form onSubmit={formik.handleSubmit}>
          <div className='card shadow-sm'>
            <div className='card-header'>
              <h5>Personal Information</h5>
            </div>
            <div className='card-body'>
              <div className='row'>
                <div className='mb-3 col-lg-6'>
                  <label className='form-label'>Email:</label>
                  <input
                    name='email'
                    type='text'
                    className='form-control'
                    id='email'
                    autoComplete='off'
                    placeholder='Email'
                    aria-label='Email'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.email && (
                    <div className='text-danger'>{formik.errors.email}</div>
                  )}
                </div>
                <div className='mb-3 col-lg-6'></div>
                <div className='mb-3 col-lg-6'>
                  <label className='form-label'>First Name:<span className='required'>*</span></label>
                  <input
                    name='first_name'
                    type='text'
                    className='form-control'
                    id='first_name'
                    autoComplete='off'
                    placeholder='First Name'
                    aria-label='First Name'
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.first_name && (
                    <div className='text-danger'>
                      {formik.errors.first_name}
                    </div>
                  )}
                </div>
                <div className='mb-3 col-lg-6'>
                  <label className='form-label'>Last Name:<span className='required'>*</span></label>
                  <input
                    name='last_name'
                    type='text'
                    className='form-control'
                    id='last_name'
                    autoComplete='off'
                    placeholder='Last Name'
                    aria-label='Last Name'
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.last_name && (
                    <div className='text-danger'>{formik.errors.last_name}</div>
                  )}
                </div>
                <div className='mb-3 col-lg-6'>
                  <label className='form-label'>Profile Image:</label>
                  <input
                    name='profile_image'
                    type='file'
                    className='form-control'
                    id='profile_image'
                    aria-label='Profile Image'
                    onChange={(e) => setProfileImage(e.target.files[0])}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='card shadow-sm'>
            <div className='card-header'>
              <h5>Organisation</h5>
            </div>
            <div className='card-body'>
              <div className='mb-4 row'>
                <div className='mb-3 col-lg-6'>
                  <label className='form-label'>Address:</label>
                  <input
                    name='address'
                    type='text'
                    className='form-control'
                    id='address'
                    autoComplete='off'
                    placeholder='Address'
                    aria-label='Address'
                    value={formik.values.address}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className='mb-3 col-lg-6'>
                  <label className='form-label'>Phone:</label>
                  <input
                    name='phone_no'
                    type='text'
                    className='form-control'
                    id='phone_no'
                    autoComplete='off'
                    placeholder='Phone'
                    aria-label='Phone'
                    value={formik.values.phone_no}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className='mb-3 col-lg-6'>
                  <label className='form-label'>Website:<span className='required'>*</span></label>
                  <input
                    name='organization_website'
                    type='text'
                    className='form-control'
                    id='organization_website'
                    autoComplete='off'
                    placeholder='Website'
                    aria-label='Website'
                    value={formik.values.organization_website}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.organization_website && (
                    <div className='text-danger'>{formik.errors.organization_website}</div>
                  )}
                </div>
                <div className='mb-3 col-lg-6'>
                  <label className='form-label'>Business Name:<span className='required'>*</span></label>
                  <input
                    name='organization_name'
                    type='text'
                    className='form-control'
                    id='organization_name'
                    autoComplete='off'
                    placeholder='Business Name'
                    aria-label='Business Name'
                    value={formik.values.organization_name}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className='mb-3 col-lg-6'>
                  <label className='form-label'>ABN/Business Number:<span className='required'>*</span></label>
                  <input
                    name='abn_no'
                    type='text'
                    className='form-control'
                    id='abn_no'
                    autoComplete='off'
                    placeholder='ABN/Business Number'
                    aria-label='ABN/Business Number'
                    value={formik.values.abn_no}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <button className='btn btn-primary' type='submit' disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          {error && <p className='text-danger mt-2'>{error}</p>}
        </form>
      </div>
      {/* <div className='content container-fluid pb-0 p-0 mt-4'>
        <form onSubmit={formik.handleSubmit}>
          <div className='card shadow-sm'>
            <div className='card-header'>
              <h5>Update Password</h5>
            </div>
            <div className='card-body'>
              <div className='row'>
                <div className='mb-3 col-lg-6'>
                  <label className='form-label'>New Password:</label>
                  <input
                    name='password'
                    type='password'
                    className='form-control'
                    id='password'
                    autoComplete='off'
                    placeholder='password'
                    aria-label='password'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
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
                </div>
              </div>
            </div>
          </div>
          <button className='btn btn-primary' type='submit' disabled={loading}>
            {loading ? 'Updating...' : 'Change Password'}
          </button>
          {error && <p className='text-danger mt-2'>{error}</p>}
        </form>
      </div> */}
    </div>
  )
}
