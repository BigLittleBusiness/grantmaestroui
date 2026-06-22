import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeGrantExpenses, manageGrantExpenses } from './grantSlice'

const ExpenseItem = ({ expenses, setExpenses, grantId, viewOnly }) => {
  const dispatch = useDispatch()
  const teamMembers = useSelector((state) => state.teamMember.teamMembers)
  const [editingRow, setEditingRow] = useState(null)

  const handleEditChange = (e, index) => {
    const { name, value } = e.target
    const updatedExpenses = [...expenses]
    updatedExpenses[index] = { ...updatedExpenses[index], [name]: value }
    setExpenses(updatedExpenses)
  }

  const handleSave = (index) => {
    const expense = expenses[index]
    dispatch(manageGrantExpenses({ values: expense }))
    setEditingRow(null)
  }

  const handleRemove = (id) => {
    dispatch(removeGrantExpenses({ expense_id: id }))
    setExpenses(expenses.filter((expense) => expense.expense_id !== id))
  }

  const handleAddExpense = () => {
    const newExpense = {
      expense_description: '',
      expense_paid_by: '',
      expense_payee: '',
      expense_amount: '',
      expense_date: '',
      grant_id: grantId,
      isNew: true,
    }
    setExpenses([newExpense, ...expenses])
    setEditingRow(0)
  }

  const getPaidByName = (userId) => {
    const member = teamMembers.find((member) => member.user_id === userId)
    return member ? member.full_name : 'Team Member'
  }

  return (
    <>
      {!viewOnly && (
        <div className='d-flex justify-content-end mb-3'>
          <button className='btn btn-primary' onClick={handleAddExpense}>
            Add Expense
          </button>
        </div>
      )}
      <table className='table'>
        <thead>
          <tr>
            <th>Description</th>
            <th>Paid By</th>
            <th>Payee</th>
            <th>Amount</th>
            <th>Date</th>
            {!viewOnly && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={expense.expense_id}>
              {editingRow === index && !viewOnly ? (
                <>
                  <td>
                    <input
                      type='text'
                      name='expense_description'
                      value={expense.expense_description}
                      onChange={(e) => handleEditChange(e, index)}
                      className='form-control'
                    />
                  </td>
                  <td>
                    <select
                      name='expense_paid_by'
                      value={expense.expense_paid_by}
                      onChange={(e) => handleEditChange(e, index)}
                      className='form-control'
                    >
                      <option value=''>Select Team Member</option>
                      {teamMembers.map((member) => (
                        <option key={member.user_id} value={member.user_id}>
                          {member.full_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type='text'
                      name='expense_payee'
                      value={expense.expense_payee}
                      onChange={(e) => handleEditChange(e, index)}
                      className='form-control'
                    />
                  </td>
                  <td>
                    <input
                      type='number'
                      name='expense_amount'
                      value={expense.expense_amount}
                      onChange={(e) => handleEditChange(e, index)}
                      className='form-control'
                    />
                  </td>
                  <td>
                    <input
                      type='date'
                      name='expense_date'
                      value={expense.expense_date}
                      onChange={(e) => handleEditChange(e, index)}
                      className='form-control'
                    />
                  </td>
                  <td>
                    <button
                      className='btn btn-success btn-sm me-2'
                      onClick={() => handleSave(index)}
                    >
                      Save
                    </button>
                    <button
                      className='btn btn-secondary btn-sm'
                      onClick={() => setEditingRow(null)}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{expense.expense_description}</td>
                  <td>{getPaidByName(expense.expense_paid_by)}</td>
                  <td>{expense.expense_payee}</td>
                  <td>${expense.expense_amount}</td>
                  <td>{expense.expense_date}</td>
                  {!viewOnly && (
                    <td>
                      <button
                        className='btn btn-primary btn-sm me-2'
                        onClick={() => setEditingRow(index)}
                      >
                        <i className='fa fa-edit'></i>
                      </button>
                      <button
                        className='btn btn-danger btn-sm'
                        onClick={() => handleRemove(expense.expense_id)}
                      >
                        <i className='fa fa-trash'></i>
                      </button>
                    </td>
                  )}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default ExpenseItem
