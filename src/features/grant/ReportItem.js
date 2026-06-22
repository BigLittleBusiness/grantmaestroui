import React from 'react'
import { useDispatch } from 'react-redux'
import { removeGrantReport } from './grantSlice'

const ReportItem = (props) => {
  const dispatch = useDispatch()
  const { reports, setSingleReportId, viewOnly } = props

  const actionHandler = (id) => {
    setSingleReportId(id)
  }
  const removeReport = (id) => {
    dispatch(removeGrantReport({ report_id: id }))
  }

  const handleDownload = (fileUrl) => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.setAttribute('target', '_blank')
    link.setAttribute('download', 'filename.pdf')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>status</th>
            <th>Submission Date</th>
            <th>Report Template Received</th>
            <th>Report File</th>
            {!viewOnly && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {reports.map((el, index) => (
            <tr key={index}>
              <td>{el.report_title}</td>
              <td>{el.report_status}</td>
              <td>{el.report_submission_date}</td>
              <td>{el.report_template_received ? 'Yes' : 'No'}</td>
              <td>
                {el.report_files.length > 0 ? (
                  <button
                    onClick={() => {
                      handleDownload(el.report_files[0].file_path)
                    }}
                  >
                    Download File
                  </button>
                ) : (
                  'No File'
                )}
              </td>
              {!viewOnly && (
                <td>
                  <button
                    onClick={() => actionHandler(el.report_id)}
                    className='btn btn-sm btn-primary me-2'
                  >
                    <i className='fa fa-edit'></i>
                  </button>
                  <button
                    onClick={() => removeReport(el.report_id)}
                    className='btn btn-sm btn-danger me-2'
                  >
                    <i className='fa fa-trash'></i>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default ReportItem
