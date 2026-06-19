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
      outcome: grant?.outcome || '',
      outcome_date: grant?.outcome_date || '',
      agreement_signed: grant?.agreement_signed || '',
      learning: grant?.learning || '',
      outcome_note: grant?.latest_outcome_note || '',
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
      <div className='tab-pane fade show active gm-detail-tab' id='outcome'>
        {showTitle && <h5 className='gm-tab-title'>Submission Outcome</h5>}
        <div className='gm-field-grid'>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Outcome</span>
            <span
              className='gm-field-value'
              style={{
                color:
                  grant.outcome === 'Won'
                    ? '#28a745'
                    : grant.outcome === 'Lost' || grant.outcome === 'Declined'
                    ? '#dc3545'
                    : 'inherit',
                fontWeight: 600,
              }}
            >
              {grant.outcome || '—'}
            </span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Outcome Date</span>
            <span className='gm-field-value'>{grant.outcome_date || '—'}</span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Agreement Signed</span>
            <span className='gm-field-value'>{grant.agreement_signed || '—'}</span>
          </div>
          <div className='gm-field-card gm-field-card--full'>
            <span className='gm-field-label'>Learnings</span>
            <span className='gm-field-value'>{grant.learning || '—'}</span>
          </div>
          <div className='gm-field-card gm-field-card--full'>
            <span className='gm-field-label'>Note</span>
            <span className='gm-field-value'>{grant.latest_outcome_note || '—'}</span>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Edit form — 2-column grid on desktop
  // -------------------------------------------------------------------------
  return (
    <div className='tab-pane fade show active gm-detail-tab' id='outcome'>
      {showTitle && <h5 className='gm-tab-title'>Submission Outcome</h5>}
      <form onSubmit={formik.handleSubmit}>
        <div className='gm-form-grid'>
          {/* Outcome */}
          <div className='gm-form-field'>
            <label className='gm-form-label'>
              Outcome <span className='text-danger'>*</span>
            </label>
            <select
              name='outcome'
              className={`form-select ${formik.errors.outcome ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.outcome}
            >
              <option value=''>Select Outcome</option>
              <option value='Won'>Won</option>
              <option value='Lost'>Lost</option>
              <option value='Declined'>Declined</option>
            </select>
            {formik.errors.outcome && (
              <div className='invalid-feedback'>{formik.errors.outcome}</div>
            )}
          </div>

          {/* Outcome Date */}
          <div className='gm-form-field'>
            <label className='gm-form-label'>
              Outcome Date <span className='text-danger'>*</span>
            </label>
            <input
              type='date'
              name='outcome_date'
              className={`form-control ${formik.errors.outcome_date ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.outcome_date}
            />
            {formik.errors.outcome_date && (
              <div className='invalid-feedback'>{formik.errors.outcome_date}</div>
            )}
          </div>

          {/* Agreement Signed */}
          <div className='gm-form-field'>
            <label className='gm-form-label'>
              Agreement Signed <span className='text-danger'>*</span>
            </label>
            <select
              name='agreement_signed'
              className={`form-select ${formik.errors.agreement_signed ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.agreement_signed}
            >
              <option value=''>Select</option>
              <option value='Yes'>Yes</option>
              <option value='No'>No</option>
            </select>
            {formik.errors.agreement_signed && (
              <div className='invalid-feedback'>{formik.errors.agreement_signed}</div>
            )}
          </div>

          {/* Learnings — full width */}
          <div className='gm-form-field gm-form-field--full'>
            <label className='gm-form-label'>
              Learnings <span className='text-danger'>*</span>
            </label>
            <textarea
              name='learning'
              className={`form-control ${formik.errors.learning ? 'is-invalid' : ''}`}
              rows={3}
              onChange={formik.handleChange}
              value={formik.values.learning}
            />
            {formik.errors.learning && (
              <div className='invalid-feedback'>{formik.errors.learning}</div>
            )}
          </div>

          {/* Note — full width */}
          <div className='gm-form-field gm-form-field--full'>
            <label className='gm-form-label'>Note</label>
            <textarea
              name='outcome_note'
              className='form-control'
              rows={2}
              onChange={formik.handleChange}
              value={formik.values.outcome_note}
            />
          </div>
        </div>

        {!viewOnly && (
          <div className='gm-form-actions'>
            <button type='submit' className='btn btn-primary'>
              {showSaveButton ? 'Save' : 'Submit'}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default Outcome
