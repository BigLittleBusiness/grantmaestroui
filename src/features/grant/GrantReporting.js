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
  const [reportFile, setReportFile] = useState(null)
  const [reportTemplateFile, setReportTemplateFile] = useState(null)

  const relatedReports = grant?.reports || []

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
      formData.append('report_template_received', values.report_template_received)
      formData.append('report_file', reportFile)
      formData.append('report_template_file', reportTemplateFile)
      onSubmit(formData)
      dispatch(setSingleReportData({ report: {} }))
      formik.resetForm()
      setReportFile(null)
      setReportTemplateFile(null)
    },
    enableReinitialize: true,
  })

  const handleNewFormClick = () => {
    dispatch(setSingleReportData({ report: {} }))
    formik.resetForm()
    setReportFile(null)
    setReportTemplateFile(null)
    setIsFormVisible(true)
  }

  // -------------------------------------------------------------------------
  // viewOnly — improved empty state + report list
  // -------------------------------------------------------------------------
  if (viewOnly) {
    return (
      <div className='tab-pane fade show active gm-detail-tab' id='reporting-content'>
        {showTitle && <h5 className='gm-tab-title'>Grant Reporting</h5>}
        {relatedReports.length > 0 ? (
          <ReportItem
            reports={relatedReports}
            setSingleReportId={getReportDetails}
            viewOnly={viewOnly}
          />
        ) : (
          <div className='gm-empty-state'>
            <div className='gm-empty-state__icon' style={{ fontSize: 32 }}>📄</div>
            <p className='gm-empty-state__body mb-0'>No reports have been added yet.</p>
          </div>
        )}
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Edit form — 2-column grid on desktop
  // -------------------------------------------------------------------------
  return (
    <div className='tab-pane fade show active gm-detail-tab' id='reporting-content'>
      {showTitle && <h5 className='gm-tab-title'>Grant Reporting</h5>}

      <div className='d-flex justify-content-end mb-2'>
        <button className='btn btn-primary btn-sm' onClick={handleNewFormClick}>
          + Add New Report
        </button>
      </div>

      {isFormVisible && (
        <div className='gm-form-grid mb-3' style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
          <form onSubmit={formik.handleSubmit} style={{ display: 'contents' }}>
            <input type='hidden' name='report_id' value={formik.values.report_id} />

            {/* Report Title — full width */}
            <div className='gm-form-field gm-form-field--full'>
              <label className='gm-form-label'>
                Report Title <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                name='report_title'
                className={`form-control ${formik.errors.report_title ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                value={formik.values.report_title}
              />
              {formik.errors.report_title && (
                <div className='invalid-feedback'>{formik.errors.report_title}</div>
              )}
            </div>

            {/* Submission Date */}
            <div className='gm-form-field'>
              <label className='gm-form-label'>
                Submission Date <span className='text-danger'>*</span>
              </label>
              <input
                type='date'
                name='report_submission_date'
                className={`form-control ${formik.errors.report_submission_date ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                value={formik.values.report_submission_date}
              />
              {formik.errors.report_submission_date && (
                <div className='invalid-feedback'>{formik.errors.report_submission_date}</div>
              )}
            </div>

            {/* Status */}
            <div className='gm-form-field'>
              <label className='gm-form-label'>
                Status <span className='text-danger'>*</span>
              </label>
              <select
                name='report_status'
                className={`form-select ${formik.errors.report_status ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                value={formik.values.report_status}
              >
                <option value=''>Select Status</option>
                <option value='Submitted'>Submitted</option>
                <option value='Pending'>Pending</option>
              </select>
              {formik.errors.report_status && (
                <div className='invalid-feedback'>{formik.errors.report_status}</div>
              )}
            </div>

            {/* Template Received */}
            <div className='gm-form-field'>
              <label className='gm-form-label'>Template Received</label>
              <div className='d-flex gap-3 mt-1'>
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
              </div>
            </div>

            {/* Report File */}
            <div className='gm-form-field'>
              <label className='gm-form-label'>Report File</label>
              <input
                type='file'
                className='form-control'
                onChange={(e) => setReportFile(e.target.files[0])}
              />
            </div>

            {/* Template File */}
            <div className='gm-form-field'>
              <label className='gm-form-label'>Report Template</label>
              <input
                type='file'
                className='form-control'
                onChange={(e) => setReportTemplateFile(e.target.files[0])}
              />
            </div>

            <div className='gm-form-field gm-form-field--full'>
              <button type='submit' className='btn btn-primary me-2'>
                {showSaveButton ? 'Save' : 'Submit'}
              </button>
              <button
                type='button'
                className='btn btn-outline-secondary'
                onClick={() => setIsFormVisible(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {relatedReports.length > 0 ? (
        <ReportItem
          reports={relatedReports}
          setSingleReportId={getReportDetails}
        />
      ) : (
        <div className='gm-empty-state'>
          <div className='gm-empty-state__icon' style={{ fontSize: 32 }}>📄</div>
          <p className='gm-empty-state__body mb-0'>No reports yet. Click "+ Add New Report" to get started.</p>
        </div>
      )}
    </div>
  )
}

export default GrantReporting
