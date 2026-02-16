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

  if (viewOnly) {
    // Render as static information when viewOnly is true
    return (
      <div className='tab-pane fade show active' id='submission'>
        <div className='card-body'>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Due Date:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.grant_submission_date}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Funding Sought:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.funding_sought_amount}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Submitted By:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.grant_submitted_by}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Department:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.submission_department}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Department Representative:</strong>
              </div>
            </div>
            <span className='plane-rate'>
              {grant.submission_department_representative}
            </span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Project Name:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.submission_project_name}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Reasoning:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.submission_reasoning}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Co-Contribution:</strong>
              </div>
            </div>
            <span className='plane-rate'>
              {grant.submission_co_contributor}
            </span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Note:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.latest_submission_note}</span>
          </div>
        </div>
      </div>
    )
  }

  // Render as a form when viewOnly is false
  return (
    <div className='tab-pane fade show active' id='submission'>
      {showTitle && <h5 className='mb-3'>Grant Submission</h5>}
      <div className='card-body'>
        <form onSubmit={formik.handleSubmit}>
          <div className='form-group mb-3'>
            <label>Submission Date:</label>
            <input
              type='date'
              name='grant_submission_date'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.grant_submission_date}
            />
            {formik.errors.grant_submission_date && (
              <div className='text-danger'>
                {formik.errors.grant_submission_date}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='funding_sought_amount'>Funding Sought:</label>
            <input
              type='number'
              id='funding_sought_amount'
              name='funding_sought_amount'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.funding_sought_amount}
              aria-describedby='funding_sought_amount_error'
            />
            {formik.errors.funding_sought_amount && (
              <div id='funding_sought_amount_error' className='text-danger'>
                {formik.errors.funding_sought_amount}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label>Submitted By:</label>
            <select
              name='grant_submitted_by'
              className='form-control'
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
              <div className='text-danger'>
                {formik.errors.grant_submitted_by}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label>Department:</label>
            <input
              type='text'
              name='submission_department'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.submission_department}
            />
            {formik.errors.submission_department && (
              <div className='text-danger'>
                {formik.errors.submission_department}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label>Department Representative:</label>
            <input
              type='text'
              name='submission_department_representative'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.submission_department_representative}
            />
            {formik.errors.submission_department_representative && (
              <div className='text-danger'>
                {formik.errors.submission_department_representative}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label>Project Name:</label>
            <input
              type='text'
              name='submission_project_name'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.submission_project_name}
            />
            {formik.errors.submission_project_name && (
              <div className='text-danger'>
                {formik.errors.submission_project_name}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label>Reasoning:</label>
            <input
              type='text'
              name='submission_reasoning'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.submission_reasoning}
            />
            {formik.errors.submission_reasoning && (
              <div className='text-danger'>
                {formik.errors.submission_reasoning}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label>Co-Contribution:</label>
            <input
              type='text'
              name='submission_co_contributor'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.submission_co_contributor}
            />
            {formik.errors.submission_co_contributor && (
              <div className='text-danger'>
                {formik.errors.submission_co_contributor}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label>Note:</label>
            <textarea
              name='submission_note'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.submission_note}
            />
            {formik.errors.submission_note && (
              <div className='text-danger'>{formik.errors.submission_note}</div>
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

export default Submission
