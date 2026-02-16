import React from 'react'
import { useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'

const validationSchema = yup.object({
  outcome: yup.string().required('Outcome is required'),
  outcome_date: yup.date().required('Outcome date is required'),
  agreement_signed: yup.string().required('Agreement signed is required'),
  learning: yup.string().required('Learnings is required'),
  outcome_note: yup.string().optional(),
})

const Outcome = ({
  onSubmit,
  viewOnly,
  showTitle = true,
  showSaveButton = false,
}) => {
  const grant = useSelector((state) => state.grant.grant)

  const formik = useFormik({
    initialValues: {
      outcome: grant ? grant?.outcome : '',
      outcome_date: grant ? grant?.outcome_date : '',
      agreement_signed: grant ? grant?.agreement_signed : '',
      learning: grant ? grant?.learning : '',
      outcome_note: grant ? grant?.latest_outcome_note : '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(grant.organization_grant_id, values)
    },
    enableReinitialize: true,
  })

  if (viewOnly) {
    // Render as static information when viewOnly is true
    return (
      <div className='tab-pane fade show active' id='outcome'>
        <div className='card-body'>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Outcome:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.outcome}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Outcome Date:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.outcome_date}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Agreement Signed:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.agreement_signed}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Learnings:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.learning}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Note:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.latest_outcome_note}</span>
          </div>
        </div>
      </div>
    )
  }

  // Render as a form when viewOnly is false
  return (
    <div className='tab-pane fade show active' id='outcome'>
      {showTitle && <h5 className='mb-3'>Submission Outcome</h5>}
      <div className='card-body'>
        <form onSubmit={formik.handleSubmit}>
          <div className='form-group mb-3'>
            <label htmlFor='outcome'>Outcome:</label>
            <select
              id='outcome'
              name='outcome'
              className='form-select'
              onChange={formik.handleChange}
              value={formik.values.outcome}
            >
              <option value=''>Select Outcome</option>
              <option value='Won'>Won</option>
              <option value='Lost'>Lost</option>
              <option value='Declined'>Declined</option>
            </select>
            {formik.errors.outcome && (
              <div className='text-danger'>{formik.errors.outcome}</div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='outcome_date'>Outcome Date:</label>
            <input
              type='date'
              id='outcome_date'
              name='outcome_date'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.outcome_date}
            />
            {formik.errors.outcome_date && (
              <div className='text-danger'>{formik.errors.outcome_date}</div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='agreement_signed'>Agreement Signed:</label>
            <select
              id='agreement_signed'
              name='agreement_signed'
              className='form-select'
              onChange={formik.handleChange}
              value={formik.values.agreement_signed}
            >
              <option value=''>Please Select</option>
              <option value='Yes'>Yes</option>
              <option value='No'>No</option>
            </select>
            {formik.errors.agreement_signed && (
              <div className='text-danger'>
                {formik.errors.agreement_signed}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='learning'>Learnings:</label>
            <textarea
              id='learning'
              name='learning'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.learning}
            />
            {formik.errors.learning && (
              <div className='text-danger'>{formik.errors.learning}</div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='outcome_note'>Note:</label>
            <textarea
              id='outcome_note'
              name='outcome_note'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.outcome_note}
            />
            {formik.errors.outcome_note && (
              <div className='text-danger'>{formik.errors.outcome_note}</div>
            )}
          </div>
          {!viewOnly && (
            <button type='submit' className='btn btn-primary mb-2'>
              {showSaveButton ? 'Save' : 'Submit'}
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default Outcome
