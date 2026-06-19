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

  const categoryName =
    categoryList.find((c) => c.grant_category_id === grant?.category_id)
      ?.grant_category_name || 'N/A'

  // -------------------------------------------------------------------------
  // viewOnly — visual field cards in a 2-column grid
  // -------------------------------------------------------------------------
  if (viewOnly) {
    return (
      <div className='tab-pane fade show active gm-detail-tab' id='grant-finding'>
        {showTitle && <h5 className='gm-tab-title'>Grant Found</h5>}
        <div className='gm-field-grid'>
          <div className='gm-field-card gm-field-card--full'>
            <span className='gm-field-label'>Grant Title</span>
            <span className='gm-field-value'>{grant.grant_title || '—'}</span>
          </div>
          <div className='gm-field-card gm-field-card--full'>
            <span className='gm-field-label'>Grant URL</span>
            <span className='gm-field-value'>
              {grant.origination_url
                ? <a href={grant.origination_url} target='_blank' rel='noreferrer'>{grant.origination_url}</a>
                : '—'}
            </span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Opening Date</span>
            <span className='gm-field-value'>{grant.opening_date || '—'}</span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Closing Date</span>
            <span className='gm-field-value'>{grant.closing_date || '—'}</span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Fund Originator</span>
            <span className='gm-field-value'>{grant.fund_originator || '—'}</span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Max Funds</span>
            <span className='gm-field-value'>
              {grant.max_fund_amount
                ? `$${Number(grant.max_fund_amount).toLocaleString('en-AU')}`
                : '—'}
            </span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Category</span>
            <span className='gm-field-value'>{categoryName}</span>
          </div>
          <div className='gm-field-card gm-field-card--full'>
            <span className='gm-field-label'>Note</span>
            <span className='gm-field-value'>{grant.latest_finding_note || '—'}</span>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Edit form — 2-column grid on desktop
  // -------------------------------------------------------------------------
  return (
    <div className='tab-pane fade show active gm-detail-tab' id='grant-finding'>
      {showTitle && <h5 className='gm-tab-title'>Grant Found</h5>}
      <form onSubmit={formik.handleSubmit} aria-labelledby='grant-finding'>
        <div className='gm-form-grid'>
          {/* Grant Title — full width */}
          <div className='gm-form-field gm-form-field--full'>
            <label htmlFor='grant_title' className='gm-form-label'>
              Grant Title <span className='text-danger'>*</span>
            </label>
            <input
              type='text'
              id='grant_title'
              name='grant_title'
              className={`form-control ${formik.errors.grant_title ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.grant_title}
            />
            {formik.errors.grant_title && (
              <div className='invalid-feedback'>{formik.errors.grant_title}</div>
            )}
          </div>

          {/* Grant URL — full width */}
          <div className='gm-form-field gm-form-field--full'>
            <label htmlFor='origination_url' className='gm-form-label'>
              Grant URL <span className='text-danger'>*</span>
            </label>
            <input
              type='url'
              id='origination_url'
              name='origination_url'
              className={`form-control ${formik.errors.origination_url ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.origination_url}
            />
            {formik.errors.origination_url && (
              <div className='invalid-feedback'>{formik.errors.origination_url}</div>
            )}
          </div>

          {/* Opening Date */}
          <div className='gm-form-field'>
            <label htmlFor='opening_date' className='gm-form-label'>
              Opening Date <span className='text-danger'>*</span>
            </label>
            <input
              type='date'
              id='opening_date'
              name='opening_date'
              className={`form-control ${formik.errors.opening_date ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.opening_date}
            />
            {formik.errors.opening_date && (
              <div className='invalid-feedback'>{formik.errors.opening_date}</div>
            )}
          </div>

          {/* Closing Date */}
          <div className='gm-form-field'>
            <label htmlFor='closing_date' className='gm-form-label'>
              Closing Date <span className='text-danger'>*</span>
            </label>
            <input
              type='date'
              id='closing_date'
              name='closing_date'
              className={`form-control ${formik.errors.closing_date ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.closing_date}
            />
            {formik.errors.closing_date && (
              <div className='invalid-feedback'>{formik.errors.closing_date}</div>
            )}
          </div>

          {/* Fund Originator */}
          <div className='gm-form-field'>
            <label htmlFor='fund_originator' className='gm-form-label'>
              Fund Originator <span className='text-danger'>*</span>
            </label>
            <input
              type='text'
              id='fund_originator'
              name='fund_originator'
              className={`form-control ${formik.errors.fund_originator ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.fund_originator}
            />
            {formik.errors.fund_originator && (
              <div className='invalid-feedback'>{formik.errors.fund_originator}</div>
            )}
          </div>

          {/* Max Funds */}
          <div className='gm-form-field'>
            <label htmlFor='max_fund_amount' className='gm-form-label'>
              Max Funds <span className='text-danger'>*</span>
            </label>
            <input
              type='number'
              id='max_fund_amount'
              name='max_fund_amount'
              className={`form-control ${formik.errors.max_fund_amount ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.max_fund_amount}
            />
            {formik.errors.max_fund_amount && (
              <div className='invalid-feedback'>{formik.errors.max_fund_amount}</div>
            )}
          </div>

          {/* Category */}
          <div className='gm-form-field'>
            <label htmlFor='category_id' className='gm-form-label'>
              Category <span className='text-danger'>*</span>
            </label>
            <select
              id='category_id'
              name='category_id'
              className={`form-select ${formik.errors.category_id ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.category_id}
            >
              <option value=''>Select a category</option>
              {categoryList?.map((category) => (
                <option key={category.grant_category_id} value={category.grant_category_id}>
                  {category.grant_category_name}
                </option>
              ))}
            </select>
            {formik.errors.category_id && (
              <div className='invalid-feedback'>{formik.errors.category_id}</div>
            )}
          </div>

          {/* Note — full width */}
          <div className='gm-form-field gm-form-field--full'>
            <label htmlFor='finding_note' className='gm-form-label'>Note</label>
            <input
              type='text'
              id='finding_note'
              name='finding_note'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.finding_note}
            />
          </div>
        </div>

        {!viewOnly && (
          <div className='gm-form-actions'>
            <button
              type='submit'
              className='btn btn-primary'
              aria-label={showSaveButton ? 'Save Grant' : 'Submit Grant'}
            >
              {showSaveButton ? 'Save' : 'Submit'}
            </button>
          </div>
        )}
      </form>
      {error && <p className='text-danger mt-2'>{error.message}</p>}
    </div>
  )
}

export default GrantFinding
