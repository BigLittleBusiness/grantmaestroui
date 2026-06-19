import React from 'react'
import { useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'

const validationSchema = yup.object({
  grant_submission_date: yup.date().required('Submission date is required'),
  grant_submitted_by: yup.string().required('Submitted by is required'),
  submission_department: yup.string().required('Department is required'),
  submission_department_representative: yup
    .string()
    .required('Department representative is required'),
  submission_project_name: yup.string().required('Project name is required'),
  submission_reasoning: yup.string().required('Reasoning is required'),
  submission_co_contributor: yup
    .string()
    .required('Co-contribution is required'),
  submission_note: yup.string().optional(),
  funding_sought_amount: yup.number().required('Funding sought is required'),
})

const Submission = ({
  onSubmit,
  viewOnly,
  showTitle = true,
  showSaveButton = false,
}) => {
  const grant = useSelector((state) => state.grant.grant)
  const teamMembers = useSelector((state) => state.teamMember.teamMembers)

  const formik = useFormik({
    initialValues: {
      grant_submission_date: grant?.grant_submission_date || '',
      grant_submitted_by: grant?.grant_submitted_by || '',
      submission_department: grant?.submission_department || '',
      funding_sought_amount: grant?.funding_sought_amount || '',
      submission_department_representative:
        grant?.submission_department_representative || '',
      submission_project_name: grant?.submission_project_name || '',
      submission_reasoning: grant?.submission_reasoning || '',
      submission_co_contributor: grant?.submission_co_contributor || '',
      submission_note: grant?.latest_submission_note || '',
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
      <div className='tab-pane fade show active gm-detail-tab' id='submission'>
        {showTitle && <h5 className='gm-tab-title'>Submission</h5>}
        <div className='gm-field-grid'>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Submission Date</span>
            <span className='gm-field-value'>{grant.grant_submission_date || '—'}</span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Funding Sought</span>
            <span className='gm-field-value'>
              {grant.funding_sought_amount
                ? `$${Number(grant.funding_sought_amount).toLocaleString('en-AU')}`
                : '—'}
            </span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Submitted By</span>
            <span className='gm-field-value'>{grant.grant_submitted_by || '—'}</span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Department</span>
            <span className='gm-field-value'>{grant.submission_department || '—'}</span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Department Representative</span>
            <span className='gm-field-value'>{grant.submission_department_representative || '—'}</span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Project Name</span>
            <span className='gm-field-value'>{grant.submission_project_name || '—'}</span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Co-Contribution</span>
            <span className='gm-field-value'>{grant.submission_co_contributor || '—'}</span>
          </div>
          <div className='gm-field-card gm-field-card--full'>
            <span className='gm-field-label'>Reasoning</span>
            <span className='gm-field-value'>{grant.submission_reasoning || '—'}</span>
          </div>
          <div className='gm-field-card gm-field-card--full'>
            <span className='gm-field-label'>Note</span>
            <span className='gm-field-value'>{grant.latest_submission_note || '—'}</span>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Edit form — 2-column grid on desktop
  // -------------------------------------------------------------------------
  return (
    <div className='tab-pane fade show active gm-detail-tab' id='submission'>
      {showTitle && <h5 className='gm-tab-title'>Submission</h5>}
      <form onSubmit={formik.handleSubmit}>
        <div className='gm-form-grid'>
          {/* Submission Date */}
          <div className='gm-form-field'>
            <label className='gm-form-label'>
              Submission Date <span className='text-danger'>*</span>
            </label>
            <input
              type='date'
              name='grant_submission_date'
              className={`form-control ${formik.errors.grant_submission_date ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.grant_submission_date}
            />
            {formik.errors.grant_submission_date && (
              <div className='invalid-feedback'>{formik.errors.grant_submission_date}</div>
            )}
          </div>

          {/* Funding Sought */}
          <div className='gm-form-field'>
            <label className='gm-form-label'>
              Funding Sought <span className='text-danger'>*</span>
            </label>
            <input
              type='number'
              name='funding_sought_amount'
              className={`form-control ${formik.errors.funding_sought_amount ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.funding_sought_amount}
            />
            {formik.errors.funding_sought_amount && (
              <div className='invalid-feedback'>{formik.errors.funding_sought_amount}</div>
            )}
          </div>

          {/* Submitted By */}
          <div className='gm-form-field'>
            <label className='gm-form-label'>
              Submitted By <span className='text-danger'>*</span>
            </label>
            <select
              name='grant_submitted_by'
              className={`form-select ${formik.errors.grant_submitted_by ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.grant_submitted_by}
            >
              <option value=''>Select a team member</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.full_name}>
                  {member.full_name}
                </option>
              ))}
            </select>
            {formik.errors.grant_submitted_by && (
              <div className='invalid-feedback'>{formik.errors.grant_submitted_by}</div>
            )}
          </div>

          {/* Department */}
          <div className='gm-form-field'>
            <label className='gm-form-label'>
              Department <span className='text-danger'>*</span>
            </label>
            <input
              type='text'
              name='submission_department'
              className={`form-control ${formik.errors.submission_department ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.submission_department}
            />
            {formik.errors.submission_department && (
              <div className='invalid-feedback'>{formik.errors.submission_department}</div>
            )}
          </div>

          {/* Department Representative */}
          <div className='gm-form-field'>
            <label className='gm-form-label'>
              Department Representative <span className='text-danger'>*</span>
            </label>
            <input
              type='text'
              name='submission_department_representative'
              className={`form-control ${formik.errors.submission_department_representative ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.submission_department_representative}
            />
            {formik.errors.submission_department_representative && (
              <div className='invalid-feedback'>{formik.errors.submission_department_representative}</div>
            )}
          </div>

          {/* Project Name */}
          <div className='gm-form-field'>
            <label className='gm-form-label'>
              Project Name <span className='text-danger'>*</span>
            </label>
            <input
              type='text'
              name='submission_project_name'
              className={`form-control ${formik.errors.submission_project_name ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.submission_project_name}
            />
            {formik.errors.submission_project_name && (
              <div className='invalid-feedback'>{formik.errors.submission_project_name}</div>
            )}
          </div>

          {/* Co-Contribution */}
          <div className='gm-form-field'>
            <label className='gm-form-label'>
              Co-Contribution <span className='text-danger'>*</span>
            </label>
            <input
              type='text'
              name='submission_co_contributor'
              className={`form-control ${formik.errors.submission_co_contributor ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.submission_co_contributor}
            />
            {formik.errors.submission_co_contributor && (
              <div className='invalid-feedback'>{formik.errors.submission_co_contributor}</div>
            )}
          </div>

          {/* Reasoning — full width */}
          <div className='gm-form-field gm-form-field--full'>
            <label className='gm-form-label'>
              Reasoning <span className='text-danger'>*</span>
            </label>
            <input
              type='text'
              name='submission_reasoning'
              className={`form-control ${formik.errors.submission_reasoning ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.submission_reasoning}
            />
            {formik.errors.submission_reasoning && (
              <div className='invalid-feedback'>{formik.errors.submission_reasoning}</div>
            )}
          </div>

          {/* Note — full width */}
          <div className='gm-form-field gm-form-field--full'>
            <label className='gm-form-label'>Note</label>
            <textarea
              name='submission_note'
              className='form-control'
              rows={2}
              onChange={formik.handleChange}
              value={formik.values.submission_note}
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

export default Submission
