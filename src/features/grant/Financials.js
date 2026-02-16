import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import ExpenseItem from './ExpenseItem'
import { fetchTeamMembers } from '../teamMember/teamMemberSlice'

const validationSchema = yup.object({
  won_fund_amount: yup.number().required('Won fund amount is required'),
  received_fund_amount: yup
    .number()
    .required('Received fund amount is required'),
  total_amount_spent: yup.number().required('Total amount spent is required'),
  financial_note: yup.string().required('Financial note is required'),
  account_used_for_expenses: yup
    .string()
    .required('Please provide account number'),
})

const Financials = ({
  onSubmit,
  viewOnly,
  showTitle = true,
  showSaveButton = false,
}) => {
  const dispatch = useDispatch()
  const grant = useSelector((state) => state.grant.grant)
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

  if (viewOnly) {
    // Render as static information when viewOnly is true
    return (
      <div className='tab-pane fade show active' id='financials1'>
        <div className='card-body'>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Funds Won:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.won_fund_amount}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Funds Received:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.received_fund_amount}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Total Amount Spent:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.total_amount_spent}</span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Account Used:</strong>
              </div>
            </div>
            <span className='plane-rate'>
              {grant.account_used_for_expenses}
            </span>
          </div>
          <div className='dash-plane-list pt-2 pb-2'>
            <div className='plane-info'>
              <div className='plane-name'>
                <strong>Note:</strong>
              </div>
            </div>
            <span className='plane-rate'>{grant.latest_financial_note}</span>
          </div>
        </div>
        <div className='card-body'>
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

  // Render as a form when viewOnly is false
  return (
    <div className='tab-pane fade show active' id='financials1'>
      {showTitle && <h5 className='mb-2'>Financials</h5>}
      <div className='card-body'>
        <form onSubmit={formik.handleSubmit}>
          <div className='form-group'>
            <label>Funds Won:</label>
            <input
              type='number'
              name='won_fund_amount'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.won_fund_amount}
            />
            {formik.errors.won_fund_amount && (
              <div className='text-danger'>{formik.errors.won_fund_amount}</div>
            )}
          </div>
          <div className='form-group'>
            <label>Funds Received:</label>
            <input
              type='number'
              name='received_fund_amount'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.received_fund_amount}
            />
            {formik.errors.received_fund_amount && (
              <div className='text-danger'>
                {formik.errors.received_fund_amount}
              </div>
            )}
          </div>
          <div className='form-group'>
            <label>Total Amount Spent:</label>
            <input
              type='number'
              name='total_amount_spent'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.total_amount_spent}
            />
            {formik.errors.total_amount_spent && (
              <div className='text-danger'>
                {formik.errors.total_amount_spent}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='account_used_for_expenses'>Account Used:</label>
            <input
              type='text'
              id='account_used_for_expenses'
              name='account_used_for_expenses'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.account_used_for_expenses}
              aria-describedby='account_used_for_expenses_error'
            />
            {formik.errors.account_used_for_expenses && (
              <div id='account_used_for_expenses_error' className='text-danger'>
                {formik.errors.account_used_for_expenses}
              </div>
            )}
          </div>
          <div className='form-group  mt-2'>
            <label>Note:</label>
            <textarea
              name='financial_note'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.financial_note}
            />
            {formik.errors.financial_note && (
              <div className='text-danger'>{formik.errors.financial_note}</div>
            )}
          </div>
          {!viewOnly && (
            <button type='submit' className='btn btn-primary mt-3'>
              {showSaveButton ? 'Save' : 'Submit'}
            </button>
          )}
        </form>
      </div>
      <div className='card-body' styles={{ marginTop: '-5rem' }}>
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
