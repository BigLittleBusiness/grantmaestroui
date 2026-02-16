import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { addFile } from './grantSlice'

const validationSchema = yup.object({
  file: yup.mixed().required('File is required'),
})

const GrantFileVault = () => {
  const [showForm, setShowForm] = useState(false)
  const dispatch = useDispatch()
  const files = useSelector((state) => state.grant.files)

  const formik = useFormik({
    initialValues: {
      file: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(addFile(values))
      setShowForm(false)
    },
  })

  return (
    <div className='col-xl-6 col-md-6'>
      <div className='card super-admin-dash-card p-2 pt-3 mb-0'>
        <div className='card-header'>
          <div className='row align-center'>
            <div className='col d-flex justify-content-between'>
              <h5 className='card-title'>File Vault</h5>
              <button
                className='btn btn-primary'
                onClick={() => setShowForm(true)}
              >
                Add File
              </button>
            </div>
          </div>
        </div>
        <div className='card-body file-vault p-0'>
          {showForm ? (
            <form onSubmit={formik.handleSubmit} className='mt-3'>
              <div className='form-group'>
                <label>File:</label>
                <input
                  type='file'
                  name='file'
                  className='form-control'
                  onChange={(event) => {
                    formik.setFieldValue('file', event.currentTarget.files[0])
                  }}
                />
                {formik.errors.file && (
                  <div className='text-danger'>{formik.errors.file}</div>
                )}
              </div>
              <button type='submit' className='btn btn-primary mt-3'>
                Save
              </button>
            </form>
          ) : (
            <ul className='mt-3'>
              {files.map((file, index) => (
                <li key={index}>{file.file.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default GrantFileVault
