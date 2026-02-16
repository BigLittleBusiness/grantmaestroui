import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { fetchGrantCategoryList } from './grantSlice'

const validationSchema = yup.object({
  grant_title: yup.string().required('Grant title is required'),
  origination_url: yup
    .string()
    .url('Invalid URL')
    .required('Grant URL is required'),
  opening_date: yup.date().required('Opening date is required'),
  closing_date: yup.date().required('Closing date is required'),
  fund_originator: yup.string().required('Fund Originator is required'),
  max_fund_amount: yup.number().required('Max funds is required'),
  category_id: yup.string().required('Category is required'),
})

const GrantFinding = ({
  onSubmit,
  viewOnly,
  showTitle = true,
  showSaveButton = false,
}) => {
  const { grant, error } = useSelector((state) => state.grant)
  const dispatch = useDispatch()
  const categoryList = useSelector((state) => state.grant.grantCategory)
  const formik = useFormik({
    initialValues: {
      grant_title: grant?.grant_title || '',
      origination_url: grant?.origination_url || '',
      opening_date: grant?.opening_date || '',
      closing_date: grant?.closing_date || '',
      max_fund_amount: grant?.max_fund_amount || '',
      category_id: grant?.category_id || '',
      fund_originator: grant?.fund_originator || '',
      finding_note: grant?.latest_finding_note || '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      showSaveButton === false
        ? onSubmit(values)
        : onSubmit(grant.organization_grant_id, values)
    },
    enableReinitialize: true,
  })

  useEffect(() => {
    dispatch(fetchGrantCategoryList())
  }, [dispatch])

  if (viewOnly) {
    // Render as static information when viewOnly is true
    return (
      <div className='tab-pane fade show active' id='grant-finding'>
        <div className='card-body'>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Grant Title:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.grant_title}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Grant URL:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.origination_url}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Fund Originator:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.fund_originator}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Max Funds:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.max_fund_amount}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Category:</strong>
              </div>
            </div>
            <span className='plane-rate'>
              {categoryList.find(
                (category) => category.grant_category_id === grant.category_id
              )?.grant_category_name || 'N/A'}
            </span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Opening Date:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.opening_date}</span>
          </div>
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
                <strong>Note:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.latest_finding_note}</span>
          </div>
        </div>
      </div>
    )
  }

  // Render as a form when viewOnly is false
  return (
    <div className='tab-pane fade show active' id='grant-finding'>
      {showTitle && <h5 className='mb-3'>Grant FOund</h5>}
      <div className='card-body'>
        <form onSubmit={formik.handleSubmit} aria-labelledby='grant-finding'>
          <div className='form-group mb-3'>
            <label htmlFor='grant_title'>Grant Title:</label>
            <input
              type='text'
              id='grant_title'
              name='grant_title'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.grant_title}
              aria-describedby='grant_title_error'
            />
            {formik.errors.grant_title && (
              <div id='grant_title_error' className='text-danger'>
                {formik.errors.grant_title}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='origination_url'>Grant URL:</label>
            <input
              type='url'
              id='origination_url'
              name='origination_url'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.origination_url}
              aria-describedby='origination_url_error'
            />
            {formik.errors.origination_url && (
              <div id='origination_url_error' className='text-danger'>
                {formik.errors.origination_url}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='closing_date'>Opening Date:</label>
            <input
              type='date'
              id='opening_date'
              name='opening_date'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.opening_date}
              aria-required='true'
              aria-describedby='opening_date_error'
            />
            {formik.errors.opening_date && (
              <div id='opening_date_error' className='text-danger' role='alert'>
                {formik.errors.opening_date}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='closing_date'>Closing Date:</label>
            <input
              type='date'
              id='closing_date'
              name='closing_date'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.closing_date}
              aria-required='true'
              aria-describedby='closing_date_error'
            />
            {formik.errors.closing_date && (
              <div id='closing_date_error' className='text-danger' role='alert'>
                {formik.errors.closing_date}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='fund_originator'>Fund Originator:</label>
            <input
              type='text'
              id='fund_originator'
              name='fund_originator'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.fund_originator}
              aria-describedby='fund_originator_error'
            />
            {formik.errors.fund_originator && (
              <div id='fund_originator_error' className='text-danger'>
                {formik.errors.fund_originator}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='max_fund_amount'>Max Funds:</label>
            <input
              type='number'
              id='max_fund_amount'
              name='max_fund_amount'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.max_fund_amount}
              aria-describedby='max_fund_amount_error'
            />
            {formik.errors.max_fund_amount && (
              <div id='max_fund_amount_error' className='text-danger'>
                {formik.errors.max_fund_amount}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='category_id'>Category:</label>
            <select
              id='category_id'
              name='category_id'
              className='form-select'
              onChange={formik.handleChange}
              value={formik.values.category_id}
              aria-describedby='category_id_error'
            >
              <option value=''>Select a category</option>
              {categoryList?.map((category) => (
                <option
                  key={category.grant_category_id}
                  value={category.grant_category_id}
                >
                  {category.grant_category_name}
                </option>
              ))}
            </select>
            {formik.errors.category_id && (
              <div id='category_id_error' className='text-danger'>
                {formik.errors.category_id}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='finding_note'>Note:</label>
            <input
              type='text'
              id='finding_note'
              name='finding_note'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.finding_note}
              aria-describedby='finding_note_error'
            />
            {formik.errors.finding_note && (
              <div id='finding_note_error' className='text-danger'>
                {formik.errors.finding_note}
              </div>
            )}
          </div>
          {!viewOnly && (
            <button
              type='submit'
              className='btn btn-primary mb-2'
              aria-label={showSaveButton ? 'Save Grant' : 'Submit Grant'}
            >
              {showSaveButton ? 'Save' : 'Submit'}
            </button>
          )}
        </form>
        {error && <p className='text-danger'>{error.message}</p>}
      </div>
    </div>
  )
}

export default GrantFinding
