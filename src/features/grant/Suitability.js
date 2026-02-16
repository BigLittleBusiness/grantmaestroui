import React from 'react'
import { useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'

const validationSchema = yup.object({
  decision_date: yup.date().required('Decision date is required'),
  determination: yup.string().required('Determination is required'),
  rationale_of_importance: yup.string().required('Rationale is required'),
  assessment_outcome_date: yup
    .date()
    .required('Assessment outcome date is required'),
  sutability_note: yup.string().optional(),
})

const Suitability = ({
  onSubmit,
  viewOnly,
  showTitle = true,
  showSaveButton = false,
}) => {
  const grant = useSelector((state) => state.grant.grant)

  const formik = useFormik({
    initialValues: {
      decision_date: grant?.decision_date || '',
      determination: grant?.determination || '',
      rationale_of_importance: grant?.rationale_of_importance || '',
      assessment_outcome_date: grant?.assessment_outcome_date || '',
      sutability_note: grant?.latest_suitability_note || '',
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
      <div className='tab-pane fade show active' id='suitability'>
        <div className='card-body'>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Closing Date:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.closing_date}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Internal Decision Date:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.decision_date}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Determination:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.determination}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Rationale:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.rationale_of_importance}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Assessment Outcome Date:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.assessment_outcome_date}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Note:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.latest_suitability_note}</span>
          </div>
        </div>
      </div>
    )
  }

  // Render as a form when viewOnly is false
  return (
    <div className='tab-pane fade show active' id='suitability'>
      {showTitle && <h5 className='mb-3'>Suitability of Grants</h5>}
      <div className='card-body'>
        <form onSubmit={formik.handleSubmit}>
          <div className='form-group mb-3'>
            <label htmlFor='decision_date'>Internal Decision Date:</label>
            <input
              type='date'
              id='decision_date'
              name='decision_date'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.decision_date}
              aria-required='true'
              aria-describedby='decision_date_error'
            />
            {formik.errors.decision_date && (
              <div
                id='decision_date_error'
                className='text-danger'
                role='alert'
              >
                {formik.errors.decision_date}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='determination'>Determination:</label>
            <select
              id='determination'
              name='determination'
              className='form-select'
              onChange={formik.handleChange}
              value={formik.values.determination}
              aria-required='true'
              aria-describedby='determination_error'
            >
              <option value=''>Select an option</option>
              <option value='Proceed'>Proceed</option>
              <option value='Not Proceed'>Not Proceed</option>
            </select>
            {formik.errors.determination && (
              <div
                id='determination_error'
                className='text-danger'
                role='alert'
              >
                {formik.errors.determination}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='rationale_of_importance'>Rationale:</label>
            <textarea
              id='rationale_of_importance'
              name='rationale_of_importance'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.rationale_of_importance}
              aria-required='true'
              aria-describedby='rationale_error'
            />
            {formik.errors.rationale_of_importance && (
              <div id='rationale_error' className='text-danger' role='alert'>
                {formik.errors.rationale_of_importance}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='assessment_outcome_date'>
              Assessment Outcome Date:
            </label>
            <input
              type='date'
              id='assessment_outcome_date'
              name='assessment_outcome_date'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.assessment_outcome_date}
              aria-required='true'
              aria-describedby='assessment_outcome_date_error'
            />
            {formik.errors.assessment_outcome_date && (
              <div
                id='assessment_outcome_date_error'
                className='text-danger'
                role='alert'
              >
                {formik.errors.assessment_outcome_date}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='sutability_note'>Note:</label>
            <textarea
              id='sutability_note'
              name='sutability_note'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.sutability_note}
              aria-describedby='sutability_note_error'
            />
            {formik.errors.sutability_note && (
              <div
                id='sutability_note_error'
                className='text-danger'
                role='alert'
              >
                {formik.errors.sutability_note}
              </div>
            )}
          </div>
          {!viewOnly && (
            <button
              type='submit'
              className='btn btn-primary mb-2'
              aria-label={showSaveButton ? 'Save the form' : 'Submit the form'}
            >
              {showSaveButton ? 'Save' : 'Submit'}
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default Suitability
