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

  // -------------------------------------------------------------------------
  // viewOnly — visual field cards in a 2-column grid
  // -------------------------------------------------------------------------
  if (viewOnly) {
    return (
      <div className='tab-pane fade show active gm-detail-tab' id='suitability'>
        {showTitle && <h5 className='gm-tab-title'>Suitability</h5>}
        <div className='gm-field-grid'>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Internal Decision Date</span>
            <span className='gm-field-value'>{grant.decision_date || '—'}</span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Closing Date</span>
            <span className='gm-field-value'>{grant.closing_date || '—'}</span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Determination</span>
            <span className='gm-field-value'>{grant.determination || '—'}</span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Assessment Outcome Date</span>
            <span className='gm-field-value'>{grant.assessment_outcome_date || '—'}</span>
          </div>
          <div className='gm-field-card gm-field-card--full'>
            <span className='gm-field-label'>Rationale</span>
            <span className='gm-field-value'>{grant.rationale_of_importance || '—'}</span>
          </div>
          <div className='gm-field-card gm-field-card--full'>
            <span className='gm-field-label'>Note</span>
            <span className='gm-field-value'>{grant.latest_suitability_note || '—'}</span>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Edit form — 2-column grid on desktop
  // -------------------------------------------------------------------------
  return (
    <div className='tab-pane fade show active gm-detail-tab' id='suitability'>
      {showTitle && <h5 className='gm-tab-title'>Suitability</h5>}
      <form onSubmit={formik.handleSubmit}>
        <div className='gm-form-grid'>
          {/* Internal Decision Date */}
          <div className='gm-form-field'>
            <label htmlFor='decision_date' className='gm-form-label'>
              Internal Decision Date <span className='text-danger'>*</span>
            </label>
            <input
              type='date'
              id='decision_date'
              name='decision_date'
              className={`form-control ${formik.errors.decision_date ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.decision_date}
            />
            {formik.errors.decision_date && (
              <div className='invalid-feedback'>{formik.errors.decision_date}</div>
            )}
          </div>

          {/* Assessment Outcome Date */}
          <div className='gm-form-field'>
            <label htmlFor='assessment_outcome_date' className='gm-form-label'>
              Assessment Outcome Date <span className='text-danger'>*</span>
            </label>
            <input
              type='date'
              id='assessment_outcome_date'
              name='assessment_outcome_date'
              className={`form-control ${formik.errors.assessment_outcome_date ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.assessment_outcome_date}
            />
            {formik.errors.assessment_outcome_date && (
              <div className='invalid-feedback'>{formik.errors.assessment_outcome_date}</div>
            )}
          </div>

          {/* Determination */}
          <div className='gm-form-field'>
            <label htmlFor='determination' className='gm-form-label'>
              Determination <span className='text-danger'>*</span>
            </label>
            <select
              id='determination'
              name='determination'
              className={`form-select ${formik.errors.determination ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.determination}
            >
              <option value=''>Select an option</option>
              <option value='Proceed'>Proceed</option>
              <option value='Not Proceed'>Not Proceed</option>
            </select>
            {formik.errors.determination && (
              <div className='invalid-feedback'>{formik.errors.determination}</div>
            )}
          </div>

          {/* Rationale — full width */}
          <div className='gm-form-field gm-form-field--full'>
            <label htmlFor='rationale_of_importance' className='gm-form-label'>
              Rationale <span className='text-danger'>*</span>
            </label>
            <textarea
              id='rationale_of_importance'
              name='rationale_of_importance'
              className={`form-control ${formik.errors.rationale_of_importance ? 'is-invalid' : ''}`}
              rows={3}
              onChange={formik.handleChange}
              value={formik.values.rationale_of_importance}
            />
            {formik.errors.rationale_of_importance && (
              <div className='invalid-feedback'>{formik.errors.rationale_of_importance}</div>
            )}
          </div>

          {/* Note — full width */}
          <div className='gm-form-field gm-form-field--full'>
            <label htmlFor='sutability_note' className='gm-form-label'>Note</label>
            <textarea
              id='sutability_note'
              name='sutability_note'
              className='form-control'
              rows={2}
              onChange={formik.handleChange}
              value={formik.values.sutability_note}
            />
          </div>
        </div>

        {!viewOnly && (
          <div className='gm-form-actions'>
            <button
              type='submit'
              className='btn btn-primary'
              aria-label={showSaveButton ? 'Save the form' : 'Submit the form'}
            >
              {showSaveButton ? 'Save' : 'Submit'}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default Suitability
