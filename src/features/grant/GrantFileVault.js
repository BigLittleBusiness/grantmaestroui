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
            <form onSubmit={formik.handleSubmit} className='mt-3 px-2'>
              <div className='mb-3'>
                <label className='form-label'>Select file to upload</label>
                <input
                  type='file'
                  name='file'
                  className='form-control'
                  onChange={(event) => {
                    formik.setFieldValue('file', event.currentTarget.files[0])
                  }}
                />
                {formik.errors.file && (
                  <div className='text-danger small mt-1'>{formik.errors.file}</div>
                )}
              </div>
              <div className='d-flex gap-2'>
                <button type='submit' className='btn btn-primary btn-sm'>Upload</button>
                <button
                  type='button'
                  className='btn btn-outline-secondary btn-sm'
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : files.length === 0 ? (
            <div className='gm-empty-state' style={{ padding: '24px 0' }}>
              <div className='gm-empty-state__icon' style={{ fontSize: 32 }}>📁</div>
              <p className='gm-empty-state__body mb-0'>No files uploaded yet</p>
            </div>
          ) : (
            <div className='mt-2 px-2'>
              {files.map((file, index) => {
                const name = file?.file?.name || file?.file_path || 'File'
                const ext  = name.split('.').pop().toLowerCase()
                const iconClass =
                  ext === 'pdf'                     ? 'gm-file-icon--pdf'   :
                  ['xls','xlsx','csv'].includes(ext) ? 'gm-file-icon--excel' :
                  ['doc','docx'].includes(ext)       ? 'gm-file-icon--word'  :
                  ['png','jpg','jpeg','gif'].includes(ext) ? 'gm-file-icon--image' :
                  'gm-file-icon--other'
                const iconChar =
                  ext === 'pdf'                     ? '📄' :
                  ['xls','xlsx','csv'].includes(ext) ? '📊' :
                  ['doc','docx'].includes(ext)       ? '📝' :
                  ['png','jpg','jpeg','gif'].includes(ext) ? '🖼️' :
                  '📎'
                return (
                  <div key={index} className='gm-file-item'>
                    <span className={`gm-file-icon ${iconClass}`}>{iconChar}</span>
                    <span className='flex-grow-1 text-truncate' title={name}>{name}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GrantFileVault
