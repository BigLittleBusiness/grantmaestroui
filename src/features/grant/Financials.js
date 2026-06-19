import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { fetchTeamMembers } from 'features/teamMember/teamMemberSlice'
import ExpenseItem from 'features/grant/ExpenseItem'

const validationSchema = yup.object({
  won_fund_amount: yup.number().required('Won fund amount is required'),
  received_fund_amount: yup.number().required('Received fund amount is required'),
  total_amount_spent: yup.number().required('Total amount spent is required'),
  financial_note: yup.string().required('Financial note is required'),
  account_used_for_expenses: yup.string().required('Please provide account number'),
})

const Financials = ({
  onSubmit,
  viewOnly,
  showTitle = true,
  showSaveButton = false,
}) => {
  const dispatch = useDispatch()
  const grant    = useSelector((state) => state.grant.grant)
  const [expenses, setExpenses] = useState(grant?.item_expenses || [])

  const formik = useFormik({
    initialValues: {
      won_fund_amount: grant?.won_fund_amount || '',
      received_fund_amount: grant?.received_fund_amount || '',
      total_amount_spent: grant?.total_amount_spent || '',
      financial_note: grant?.latest_financial_note || '',
      account_used_for_expenses: grant?.account_used_for_expenses || '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(grant.organization_grant_id, values)
    },
    enableReinitialize: true,
  })

  useEffect(() => {
    dispatch(fetchTeamMembers())
  }, [dispatch])

  // Keep local expenses in sync when grant changes
  useEffect(() => {
    setExpenses(grant?.item_expenses || [])
  }, [grant])

  const fmt = (n) =>
    n ? `$${Number(n).toLocaleString('en-AU')}` : '—'

  // -------------------------------------------------------------------------
  // viewOnly — visual field cards in a 2-column grid
  // -------------------------------------------------------------------------
  if (viewOnly) {
    return (
      <div className='tab-pane fade show active gm-detail-tab' id='financials1'>
        {showTitle && <h5 className='gm-tab-title'>Financials</h5>}
        <div className='gm-field-grid'>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Funds Won</span>
            <span className='gm-field-value'>{fmt(grant.won_fund_amount)}</span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Funds Received</span>
            <span className='gm-field-value'>{fmt(grant.received_fund_amount)}</span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Total Amount Spent</span>
            <span className='gm-field-value'>{fmt(grant.total_amount_spent)}</span>
          </div>
          <div className='gm-field-card'>
            <span className='gm-field-label'>Account Used</span>
            <span className='gm-field-value'>{grant.account_used_for_expenses || '—'}</span>
          </div>
          <div className='gm-field-card gm-field-card--full'>
            <span className='gm-field-label'>Note</span>
            <span className='gm-field-value'>{grant.latest_financial_note || '—'}</span>
          </div>
        </div>
        <div className='mt-3'>
          <ExpenseItem
            expenses={expenses}
            setExpenses={setExpenses}
            grantId={grant.organization_grant_id}
            viewOnly={viewOnly}
          />
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Edit form — 2-column grid on desktop
  // -------------------------------------------------------------------------
  return (
    <div className='tab-pane fade show active gm-detail-tab' id='financials1'>
      {showTitle && <h5 className='gm-tab-title'>Financials</h5>}
      <form onSubmit={formik.handleSubmit}>
        <div className='gm-form-grid'>
          {/* Funds Won */}
          <div className='gm-form-field'>
            <label className='gm-form-label'>
              Funds Won <span className='text-danger'>*</span>
            </label>
            <input
              type='number'
              name='won_fund_amount'
              className={`form-control ${formik.errors.won_fund_amount ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.won_fund_amount}
            />
            {formik.errors.won_fund_amount && (
              <div className='invalid-feedback'>{formik.errors.won_fund_amount}</div>
            )}
          </div>

          {/* Funds Received */}
          <div className='gm-form-field'>
            <label className='gm-form-label'>
              Funds Received <span className='text-danger'>*</span>
            </label>
            <input
              type='number'
              name='received_fund_amount'
              className={`form-control ${formik.errors.received_fund_amount ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.received_fund_amount}
            />
            {formik.errors.received_fund_amount && (
              <div className='invalid-feedback'>{formik.errors.received_fund_amount}</div>
            )}
          </div>

          {/* Total Amount Spent */}
          <div className='gm-form-field'>
            <label className='gm-form-label'>
              Total Amount Spent <span className='text-danger'>*</span>
            </label>
            <input
              type='number'
              name='total_amount_spent'
              className={`form-control ${formik.errors.total_amount_spent ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.total_amount_spent}
            />
            {formik.errors.total_amount_spent && (
              <div className='invalid-feedback'>{formik.errors.total_amount_spent}</div>
            )}
          </div>

          {/* Account Used */}
          <div className='gm-form-field'>
            <label className='gm-form-label'>
              Account Used <span className='text-danger'>*</span>
            </label>
            <input
              type='text'
              name='account_used_for_expenses'
              className={`form-control ${formik.errors.account_used_for_expenses ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.account_used_for_expenses}
            />
            {formik.errors.account_used_for_expenses && (
              <div className='invalid-feedback'>{formik.errors.account_used_for_expenses}</div>
            )}
          </div>

          {/* Financial Note — full width */}
          <div className='gm-form-field gm-form-field--full'>
            <label className='gm-form-label'>
              Financial Note <span className='text-danger'>*</span>
            </label>
            <textarea
              name='financial_note'
              className={`form-control ${formik.errors.financial_note ? 'is-invalid' : ''}`}
              rows={2}
              onChange={formik.handleChange}
              value={formik.values.financial_note}
            />
            {formik.errors.financial_note && (
              <div className='invalid-feedback'>{formik.errors.financial_note}</div>
            )}
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

      {/* Expense items always shown below the form */}
      <div className='mt-3'>
        <ExpenseItem
          expenses={expenses}
          setExpenses={setExpenses}
          grantId={grant.organization_grant_id}
          viewOnly={viewOnly}
        />
      </div>
    </div>
  )
}

export default Financials
