import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import ReportItem from './ReportItem'
import { setSingleReportData } from './grantSlice'

const validationSchema = yup.object({
  report_title: yup.string().required('Report title is required'),
  report_submission_date: yup.date().required('Submission date is required'),
  report_status: yup.string().required('Status is required'),
  report_file: yup.string().optional(),
  report_template_received: yup.string().optional(),
  report_template_file: yup.string().optional(),
})

const GrantReporting = ({
  onSubmit,
  viewOnly,
  showTitle = true,
  showSaveButton = false,
}) => {
  const dispatch = useDispatch()
  const grant = useSelector((state) => state.grant.grant)
  const report = useSelector((state) => state.grant.report)
  const [isFormVisible, setIsFormVisible] = useState(false)

  const relatedReports = grant ? grant?.reports : []

  const [reportFile, setReportFile] = useState(null)
  const [reportTemplateFile, setReportTemplateFile] = useState(null)

  const getReportDetails = (id) => {
    const reportDetails = grant.reports.find((el) => el.report_id === id)
    setIsFormVisible(true)
    dispatch(setSingleReportData({ report: reportDetails }))
  }

  const formik = useFormik({
    initialValues: {
      report_id: report?.report_id || '',
      report_title: report?.report_title || '',
      report_submission_date: report?.report_submission_date || '',
      report_status: report?.report_status || '',
      report_template_received: report?.report_template_received || '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = new FormData()
      formData.append('grant_id', grant.organization_grant_id)
      formData.append('organization_grant_id', grant.organization_grant_id)
      formData.append('report_id', values.report_id)
      formData.append('report_title', values.report_title)
      formData.append('report_submission_date', values.report_submission_date)
      formData.append('report_status', values.report_status)
      formData.append(
        'report_template_received',
        values.report_template_received
      )
      formData.append('report_file', reportFile)
      formData.append('report_template_file', reportTemplateFile)

      onSubmit(formData)
      dispatch(setSingleReportData({ report: {} }))
      formik.resetForm() // Reset form to initial values
      setReportFile(null) // Clear file inputs
      setReportTemplateFile(null)
    },
    enableReinitialize: true,
  })
  const handleNewFormClick = () => {
    dispatch(setSingleReportData({ report: {} }))
    formik.resetForm() // Reset form to initial values
    setReportFile(null) // Clear file inputs
    setReportTemplateFile(null)
    setIsFormVisible(true) // Show the form
  }
  if (viewOnly) {
    return (
      <div className='tab-pane fade show active' id='reporting-content'>
        {relatedReports && relatedReports.length > 0 ? (
          <ReportItem
            reports={relatedReports}
            setSingleReportId={getReportDetails}
            viewOnly={viewOnly}
          />
        ) : (
          <span>No reports available.</span>
        )}
      </div>
    )
  }

  // Render as a form when viewOnly is false
  return (
    <div className='tab-pane fade show active' id='reporting-content'>
      {showTitle && <h5 className='mb-2'>Grant Reporting</h5>}
      <div className='d-flex justify-content-end'>
        <button
          className='btn btn-primary mt-1 mb-2'
          onClick={handleNewFormClick}
        >
          Add New Report
        </button>
      </div>
      {isFormVisible && (
        <div className='card-body'>
          <form onSubmit={formik.handleSubmit}>
            <div className='form-group'>
              <input
                type='hidden'
                name='report_id'
                value={formik.values.report_id}
              />
              <label htmlFor='report_title'>Report Title:</label>
              <input
                id='report_title'
                type='text'
                name='report_title'
                className='form-control'
                onChange={formik.handleChange}
                value={formik.values.report_title}
              />
              {formik.errors.report_title && (
                <div className='text-danger'>{formik.errors.report_title}</div>
              )}
            </div>
            <div className='form-group'>
              <label>Submission Date:</label>
              <input
                type='date'
                name='report_submission_date'
                className='form-control'
                onChange={formik.handleChange}
                value={formik.values.report_submission_date}
              />
              {formik.errors.report_submission_date && (
                <div className='text-danger'>
                  {formik.errors.report_submission_date}
                </div>
              )}
            </div>
            <div className='form-group'>
              <label>Status:</label>
              <select
                name='report_status'
                className='form-control'
                onChange={formik.handleChange}
                value={formik.values.report_status}
              >
                <option value=''>Select Status</option>
                <option value='Submitted'>Submitted</option>
                <option value='Pending'>Pending</option>
              </select>
              {formik.errors.report_status && (
                <div className='text-danger'>{formik.errors.report_status}</div>
              )}
            </div>
            <div className='form-group'>
              <label>Filename:</label>
              <input
                type='file'
                className='form-control'
                onChange={(event) => setReportFile(event.target.files[0])}
              />
              {formik.errors.report_file && (
                <div className='text-danger'>{formik.errors.report_file}</div>
              )}
            </div>
            <div className='form-group'>
              <label>Template Received:</label>
              <div className='form-check'>
                <input
                  type='radio'
                  name='report_template_received'
                  value='true'
                  className='form-check-input'
                  onChange={formik.handleChange}
                  checked={formik.values.report_template_received === 'true'}
                />
                <label className='form-check-label'>Yes</label>
              </div>
              <div className='form-check'>
                <input
                  type='radio'
                  name='report_template_received'
                  value='false'
                  className='form-check-input'
                  onChange={formik.handleChange}
                  checked={formik.values.report_template_received === 'false'}
                />
                <label className='form-check-label'>No</label>
              </div>
              {formik.errors.report_template_received && (
                <div className='text-danger'>
                  {formik.errors.report_template_received}
                </div>
              )}
            </div>
            <div className='form-group'>
              <label>Report Template:</label>
              <input
                type='file'
                className='form-control'
                onChange={(event) =>
                  setReportTemplateFile(event.target.files[0])
                }
              />
              {formik.errors.report_template_file && (
                <div className='text-danger'>
                  {formik.errors.report_template_file}
                </div>
              )}
            </div>
            {!viewOnly && (
              <button type='submit' className='btn btn-primary mt-3'>
                {showSaveButton ? 'Save' : 'Submit'}
              </button>
            )}
          </form>
        </div>
      )}
      <div className='info'>
        {relatedReports && relatedReports.length > 0 ? (
          <ReportItem
            reports={relatedReports}
            setSingleReportId={getReportDetails}
          />
        ) : (
          <span>No reports available.</span>
        )}
      </div>
    </div>
  )
}

export default GrantReporting
