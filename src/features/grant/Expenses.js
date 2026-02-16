import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import ExpenseItem from './ExpenseItem'
import { setSingleExpenseData } from './grantSlice'
import { fetchTeamMembers } from '../teamMember/teamMemberSlice'

const validationSchema = yup.object({
  expense_description: yup.string().required('Expense description is required'),
  expense_amount: yup.number().required('Expense amount is required'),
  expense_date: yup.date().required('Expense Date is required'),
  expense_paid_by: yup.number().required('Please select paid by'),
  expense_payee: yup.string().required('Expense payee is required'),
})

const Expenses = ({
  onSubmit,
  viewOnly,
  showTitle = true,
  showSaveButton = false,
}) => {
  const dispatch = useDispatch()
  const teamMembers = useSelector((state) => state.teamMember.teamMembers)
  const grant = useSelector((state) => state.grant.grant)
  const expense = useSelector((state) => state.grant.expense)

  const expenses = grant ? grant?.item_expenses : []

  // console.log(expenses)
  const getSingleExpense = (id) => {
    const expenseInfo = grant.item_expenses.find((el) => el.expense_id === id)
    dispatch(setSingleExpenseData({ expense: expenseInfo }))
  }

  const formik = useFormik({
    initialValues: {
      expense_id: expense?.expense_id || '',
      expense_description: expense?.expense_description || '',
      expense_amount: expense?.expense_amount || '',
      expense_date: expense?.expense_date || '',
      expense_paid_by: expense?.expense_paid_by || '',
      expense_payee: expense?.expense_payee || '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(grant.organization_grant_id, values)
    },
    enableReinitialize: true,
  })
  useEffect(() => {
    dispatch(fetchTeamMembers())
  }, [])
  return (
    <div className='tab-pane fade show active' id='financials' role='tabpanel'>
      {showTitle && <h5 className='mb-3'>Expenses</h5>}
      <div className='card-body'>
        <form onSubmit={formik.handleSubmit} aria-labelledby='expense'>
          <input
            type='hidden'
            name='expense_id'
            value={formik.values.expense_id}
          />
          <div className='form-group mb-3'>
            <label htmlFor='expense_description'>Description:</label>
            <textarea
              id='expense_description'
              name='expense_description'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.expense_description}
              aria-required='true'
              aria-describedby='expense_description_error'
            />
            {formik.errors.expense_description && (
              <div
                id='expense_description_error'
                className='text-danger'
                role='alert'
              >
                {formik.errors.expense_description}
              </div>
            )}
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor='expense_paid_by'>
              Expense Paid By:
            </label>
            <select
              id='expense_paid_by'
              name='expense_paid_by'
              className='form-select'
              value={formik.values.expense_paid_by}
              onChange={formik.handleChange}
            >
              <option value=''>Select member</option>
              {teamMembers.map((el, index) => (
                <>
                  <option value={el.user_id} key={index}>
                    {el.full_name}
                  </option>
                </>
              ))}
            </select>
            {formik.errors.expense_paid_by && (
              <div className='text-danger'>{formik.errors.expense_paid_by}</div>
            )}
          </div>
          <div className='form-group'>
            <label htmlFor='expense_payee'>Expense Payee:</label>
            <input
              type='text'
              name='expense_payee'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.expense_payee}
              aria-required='true'
              aria-describedby='expense_payee_error'
            />
            {formik.errors.expense_payee && (
              <div
                id='expense_payee_error'
                className='text-danger'
                role='alert'
              >
                {formik.errors.expense_payee}
              </div>
            )}
          </div>
          <div className='form-group'>
            <label htmlFor='expense_amount'>Expense Amount:</label>
            <input
              type='number'
              name='expense_amount'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.expense_amount}
              aria-required='true'
              aria-describedby='expense_amount_error'
            />
            {formik.errors.expense_amount && (
              <div
                id='expense_amount_error'
                className='text-danger'
                role='alert'
              >
                {formik.errors.expense_amount}
              </div>
            )}
          </div>
          <div className='form-group mb-3'>
            <label htmlFor='expense_date'>Expense Date:</label>
            <input
              type='date'
              id='expense_date'
              name='expense_date'
              className='form-control'
              onChange={formik.handleChange}
              value={formik.values.expense_date}
              aria-required='true'
              aria-describedby='expense_date_error'
            />
            {formik.errors.expense_date && (
              <div id='expense_date_error' className='text-danger' role='alert'>
                {formik.errors.expense_date}
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
      </div>

      <div className='info'>
        <label>Details of expenses incurred under the grant.:</label>
        {expenses && expenses.length > 0 ? (
          <ExpenseItem
            expenses={expenses}
            setSingleExpenseId={getSingleExpense}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default Expenses
